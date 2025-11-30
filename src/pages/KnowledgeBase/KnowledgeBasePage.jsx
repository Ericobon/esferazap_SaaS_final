import { useState } from 'react';
import { Upload, FileText, Trash2, Maximize2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const MAX_FILES = 5;
const MAX_TOTAL_SIZE_MB = 20;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

// Componente de Upload de Arquivos
const FileUploader = ({ uploadedFiles, setUploadedFiles }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (files) => {
        const newFiles = Array.from(files);
        const currentTotalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
        let newTotalSize = currentTotalSize;
        let filesToAdd = [];

        if (uploadedFiles.length + newFiles.length > MAX_FILES) {
            toast.error(`Limite de ${MAX_FILES} arquivos atingido.`);
            return;
        }

        for (const file of newFiles) {
            if (newTotalSize + file.size > MAX_TOTAL_SIZE_BYTES) {
                toast.error(`O arquivo "${file.name}" excede o limite total de ${MAX_TOTAL_SIZE_MB}MB.`);
                continue;
            }
            filesToAdd.push(file);
            newTotalSize += file.size;
        }

        setUploadedFiles([...uploadedFiles, ...filesToAdd]);
        if (filesToAdd.length > 0) {
            toast.success(`${filesToAdd.length} arquivo(s) adicionado(s) com sucesso.`);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };

    const removeFile = (fileName) => {
        setUploadedFiles(uploadedFiles.filter(file => file.name !== fileName));
        toast.info(`Arquivo "${fileName}" removido.`);
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
    const sizePercentage = (totalSize / MAX_TOTAL_SIZE_BYTES) * 100;

    return (
        <div className="space-y-6">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    "border-2 border-dashed p-10 rounded-xl text-center cursor-pointer transition-colors",
                    isDragging ? "border-purple-500 bg-purple-500/10" : "border-slate-700 hover:border-purple-500"
                )}
                onClick={() => document.getElementById('file-upload').click()}
            >
                <Upload className="w-8 h-8 mx-auto text-purple-400 mb-3" />
                <p className="text-white font-medium">Arraste e solte seus arquivos aqui</p>
                <p className="text-sm text-slate-400">ou clique para selecionar (PDF, DOCX, TXT)</p>
                <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files)}
                />
            </div>

            {/* Limites e Progresso */}
            <div className="bg-[#151E32] p-4 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3">Limites de Uso</h3>
                <div className="space-y-3">
                    {/* Limite de Arquivos */}
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Arquivos Carregados:</span>
                        <span className="font-medium text-white">{uploadedFiles.length} / {MAX_FILES}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div
                            className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${(uploadedFiles.length / MAX_FILES) * 100}%` }}
                        ></div>
                    </div>

                    {/* Limite de Tamanho */}
                    <div className="flex justify-between items-center text-sm pt-2">
                        <span className="text-slate-400">Tamanho Total:</span>
                        <span className={cn("font-medium", sizePercentage > 80 ? 'text-red-400' : 'text-white')}>
                            {formatSize(totalSize)} / {MAX_TOTAL_SIZE_MB} MB
                        </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div
                            className={cn("h-2.5 rounded-full transition-all duration-500", sizePercentage > 80 ? 'bg-red-600' : 'bg-purple-600')}
                            style={{ width: `${sizePercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Lista de Arquivos */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Arquivos para Treinamento</h3>
                    {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-[#151E32] rounded-lg border border-slate-700">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-purple-400" />
                                <div>
                                    <p className="text-sm font-medium text-white truncate max-w-xs">{file.name}</p>
                                    <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFile(file.name)}
                                className="p-1 rounded-full text-red-400 hover:bg-red-400/10 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export function KnowledgeBasePage() {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-2">Base de Conhecimento (RAG)</h1>
            <p className="text-slate-400 mb-8">
                Faça upload de documentos para treinar seu Agente de IA. O conteúdo será usado para responder perguntas dos seus clientes.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <FileUploader uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#151E32] p-6 rounded-lg border border-slate-700">
                        <h3 className="text-xl font-bold text-purple-400 mb-3">Como Funciona?</h3>
                        <ul className="space-y-3 text-slate-300 text-sm">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                                O conteúdo é processado e transformado em vetores (embeddings).
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                                A IA consulta esses vetores para gerar respostas precisas (RAG).
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                                Seus dados ficam isolados e seguros (Multi-tenant).
                            </li>
                        </ul>
                    </div>

                    <div className="bg-[#151E32] p-6 rounded-lg border border-slate-700">
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">Próximos Passos</h3>
                        <p className="text-slate-300 text-sm">
                            Após o upload, você precisará configurar o Agente de IA na seção "Agents" para que ele utilize esta base de conhecimento.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
