import functions_framework
from flask import jsonify, request
from google.cloud import firestore
from vertexai.preview.generative_models import GenerativeModel
import vertexai

PROJECT_ID = "ticto-ml"
LOCATION = "us-central1"

db = firestore.Client(project=PROJECT_ID)
vertexai.init(project=PROJECT_ID, location=LOCATION)

@functions_framework.http
def iris_webhook(request_obj):
    """
    Endpoint para processar mensagens do usuário com IA

    Input:
    {
        "tenantId": "empresa-teste",
        "message": "Como funciona o produto X?",
        "userId": "user123"
    }

    Output:
    {
        "success": true,
        "response": "Resposta da IA...",
        "usedRAG": true
    }
    """

    # CORS
    if request_obj.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',
        }
        return ('', 204, headers)

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }

    try:
        data = request_obj.get_json()

        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400, headers

        tenant_id = data.get('tenantId')
        message = data.get('message')

        if not tenant_id or not message:
            return jsonify({
                'error': 'Missing required fields',
                'required': ['tenantId', 'message']
            }), 400, headers

        # 1. Carregar configuração do agente
        config_ref = db.collection('agent_configs').document(tenant_id)
        config_doc = config_ref.get()

        if not config_doc.exists:
            # Criar configuração padrão
            default_config = {
                'name': 'IRIS',
                'model': 'gemini-1.5-flash',
                'temperature': 0.7,
                'systemPrompt': 'Você é IRIS, um assistente virtual inteligente. Seja objetivo, profissional e útil.',
                'isActive': True,
                'useRAG': False,
                'createdAt': firestore.SERVER_TIMESTAMP,
                'updatedAt': firestore.SERVER_TIMESTAMP
            }
            config_ref.set(default_config)
            config = default_config
        else:
            config = config_doc.to_dict()

        if not config.get('isActive', False):
            return jsonify({'error': 'Agent is inactive'}), 403, headers

        # 2. Buscar contexto da base de conhecimento (se RAG ativo)
        context = ""
        used_rag = False

        if config.get('useRAG', False):
            try:
                kb_ref = db.collection('knowledge_base').document(tenant_id)\
                          .collection('documents')\
                          .where('status', '==', 'indexed')\
                          .limit(5)

                docs = kb_ref.stream()
                kb_contents = []

                for doc in docs:
                    doc_data = doc.to_dict()
                    if 'content' in doc_data and doc_data['content']:
                        kb_contents.append(doc_data['content'][:2000])  # Limitar tamanho

                if kb_contents:
                    context = "\n\n".join(kb_contents)
                    used_rag = True
            except Exception as e:
                print(f"RAG error (non-critical): {str(e)}")
                # Continua sem RAG se houver erro

        # 3. Gerar prompt completo
        system_prompt = config.get('systemPrompt', 'Você é um assistente virtual.')

        if context:
            full_prompt = f"""{system_prompt}

CONTEXTO (Base de Conhecimento):
{context}

PERGUNTA DO USUÁRIO:
{message}

Responda de forma objetiva, profissional e baseando-se no contexto fornecido quando disponível.
"""
        else:
            full_prompt = f"""{system_prompt}

PERGUNTA DO USUÁRIO:
{message}

Responda de forma objetiva e profissional.
"""

        # 4. Chamar Gemini
        model_name = config.get('model', 'gemini-1.5-flash')
        temperature = float(config.get('temperature', 0.7))

        model = GenerativeModel(model_name)
        response = model.generate_content(
            full_prompt,
            generation_config={
                'temperature': temperature,
                'max_output_tokens': 1024,
            }
        )

        answer = response.text

        return jsonify({
            'success': True,
            'response': answer,
            'usedRAG': used_rag,
            'model': model_name
        }), 200, headers

    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

        return jsonify({
            'success': False,
            'error': str(e),
            'type': type(e).__name__
        }), 500, headers
