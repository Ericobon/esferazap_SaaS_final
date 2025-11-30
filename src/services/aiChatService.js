/**
 * AI Chat Service
 * Handles AI-powered chat responses using RAG + Gemini
 */

import { getKnowledgeBase, getTenantConfig } from './cloudStorageService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * RAG simples: busca contexto relevante na base de conhecimento
 */
function simpleRAG(query, knowledgeBase, topK = 3) {
  if (!knowledgeBase || !query) return '';

  const queryLower = query.toLowerCase();
  const lines = knowledgeBase.split('\n\n');

  // Ranquear por número de palavras em comum
  const scores = [];

  for (const line of lines) {
    if (line.trim().length < 10) continue; // Ignorar linhas muito curtas

    const lineLower = line.toLowerCase();

    // Extrair palavras da query (mínimo 3 caracteres)
    const words = queryLower.match(/\w{3,}/g) || [];

    // Contar quantas palavras da query aparecem na linha
    const score = words.reduce((count, word) => {
      return count + (lineLower.includes(word) ? 1 : 0);
    }, 0);

    if (score > 0) {
      scores.push({ score, text: line });
    }
  }

  // Ordenar por score e pegar top K
  scores.sort((a, b) => b.score - a.score);
  const topChunks = scores.slice(0, topK).map(item => item.text);

  return topChunks.join('\n\n');
}

/**
 * Gera resposta usando IA (simulação local para MVP)
 * Em produção, isso deve chamar uma Cloud Function com Vertex AI
 */
async function generateAIResponse(userMessage, context, config) {
  try {
    // Tenta chamar API backend (Cloud Function)
    const response = await fetch(`${API_BASE_URL}/chat/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        context,
        config: {
          model: config?.ai?.model || 'gemini-1.5-flash-002',
          max_tokens: config?.ai?.max_tokens || 500,
          temperature: config?.ai?.temperature || 0.7
        }
      })
    }).catch(() => null);

    if (response?.ok) {
      const data = await response.json();
      return data.response;
    }

    // Fallback: resposta simples baseada em regras
    return generateFallbackResponse(userMessage, context);

  } catch (error) {
    console.error('Erro ao gerar resposta:', error);
    return generateFallbackResponse(userMessage, context);
  }
}

/**
 * Gera resposta de fallback quando API não está disponível
 */
function generateFallbackResponse(userMessage, context) {
  const messageLower = userMessage.toLowerCase();

  // Saudações
  if (/^(oi|olá|ola|hey|hi|hello|bom dia|boa tarde|boa noite)/.test(messageLower)) {
    return "Olá! Sou IRIS, assistente virtual da InsightEsfera. Como posso ajudar você hoje?";
  }

  // Perguntas sobre serviços
  if (/serviço|serviços|oferece|fazem|trabalham/.test(messageLower)) {
    return "A InsightEsfera oferece:\n\n1️⃣ Consultoria em BI\n2️⃣ Data Science & ML\n3️⃣ Automação com IA\n4️⃣ Engenharia de Dados\n\nSobre qual você gostaria de saber mais?";
  }

  // Perguntas sobre preços
  if (/preço|preços|valor|custo|quanto custa/.test(messageLower)) {
    return "Nossos modelos de precificação:\n\n💰 Consultoria por hora: R$ 300/h\n📦 Projetos fechados: sob consulta\n📅 Retainer mensal: a partir de R$ 10.000/mês\n\nQuer agendar uma conversa para entender melhor suas necessidades?";
  }

  // Perguntas sobre contato
  if (/contato|falar|ligar|email|telefone|whatsapp/.test(messageLower)) {
    return "Entre em contato conosco:\n\n📧 Email: contato@insightesfera.io\n📱 WhatsApp: (11) 99999-9999\n🌐 Site: www.insightesfera.io\n\nEstou aqui para ajudar também! 😊";
  }

  // Se temos contexto relevante, usar
  if (context && context.length > 20) {
    return `Baseado em nossa base de conhecimento:\n\n${context.substring(0, 300)}...\n\nPosso te ajudar com mais alguma informação específica?`;
  }

  // Resposta genérica
  return "Desculpe, não tenho informações específicas sobre isso no momento. Mas posso te ajudar com informações sobre nossos serviços, preços ou contato. O que você gostaria de saber?";
}

/**
 * Processa mensagem do usuário e retorna resposta da IA
 */
export async function processUserMessage(userMessage, tenantId = 'insightesfera') {
  try {
    // 1. Buscar base de conhecimento
    const knowledgeBase = await getKnowledgeBase(tenantId);

    // 2. Buscar configurações do tenant
    const config = await getTenantConfig(tenantId);

    // 3. Buscar contexto relevante (RAG)
    const context = simpleRAG(userMessage, knowledgeBase, 3);

    // 4. Gerar resposta com IA
    const aiResponse = await generateAIResponse(userMessage, context, config);

    return {
      success: true,
      response: aiResponse,
      context: context ? context.substring(0, 200) : null,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Erro ao processar mensagem:', error);

    return {
      success: false,
      response: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Salva histórico de conversa
 */
export async function saveChatHistory(conversationId, message, response) {
  try {
    // TODO: Implementar salvamento em Firestore ou Cloud Storage
    const historyData = {
      conversationId,
      userMessage: message,
      aiResponse: response,
      timestamp: new Date().toISOString()
    };

    // Por enquanto, apenas loga
    console.log('Chat history:', historyData);

    return historyData;
  } catch (error) {
    console.error('Erro ao salvar histórico:', error);
    return null;
  }
}

export default {
  processUserMessage,
  saveChatHistory,
  simpleRAG
};
