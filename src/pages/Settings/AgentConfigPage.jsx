import { useState } from 'react';
import {
    Bot, Sparkles, MessageSquare, Zap, Settings as SettingsIcon,
    Save, RefreshCw, Phone, Smartphone, Globe, Key, TestTube
} from 'lucide-react';

export function AgentConfigPage() {
    const [activeTab, setActiveTab] = useState('personality');
    const [config, setConfig] = useState({
        // Personality
        agentName: 'IRIS',
        agentRole: 'Assistente Virtual Inteligente',
        tone: 'professional',
        language: 'pt-BR',

        // System Prompt
        systemPrompt: `Você é a IRIS, assistente virtual inteligente da InsightEsfera.

Sua missão é ajudar clientes com:
- Informações sobre produtos e serviços
- Agendamento de reuniões
- Suporte técnico
- Qualificação de leads

Diretrizes:
- Seja educada, profissional e prestativa
- Use linguagem clara e objetiva
- Faça perguntas para entender melhor as necessidades
- Sempre ofereça próximos passos claros
- Se não souber algo, admita e ofereça alternativas`,

        // WhatsApp Integration
        whatsappNumber: '',
        whatsappPhoneNumberId: '',
        whatsappBusinessId: '',
        whatsappVerifyToken: '',

        // Advanced
        temperature: 0.7,
        maxTokens: 500,
        contextWindow: 10,
        autoHandoff: true,
        handoffThreshold: 3,
    });

    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);

    const tabs = [
        { id: 'personality', name: 'Personalidade', icon: Sparkles },
        { id: 'prompt', name: 'System Prompt', icon: MessageSquare },
        { id: 'whatsapp', name: 'Whats App', icon: Phone },
        { id: 'advanced', name: 'Avançado', icon: SettingsIcon },
    ];

    const toneOptions = [
        { id: 'professional', name: 'Profissional', description: 'Formal e corporativo' },
        { id: 'friendly', name: 'Amigável', description: 'Casual mas respeitoso' },
        { id: 'enthusiastic', name: 'Entusiasta', description: 'Energético e motivador' },
        { id: 'empathetic', name: 'Empático', description: 'Compreensivo e acolhedor' },
    ];

    const handleSave = async () => {
        setSaving(true);
        // TODO: Salvar configurações no Firestore
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSaving(false);
    };

    const handleTest = async () => {
        setTesting(true);
        // TODO: Testar agente com configurações atuais
        await new Promise(resolve => setTimeout(resolve, 2000));
        setTesting(false);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="gradient-text">Configuração do Agente IA</span>
                    </h1>
                    <p className="text-[rgb(var(--text-muted))]">
                        Personalize o comportamento e integrações do seu agente
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleTest}
                        disabled={testing}
                        className="btn-outline flex items-center gap-2"
                    >
                        {testing ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Testando...
                            </>
                        ) : (
                            <>
                                <TestTube className="w-5 h-5" />
                                Testar Agente
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-gradient flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Salvar Configurações
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Agent Preview Card */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl gradient-bg-primary flex items-center justify-center">
                        <Bot className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1">{config.agentName}</h3>
                        <p className="text-[rgb(var(--text-muted))]">{config.agentRole}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-[rgb(var(--text-muted))]">Status</p>
                        <div className="flex items-center gap-2 text-[rgb(var(--success))]">
                            <div className="w-2 h-2 rounded-full bg-[rgb(var(--success))] animate-pulse"></div>
                            <span className="font-semibold">Ativo</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="glass-card p-1">
                <div className="flex items-center gap-2">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                                        ? 'gradient-bg-primary text-white'
                                        : 'hover:bg-[rgb(var(--bg-tertiary))]/30'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="glass-card p-6">
                {/* Personality Tab */}
                {activeTab === 'personality' && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Personalidade do Agente</h3>
                            <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
                                Configure como seu agente se comporta e interage com os usuários
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Nome do Agente</label>
                                <input
                                    type="text"
                                    value={config.agentName}
                                    onChange={(e) => setConfig({ ...config, agentName: e.target.value })}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Função/Cargo</label>
                                <input
                                    type="text"
                                    value={config.agentRole}
                                    onChange={(e) => setConfig({ ...config, agentRole: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">Tom de Voz</label>
                            <div className="grid grid-cols-2 gap-4">
                                {toneOptions.map(tone => (
                                    <button
                                        key={tone.id}
                                        onClick={() => setConfig({ ...config, tone: tone.id })}
                                        className={`p-4 rounded-lg border-2 text-left transition-all ${config.tone === tone.id
                                                ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10'
                                                : 'border-[rgb(var(--border))] hover:border-[rgb(var(--border-light))]'
                                            }`}
                                    >
                                        <p className="font-semibold mb-1">{tone.name}</p>
                                        <p className="text-sm text-[rgb(var(--text-muted))]">{tone.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Idioma Principal</label>
                            <select
                                value={config.language}
                                onChange={(e) => setConfig({ ...config, language: e.target.value })}
                                className="input-field"
                            >
                                <option value="pt-BR">Português (Brasil)</option>
                                <option value="en-US">English (US)</option>
                                <option value="es-ES">Español</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* System Prompt Tab */}
                {activeTab === 'prompt' && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h3 className="text-xl font-bold mb-4">System Prompt</h3>
                            <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
                                Define o comportamento central e instruções do seu agente de IA
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Instruções do Sistema</label>
                            <textarea
                                value={config.systemPrompt}
                                onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                                rows={16}
                                className="input-field font-mono text-sm"
                                placeholder="Defina as instruções para seu agente..."
                            />
                            <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                                💡 Seja específico sobre o papel, comportamento e limitações do agente
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[rgb(var(--primary))]" />
                                Dicas para um bom prompt
                            </h4>
                            <ul className="text-sm space-y-1 text-[rgb(var(--text-secondary))]">
                                <li>• Defina claramente o papel e personalidade</li>
                                <li>• Liste os principais casos de uso</li>
                                <li>• Estabeleça diretrizes de comunicação</li>
                                <li>• Defina quando escalar para humano</li>
                                <li>• Inclua exemplos de respostas esperadas</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* WhatsApp Integration Tab */}
                {activeTab === 'whatsapp' && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Integração WhatsApp</h3>
                            <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
                                Configure a conexão com WhatsApp Business API
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Número WhatsApp</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--text-muted))]" />
                                <input
                                    type="tel"
                                    value={config.whatsappNumber}
                                    onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                                    placeholder="+55 11 99999-9999"
                                    className="input-field pl-11"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Phone Number ID</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--text-muted))]" />
                                <input
                                    type="text"
                                    value={config.whatsappPhoneNumberId}
                                    onChange={(e) => setConfig({ ...config, whatsappPhoneNumberId: e.target.value })}
                                    placeholder="123456789012345"
                                    className="input-field pl-11"
                                />
                            </div>
                            <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                                Encontre no Meta Business Manager → WhatsApp → API Setup
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">WhatsApp Business Account ID</label>
                            <input
                                type="text"
                                value={config.whatsappBusinessId}
                                onChange={(e) => setConfig({ ...config, whatsappBusinessId: e.target.value })}
                                placeholder="123456789012345"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Webhook Verify Token</label>
                            <input
                                type="text"
                                value={config.whatsappVerifyToken}
                                onChange={(e) => setConfig({ ...config, whatsappVerifyToken: e.target.value })}
                                placeholder="seu-token-secreto-aqui"
                                className="input-field"
                            />
                            <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                                Token usado para verificar o webhook. Defina um valor seguro.
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <h4 className="font-semibold mb-2 text-blue-400">📘 Precisa de ajuda?</h4>
                            <p className="text-sm text-[rgb(var(--text-secondary))]">
                                Consulte nosso{' '}
                                <a href="#" className="text-[rgb(var(--primary))] hover:underline">
                                    guia completo de integração WhatsApp
                                </a>
                                {' '}para configuração passo a passo.
                            </p>
                        </div>
                    </div>
                )}

                {/* Advanced Tab */}
                {activeTab === 'advanced' && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Configurações Avançadas</h3>
                            <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
                                Ajustes finos para otimizar o desempenho do modelo
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Temperature: {config.temperature}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={config.temperature}
                                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                                className="w-full"
                            />
                            <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                                0 = Mais determinístico | 1 = Mais criativo
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Máximo de Tokens por Resposta</label>
                            <input
                                type="number"
                                value={config.maxTokens}
                                onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                                className="input-field"
                                min="50"
                                max="2000"
                                step="50"
                            />
                            <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                                Controla o tamanho máximo das respostas (1 token ≈ 0.75 palavras)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Janela de Contexto (mensagens)</label>
                            <input
                                type="number"
                                value={config.contextWindow}
                                onChange={(e) => setConfig({ ...config, contextWindow: parseInt(e.target.value) })}
                                className="input-field"
                                min="5"
                                max="50"
                                step="5"
                            />
                            <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                                Quantas mensagens anteriores o agente considera no contexto
                            </p>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-[rgb(var(--bg-tertiary))]/30">
                            <div>
                                <p className="font-semibold mb-1">Handoff Automático para Humano</p>
                                <p className="text-sm text-[rgb(var(--text-muted))]">
                                    Transfere automaticamente quando a IA não consegue resolver
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.autoHandoff}
                                    onChange={(e) => setConfig({ ...config, autoHandoff: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-[rgb(var(--bg-tertiary))] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgb(var(--primary))]"></div>
                            </label>
                        </div>

                        {config.autoHandoff && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Tentativas antes do Handoff: {config.handoffThreshold}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={config.handoffThreshold}
                                    onChange={(e) => setConfig({ ...config, handoffThreshold: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
