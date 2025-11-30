import { Send, Paperclip, MoreVertical, Phone, Video, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { processUserMessage } from '@/services/aiChatService';
import { toast } from 'sonner';

export function ChatWindow({ contact, onUpdateMessages }) {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [localMessages, setLocalMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [localMessages, contact?.messages]);

    useEffect(() => {
        // Sincronizar mensagens locais com mensagens do contato
        if (contact?.messages) {
            setLocalMessages(contact.messages);
        }
    }, [contact]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            text: message,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            fromMe: true
        };

        // Adiciona mensagem do usuário
        const updatedMessages = [...localMessages, userMessage];
        setLocalMessages(updatedMessages);
        setMessage('');

        // Mostra indicador de digitação
        setIsTyping(true);

        try {
            // Processa mensagem com IA
            const result = await processUserMessage(message, 'insightesfera');

            if (result.success) {
                // Adiciona resposta da IA
                const aiMessage = {
                    id: (Date.now() + 1).toString(),
                    text: result.response,
                    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    fromMe: false
                };

                const finalMessages = [...updatedMessages, aiMessage];
                setLocalMessages(finalMessages);

                // Atualiza mensagens no componente pai se callback existir
                if (onUpdateMessages) {
                    onUpdateMessages(contact.id, finalMessages);
                }
            } else {
                toast.error('Erro ao processar mensagem');
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            toast.error('Erro ao enviar mensagem');
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!contact) {
        return (
            <div className="flex-1 flex items-center justify-center bg-muted/10">
                <div className="text-center text-muted-foreground">
                    <Bot className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-sm">Selecione um chat para começar</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm">
            {/* Header */}
            <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/30 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                        {contact.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-xs text-muted-foreground">
                            {isTyping ? (
                                <span className="flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="inline-block w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="inline-block w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    <span className="ml-1">digitando...</span>
                                </span>
                            ) : contact.online ? 'Online' : 'Visto por último recentemente'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><Phone className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon"><Video className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {localMessages?.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                            msg.fromMe ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[70%] px-4 py-2.5 rounded-2xl shadow-md",
                                msg.fromMe
                                    ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-none"
                                    : "bg-card text-card-foreground rounded-tl-none border border-border"
                            )}
                        >
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            <span className={cn(
                                "text-[10px] block text-right mt-1 opacity-70",
                                msg.fromMe ? "text-primary-foreground" : "text-muted-foreground"
                            )}>
                                {msg.time}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card/30 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        disabled={isTyping}
                    >
                        <Paperclip className="w-5 h-5" />
                    </Button>
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Digite uma mensagem..."
                        className="flex-1 bg-background/50 border-border/50 focus:bg-background transition-colors"
                        onKeyDown={handleKeyDown}
                        disabled={isTyping}
                    />
                    <Button
                        size="icon"
                        className="rounded-full shadow-lg"
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isTyping}
                    >
                        {isTyping ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
