/**
 * Cloud Storage Service
 * Handles integration with Google Cloud Storage for knowledge base
 */

const GCS_BUCKET = 'chatbot-iris-platform';
const TENANT_ID = 'insightesfera';
const PROJECT_ID = 'silent-text-458716-c9';

// Para MVP, vamos usar uma API própria que você vai criar (Cloud Function ou backend)
// Por enquanto, vamos simular com dados locais e preparar para integração
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Busca a base de conhecimento do tenant
 */
export const getKnowledgeBase = async (tenantId = TENANT_ID) => {
  try {
    // TODO: Implementar chamada real para Cloud Function que busca do GCS
    // Por enquanto, retorna conhecimento mock
    const response = await fetch(`${API_BASE_URL}/knowledge/${tenantId}`).catch(() => null);

    if (response?.ok) {
      const data = await response.json();
      return data.knowledge;
    }

    // Fallback: conhecimento básico da InsightEsfera
    return `
# Base de Conhecimento - InsightEsfera

## Sobre Nós
A InsightEsfera é uma consultoria especializada em transformação digital através de dados e inteligência artificial.

## Serviços Oferecidos

### 1. Consultoria em Business Intelligence (BI)
- Implementação de dashboards executivos
- Power BI, Tableau, Looker
- Integração de fontes de dados
- Cultura data-driven

### 2. Data Science & Machine Learning
- Modelos preditivos
- Análise de churn
- Recomendação personalizada
- Otimização de processos

### 3. Automação com IA
- Chatbots inteligentes
- Processamento de linguagem natural
- OCR e análise de documentos
- RPA com IA

### 4. Engenharia de Dados
- Data lakes e data warehouses
- Pipelines ETL/ELT
- Governança de dados
- Cloud (GCP, AWS, Azure)

## Preços
- Consultoria por hora: R$ 300/h
- Projetos fechados: sob consulta
- Retainer mensal: a partir de R$ 10.000/mês

## Contato
- Email: contato@insightesfera.io
- Telefone: (11) 99999-9999
- Site: www.insightesfera.io
`;
  } catch (error) {
    console.error('Erro ao buscar base de conhecimento:', error);
    return '';
  }
};

/**
 * Upload de arquivo para base de conhecimento
 */
export const uploadKnowledgeFile = async (file, tenantId = TENANT_ID) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenantId', tenantId);

    const response = await fetch(`${API_BASE_URL}/knowledge/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer upload do arquivo');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    throw error;
  }
};

/**
 * Lista arquivos da base de conhecimento
 */
export const listKnowledgeFiles = async (tenantId = TENANT_ID) => {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge/${tenantId}/files`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    return [];
  }
};

/**
 * Configuração do tenant
 */
export const getTenantConfig = async (tenantId = TENANT_ID) => {
  try {
    const response = await fetch(`${API_BASE_URL}/config/${tenantId}`).catch(() => null);

    if (response?.ok) {
      return await response.json();
    }

    // Fallback: config padrão
    return {
      tenant_id: tenantId,
      name: 'InsightEsfera',
      active: true,
      whatsapp: {
        instance_name: 'iris-whatsapp',
        phone_number: null
      },
      ai: {
        model: 'gemini-1.5-flash-002',
        max_tokens: 500,
        temperature: 0.7
      },
      features: {
        text_chat: true,
        voice_chat: false,
        lead_capture: false,
        handoff_to_human: false
      }
    };
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    return null;
  }
};

export default {
  getKnowledgeBase,
  uploadKnowledgeFile,
  listKnowledgeFiles,
  getTenantConfig
};
