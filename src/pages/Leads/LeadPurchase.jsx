import { useState } from 'react';
import {
    Search, Filter, MapPin, Database, ShoppingCart,
    CheckCircle2, TrendingUp, Users, DollarSign, Info
} from 'lucide-react';

export function LeadPurchase() {
    const [quantity, setQuantity] = useState(1000);
    const [selectedSegment, setSelectedSegment] = useState('all');

    // Pricing Logic (Scalable)
    const basePrice = 2.50; // R$ 2.50 per lead
    const getPrice = (qty) => {
        let discount = 0;
        if (qty >= 5000) discount = 0.10;
        if (qty >= 10000) discount = 0.20;
        if (qty >= 50000) discount = 0.30;
        return (qty * basePrice * (1 - discount)).toFixed(2);
    };

    // Mock Data for Table (10 rows)
    const sampleLeads = [
        { id: 1, name: 'Empresa Tech Solutions', sector: 'Tecnologia', city: 'São Paulo', state: 'SP', score: 98 },
        { id: 2, name: 'Varejo Express', sector: 'Varejo', city: 'Rio de Janeiro', state: 'RJ', score: 85 },
        { id: 3, name: 'Consultoria Alpha', sector: 'Serviços', city: 'Belo Horizonte', state: 'MG', score: 92 },
        { id: 4, name: 'Indústria Beta', sector: 'Indústria', city: 'Curitiba', state: 'PR', score: 88 },
        { id: 5, name: 'Logística Rápida', sector: 'Logística', city: 'Campinas', state: 'SP', score: 79 },
        { id: 6, name: 'Marketing Digital Pro', sector: 'Marketing', city: 'Florianópolis', state: 'SC', score: 95 },
        { id: 7, name: 'Saúde Mais', sector: 'Saúde', city: 'Porto Alegre', state: 'RS', score: 91 },
        { id: 8, name: 'Educação Futuro', sector: 'Educação', city: 'Recife', state: 'PE', score: 84 },
        { id: 9, name: 'Construtora Forte', sector: 'Construção', city: 'Salvador', state: 'BA', score: 87 },
        { id: 10, name: 'Agro Business', sector: 'Agronegócio', city: 'Goiânia', state: 'GO', score: 89 },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Database className="w-6 h-6 text-purple-500" />
                        Compra de Leads BigQuery
                    </h1>
                    <p className="text-slate-400">
                        Acesse nossa base de dados premium com mais de 10 milhões de empresas.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        BigQuery Conectado
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Configuration & Pricing */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Filters */}
                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Filter className="w-5 h-5 text-purple-400" />
                            Segmentação
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Setor de Atuação</label>
                                <select
                                    className="input-field"
                                    value={selectedSegment}
                                    onChange={(e) => setSelectedSegment(e.target.value)}
                                >
                                    <option value="all">Todos os Setores</option>
                                    <option value="tech">Tecnologia</option>
                                    <option value="retail">Varejo</option>
                                    <option value="services">Serviços</option>
                                    <option value="industry">Indústria</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Região</label>
                                <select className="input-field">
                                    <option value="br">Todo Brasil</option>
                                    <option value="se">Sudeste</option>
                                    <option value="s">Sul</option>
                                    <option value="ne">Nordeste</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Score Mínimo</label>
                                <input type="range" min="0" max="100" defaultValue="70" className="w-full accent-purple-500" />
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>0</span>
                                    <span>50</span>
                                    <span>100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Calculator */}
                    <div className="glass-panel p-6 border-t-4 border-t-purple-500">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-purple-400" />
                            Investimento
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Quantidade de Leads</label>
                                <input
                                    type="range"
                                    min="100"
                                    max="100000"
                                    step="100"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    className="w-full accent-purple-500 mb-2"
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-white">{quantity.toLocaleString()}</span>
                                    <span className="text-xs text-slate-400">leads selecionados</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-[#0B1120] border border-white/5 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Preço unitário</span>
                                    <span className="text-slate-200">R$ {basePrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Desconto por volume</span>
                                    <span className="text-emerald-400">
                                        {quantity >= 5000 ? (quantity >= 10000 ? (quantity >= 50000 ? '30%' : '20%') : '10%') : '0%'}
                                    </span>
                                </div>
                                <div className="border-t border-white/10 pt-3 flex justify-between items-end">
                                    <span className="text-slate-400">Total Estimado</span>
                                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                        R$ {Number(getPrice(quantity)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            <button className="btn-primary w-full flex items-center justify-center gap-2">
                                <ShoppingCart className="w-5 h-5" />
                                Comprar Agora
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Visualization & Data */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Map Placeholder */}
                    <div className="glass-panel p-6 h-[300px] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[#1A2540] flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-12 h-12 text-purple-500/50 mx-auto mb-2" />
                                <p className="text-slate-400">Visualização de Mapa Interativo</p>
                                <p className="text-xs text-slate-600">(Distribuição Geográfica dos Leads)</p>
                            </div>
                            {/* Fake Map Grid Effect */}
                            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                        </div>
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2"></span>
                            Densidade Alta
                        </div>
                    </div>

                    {/* Sample Table */}
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-400" />
                                Amostra de Dados
                            </h3>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                Dados anonimizados para visualização
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-3 px-4 text-xs font-medium text-slate-400 uppercase">Empresa</th>
                                        <th className="py-3 px-4 text-xs font-medium text-slate-400 uppercase">Setor</th>
                                        <th className="py-3 px-4 text-xs font-medium text-slate-400 uppercase">Localização</th>
                                        <th className="py-3 px-4 text-xs font-medium text-slate-400 uppercase">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleLeads.map((lead) => (
                                        <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 text-sm text-slate-200">{lead.name}</td>
                                            <td className="py-3 px-4 text-sm text-slate-400">{lead.sector}</td>
                                            <td className="py-3 px-4 text-sm text-slate-400">{lead.city} - {lead.state}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full w-16">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                                                            style={{ width: `${lead.score}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-slate-300">{lead.score}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
