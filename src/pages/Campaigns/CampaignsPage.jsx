import { useState } from 'react';
import {
    Send, Image as ImageIcon, Users, MessageSquare,
    Sparkles, Filter, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';

export function CampaignsPage() {
    const [message, setMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [audienceSize, setAudienceSize] = useState(1250);

    const suggestions = [
        "Olá! Vi que sua empresa está crescendo e gostaria de apresentar nossa solução de IA.",
        "Oferta exclusiva para empresas de tecnologia: 20% de desconto na primeira mensalidade.",
        "Descubra como automatizar seu atendimento com o EsferaZap. Podemos agendar uma demo?"
    ];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create fake URL for preview
            const url = URL.createObjectURL(file);
            setSelectedImage(url);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6 animate-fade-in">
            {/* Left: Configuration */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Send className="w-6 h-6 text-pink-500" />
                        Nova Campanha
                    </h1>
                    <p className="text-slate-400">
                        Configure e dispare mensagens em massa para seus leads.
                    </p>
                </div>

                {/* Audience Selection */}
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        Público Alvo
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Origem dos Leads</label>
                            <select className="input-field">
                                <option>Leads Comprados (BigQuery)</option>
                                <option>Leads Próprios (Upload CSV)</option>
                                <option>Contatos do WhatsApp</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Segmento</label>
                            <select className="input-field">
                                <option>Todos</option>
                                <option>Tecnologia</option>
                                <option>Varejo</option>
                                <option>Serviços</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-400">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium">Público Estimado</span>
                        </div>
                        <span className="text-xl font-bold text-white">{audienceSize.toLocaleString()} contatos</span>
                    </div>
                </div>

                {/* Message Editor */}
                <div className="glass-panel p-6 flex-1">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-purple-400" />
                        Conteúdo da Mensagem
                    </h3>

                    <div className="space-y-4">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Imagem / Mídia (Opcional)</label>
                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#0B1120] border border-slate-700 rounded-lg hover:border-purple-500 transition-colors">
                                    <ImageIcon className="w-5 h-5 text-slate-400" />
                                    <span className="text-sm text-slate-300">Escolher Arquivo</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                                {selectedImage && (
                                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Imagem selecionada
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Text Area */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm text-slate-400">Texto da Mensagem</label>
                                <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Gerar com IA
                                </button>
                            </div>
                            <textarea
                                className="input-field min-h-[150px] resize-none"
                                placeholder="Digite sua mensagem aqui..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-slate-500">Variáveis disponíveis: {'{nome}'}, {'{empresa}'}</span>
                                <span className="text-xs text-slate-500">{message.length} caracteres</span>
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div>
                            <p className="text-xs text-slate-400 mb-2">Sugestões Rápidas:</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((sug, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMessage(sug)}
                                        className="text-xs bg-[#0B1120] border border-slate-700 hover:border-purple-500 text-slate-300 px-3 py-1 rounded-full transition-colors text-left truncate max-w-[300px]"
                                    >
                                        {sug}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button className="btn-outline flex-1">Agendar Envio</button>
                    <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        Enviar Campanha
                    </button>
                </div>
            </div>

            {/* Right: Preview */}
            <div className="w-full lg:w-[350px] hidden lg:flex flex-col">
                <div className="glass-panel p-4 h-full flex flex-col bg-[#0B141A] border-none relative overflow-hidden">
                    {/* WhatsApp Header Mock */}
                    <div className="flex items-center gap-3 p-3 bg-[#202C33] -m-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-500"></div>
                        <div>
                            <p className="text-slate-200 font-medium text-sm">Cliente Exemplo</p>
                            <p className="text-slate-400 text-xs">online</p>
                        </div>
                    </div>

                    {/* Chat Background Pattern */}
                    <div className="absolute inset-0 top-[60px] opacity-5 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]"></div>

                    {/* Message Bubble */}
                    <div className="relative z-10 flex-1 p-2">
                        <div className="bg-[#005C4B] p-2 rounded-lg rounded-tr-none max-w-[90%] ml-auto shadow-sm">
                            {selectedImage && (
                                <div className="mb-2 rounded-lg overflow-hidden">
                                    <img src={selectedImage} alt="Preview" className="w-full h-auto object-cover" />
                                </div>
                            )}
                            <p className="text-sm text-[#E9EDEF] whitespace-pre-wrap">
                                {message || <span className="text-white/30 italic">Sua mensagem aparecerá aqui...</span>}
                            </p>
                            <div className="text-[10px] text-[#8696A0] text-right mt-1 flex justify-end items-center gap-1">
                                14:30 <CheckCircle2 className="w-3 h-3 text-[#53bdeb]" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar Mock */}
                    <div className="h-12 bg-[#202C33] -m-4 mt-auto flex items-center px-4 gap-4">
                        <div className="w-6 h-6 rounded-full bg-slate-600/50"></div>
                        <div className="flex-1 h-8 bg-[#2A3942] rounded-lg"></div>
                        <div className="w-8 h-8 rounded-full bg-[#00A884] flex items-center justify-center">
                            <Send className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>
                <p className="text-center text-xs text-slate-500 mt-2">Pré-visualização aproximada</p>
            </div>
        </div>
    );
}
