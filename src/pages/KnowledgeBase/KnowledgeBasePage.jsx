import { useState, useRef } from 'react';
import {
    Upload, File, FileText, Image, Video, Music, Trash2,
    Search, Filter, Download, Eye, Plus, CheckCircle, Loader2
} from 'lucide-react';

export function KnowledgeBasePage() {
    const [documents, setDocuments] = useState([
        {
            id: 1,
            name: 'Catálogo de Produtos 2024.pdf',
            type: 'pdf',
            size: '2.4 MB',
            uploadDate: '2024-11-28',
            status: 'processed',
            category: 'produtos'
        },
        {
            id: 2,
            name: 'FAQ Atendimento.docx',
            type: 'doc',
            size: '856 KB',
            uploadDate: '2024-11-27',
            status: 'processed',
            category: 'suporte'
        },
        {
            id: 3,
            name: 'Políticas da Empresa.pdf',
            type: 'pdf',
            size: '1.2 MB',
            uploadDate: '2024-11-25',
            status: 'processing',
            category: 'institucional'
        },
    ]);

    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'Todos', count: documents.length },
        { id: 'produtos', name: 'Produtos', count: documents.filter(d => d.category === 'produtos').length },
        { id: 'suporte', name: 'Suporte', count: documents.filter(d => d.category === 'suporte').length },
        { id: 'institucional', name: 'Institucional', count: documents.filter(d => d.category === 'institucional').length },
    ];

    const stats = [
        {
            label: 'Total de Documentos',
            value: documents.length,
            icon: FileText,
            color: 'primary'
        },
        {
            label: 'Processados',
            value: documents.filter(d => d.status === 'processed').length,
            icon: CheckCircle,
            color: 'success'
        },
        {
            label: 'Em Processamento',
            value: documents.filter(d => d.status === 'processing').length,
            icon: Loader2,
            color: 'accent'
        },
    ];

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleFiles = async (files) => {
        setUploading(true);
        // TODO: Implementar upload real para Cloud Storage
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simula upload
        setUploading(false);
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FileText className="w-8 h-8 text-red-400" />;
            case 'doc':
            case 'docx':
                return <FileText className="w-8 h-8 text-blue-400" />;
            case 'image':
                return <Image className="w-8 h-8 text-green-400" />;
            case 'video':
                return <Video className="w-8 h-8 text-purple-400" />;
            default:
                return <File className="w-8 h-8 text-[rgb(var(--text-muted))]" />;
        }
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="gradient-text">Base de Conhecimento</span>
                    </h1>
                    <p className="text-[rgb(var(--text-muted))]">
                        Gerencie documentos e conteúdos para treinar seu agente de IA
                    </p>
                </div>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-gradient flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Adicionar Documento
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="glass-card-hover p-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg bg-[rgb(var(--${stat.color}))]/10 flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 text-[rgb(var(--${stat.color}))] ${stat.icon === Loader2 ? 'animate-spin' : ''}`} />
                                </div>
                                <div>
                                    <p className="text-[rgb(var(--text-muted))] text-sm">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`glass-card p-12 text-center transition-all ${isDragging ? 'border-2 border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/5' : ''
                    }`}
            >
                {uploading ? (
                    <div className="space-y-4">
                        <Loader2 className="w-12 h-12 text-[rgb(var(--primary))] animate-spin mx-auto" />
                        <p className="font-semibold">Fazendo upload...</p>
                        <p className="text-sm text-[rgb(var(--text-muted))]">
                            Processando e indexando documentos
                        </p>
                    </div>
                ) : (
                    <>
                        <Upload className="w-16 h-16 text-[rgb(var(--primary))] mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Arraste arquivos aqui</h3>
                        <p className="text-[rgb(var(--text-muted))] mb-4">
                            ou clique no botão acima para selecionar
                        </p>
                        <p className="text-sm text-[rgb(var(--text-muted))]">
                            Suporta: PDF, DOC, DOCX, TXT, JPG, PNG (máx. 10MB)
                        </p>
                    </>
                )}
            </div>

            {/* Filters and Search */}
            <div className="glass-card p-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--text-muted))]" />
                        <input
                            type="text"
                            placeholder="Buscar documentos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-11 py-2"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat.id
                                        ? 'gradient-bg-primary text-white'
                                        : 'bg-[rgb(var(--bg-tertiary))]/50 hover:bg-[rgb(var(--bg-tertiary))]'
                                    }`}
                            >
                                {cat.name} ({cat.count})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="glass-card-hover p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 rounded-lg bg-[rgb(var(--bg-tertiary))]/50 flex items-center justify-center flex-shrink-0">
                                {getFileIcon(doc.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold mb-1 truncate">{doc.name}</h4>
                                <p className="text-xs text-[rgb(var(--text-muted))]">{doc.size}</p>
                                <p className="text-xs text-[rgb(var(--text-muted))]">
                                    Enviado em {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${doc.status === 'processed'
                                    ? 'bg-[rgb(var(--success))]/10 text-[rgb(var(--success))]'
                                    : 'bg-yellow-500/10 text-yellow-400'
                                }`}>
                                {doc.status === 'processed' ? 'Processado' : 'Processando...'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]">
                                {doc.category}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-[rgb(var(--border))]">
                            <button className="flex-1 py-2 px-3 text-sm font-medium hover:bg-[rgb(var(--bg-tertiary))]/30 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Eye className="w-4 h-4" />
                                Visualizar
                            </button>
                            <button className="flex-1 py-2 px-3 text-sm font-medium hover:bg-[rgb(var(--bg-tertiary))]/30 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" />
                                Baixar
                            </button>
                            <button className="py-2 px-3 text-sm font-medium hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Card */}
            <div className="glass-card p-6">
                <h3 className="font-bold mb-3">💡 Dica: Como otimizar sua base de conhecimento</h3>
                <ul className="space-y-2 text-sm text-[rgb(var(--text-muted))]">
                    <li className="flex items-start gap-2">
                        <span className="text-[rgb(var(--primary))] mt-0.5">•</span>
                        <span>Organize documentos por categoria para facilitar a busca</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[rgb(var(--primary))] mt-0.5">•</span>
                        <span>Use nomes descritivos nos arquivos para melhor indexação</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[rgb(var(--primary))] mt-0.5">•</span>
                        <span>Atualize regularmente o conteúdo para manter a IA precisa</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[rgb(var(--primary))] mt-0.5">•</span>
                        <span>PDFs com texto são processados melhor que imagens escaneadas</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
