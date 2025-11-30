import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
    Send, Paperclip, Smile, MoreVertical, Search,
    Phone, Video, Archive, Star, Trash2, Clock, Check, CheckCheck
} from 'lucide-react';

export function ChatPage() {
    const { user } = useAuth();
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedChat]);

    // Mock data - Multi-tenant conversations
    const conversations = [
        {
            id: 1,
            clientId: 'client-001',
            clientName: 'João Silva',
            clientPhone: '+55 11 98765-4321',
            lastMessage: 'Gostaria de saber mais sobre os planos',
            timestamp: '10:45',
            unread: 2,
            status: 'active',
            channel: 'whatsapp',
            tags: ['lead', 'interesse-enterprise']
        },
        {
            id: 2,
            clientId: 'client-002',
            clientName: 'Maria Santos',
            clientPhone: '+55 21 99876-5432',
            lastMessage: 'Obrigada! Problema resolvido.',
            timestamp: '09:32',
            unread: 0,
            status: 'resolved',
            channel: 'whatsapp',
            tags: ['suporte']
        },
        {
            id: 3,
            clientId: 'client-003',
            clientName: 'Pedro Costa',
            clientPhone: '+55 11 97654-3210',
            lastMessage: 'Quando posso agendar uma demonstração?',
            timestamp: 'Ontem',
            unread: 1,
            status: 'waiting',
            channel: 'whatsapp',
            tags: ['demo', 'hot-lead']
        },
        {
            id: 4,
            clientId: 'client-004',
            clientName: 'Ana Oliveira',
            clientPhone: '+55 11 96543-2109',
            lastMessage: 'Recebi o contrato, vou analisar',
            timestamp: 'Ontem',
            unread: 0,
            status: 'active',
            channel: 'webchat',
            tags: ['negociação']
        },
    ];

    const messages = selectedChat ? [
        {
            id: 1,
            senderId: 'client-001',
            text: 'Olá! Vi que vocês têm uma plataforma de automação com IA.',
            timestamp: '10:30',
            isOwn: false,
            status: 'read'
        },
        {
            id: 2,
            senderId: user?.uid,
            text: 'Olá João! Sim, temos uma plataforma completa de IA conversacional para WhatsApp. Como posso ajudá-lo?',
            timestamp: '10:31',
            isOwn: true,
            status: 'read'
        },
        {
            id: 3,
            senderId: 'client-001',
            text: 'Estou procurando uma solução para automatizar atendimento. Quantos atendimentos simultâneos a IA consegue gerenciar?',
            timestamp: '10:33',
            isOwn: false,
            status: 'read'
        },
        {
            id: 4,
            senderId: user?.uid,
            text: 'Excelente pergunta! Nossa IA consegue gerenciar conversas ilimitadas simultaneamente. O limite está relacionado apenas ao seu plano contratado.',
            timestamp: '10:34',
            isOwn: true,
            status: 'read'
        },
        {
            id: 5,
            senderId: 'client-001',
            text: 'Interessante! E quanto custa o plano Enterprise?',
            timestamp: '10:35',
            isOwn: false,
            status: 'read'
        },
        {
            id: 6,
            senderId: 'client-001',
            text: 'Gostaria de saber mais sobre os planos',
            timestamp: '10:45',
            isOwn: false,
            status: 'delivered'
        },
    ] : [];

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // TODO: Integrar com backend para enviar mensagem
        console.log('Enviando mensagem:', message);
        setMessage('');
    };

    const filteredConversations = conversations.filter(conv =>
        conv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.clientPhone.includes(searchQuery) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-120px)] flex gap-4">
            {/* Conversations List */}
            <div className="w-96 glass-card flex flex-col overflow-hidden">
                {/* Search Header */}
                <div className="p-4 border-b border-[rgb(var(--border))]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--text-muted))]" />
                        <input
                            type="text"
                            placeholder="Buscar conversas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-11 py-2 text-sm"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedChat(conv)}
                            className={`w-full p-4 border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--bg-tertiary))]/30 transition-colors text-left ${selectedChat?.id === conv.id ? 'bg-[rgb(var(--bg-tertiary))]/50' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold">
                                        {conv.clientName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold truncate">{conv.clientName}</h4>
                                        <span className="text-xs text-[rgb(var(--text-muted))] flex-shrink-0 ml-2">
                                            {conv.timestamp}
                                        </span>
                                    </div>

                                    <p className="text-sm text-[rgb(var(--text-muted))] truncate mb-2">
                                        {conv.lastMessage}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            {conv.tags.slice(0, 2).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 text-xs rounded-full bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {conv.unread > 0 && (
                                            <div className="w-5 h-5 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center">
                                                <span className="text-xs font-bold text-white">{conv.unread}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 glass-card flex flex-col overflow-hidden">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-[rgb(var(--border))] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {selectedChat.clientName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">{selectedChat.clientName}</h3>
                                    <p className="text-xs text-[rgb(var(--text-muted))]">{selectedChat.clientPhone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-[rgb(var(--bg-tertiary))]/50 rounded-lg transition-colors">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-[rgb(var(--bg-tertiary))]/50 rounded-lg transition-colors">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-[rgb(var(--bg-tertiary))]/50 rounded-lg transition-colors">
                                    <Star className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-[rgb(var(--bg-tertiary))]/50 rounded-lg transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-md px-4 py-2 rounded-2xl ${msg.isOwn
                                                ? 'bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white'
                                                : 'bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-primary))]'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            <span className={`text-xs ${msg.isOwn ? 'text-white/70' : 'text-[rgb(var(--text-muted))]'}`}>
                                                {msg.timestamp}
                                            </span>
                                            {msg.isOwn && (
                                                msg.status === 'read' ? (
                                                    <CheckCheck className="w-4 h-4 text-white/70" />
                                                ) : (
                                                    <Check className="w-4 h-4 text-white/70" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-[rgb(var(--border))]">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    className="p-2 hover:bg-[rgb(var(--bg-tertiary))]/50 rounded-lg transition-colors"
                                >
                                    <Paperclip className="w-5 h-5 text-[rgb(var(--text-muted))]" />
                                </button>

                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    className="flex-1 input-field py-2"
                                />

                                <button
                                    type="button"
                                    className="p-2 hover:bg-[rgb(var(--bg-tertiary))]/50 rounded-lg transition-colors"
                                >
                                    <Smile className="w-5 h-5 text-[rgb(var(--text-muted))]" />
                                </button>

                                <button
                                    type="submit"
                                    disabled={!message.trim()}
                                    className="p-3 gradient-bg-primary rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-[rgb(var(--primary))]/10 flex items-center justify-center mx-auto mb-4">
                                <Send className="w-10 h-10 text-[rgb(var(--primary))]" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Selecione uma conversa</h3>
                            <p className="text-[rgb(var(--text-muted))]">
                                Escolha uma conversa da lista para começar a interagir
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Client Info Sidebar (when chat selected) */}
            {selectedChat && (
                <div className="w-80 glass-card p-6 overflow-y-auto">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] flex items-center justify-center mx-auto mb-3">
                            <span className="text-white font-bold text-2xl">
                                {selectedChat.clientName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg">{selectedChat.clientName}</h3>
                        <p className="text-sm text-[rgb(var(--text-muted))]">{selectedChat.clientPhone}</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold mb-2 text-[rgb(var(--text-muted))]">STATUS</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedChat.status === 'active' ? 'bg-[rgb(var(--success))]/10 text-[rgb(var(--success))]' :
                                    selectedChat.status === 'resolved' ? 'bg-blue-500/10 text-blue-400' :
                                        'bg-yellow-500/10 text-yellow-400'
                                }`}>
                                {selectedChat.status === 'active' ? 'Ativo' :
                                    selectedChat.status === 'resolved' ? 'Resolvido' : 'Aguardando'}
                            </span>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-2 text-[rgb(var(--text-muted))]">CANAL</h4>
                            <p className="text-sm capitalize">{selectedChat.channel}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-2 text-[rgb(var(--text-muted))]">TAGS</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedChat.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 text-xs rounded-full bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[rgb(var(--border))] space-y-2">
                            <button className="w-full py-2 px-4 text-sm font-medium hover:bg-[rgb(var(--bg-tertiary))]/30 rounded-lg transition-colors flex items-center gap-2">
                                <Archive className="w-4 h-4" />
                                Arquivar conversa
                            </button>
                            <button className="w-full py-2 px-4 text-sm font-medium hover:bg-[rgb(var(--bg-tertiary))]/30 rounded-lg transition-colors flex items-center gap-2 text-red-400">
                                <Trash2 className="w-4 h-4" />
                                Excluir conversa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
