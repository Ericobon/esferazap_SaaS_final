import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Mail, CheckCircle2, ArrowRight, Loader2, Github } from 'lucide-react';
import { toast } from 'sonner';

// Componente de Logo Personalizado (Esfera Conectada)
const InsightEsferaLogo = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" stroke="url(#paint0_linear)" strokeWidth="2" className="opacity-20" />
    <path d="M50 5V95" stroke="url(#paint1_linear)" strokeWidth="1" className="opacity-30" />
    <path d="M5 50H95" stroke="url(#paint2_linear)" strokeWidth="1" className="opacity-30" />
    <path d="M18 18L82 82" stroke="url(#paint3_linear)" strokeWidth="1" className="opacity-30" />
    <path d="M82 18L18 82" stroke="url(#paint4_linear)" strokeWidth="1" className="opacity-30" />
    <circle cx="50" cy="50" r="10" fill="url(#paint5_linear)" />
    <circle cx="50" cy="20" r="4" fill="#0EA5E9" />
    <circle cx="80" cy="50" r="4" fill="#9333EA" />
    <circle cx="50" cy="80" r="4" fill="#EC4899" />
    <circle cx="20" cy="50" r="4" fill="#0EA5E9" />
    <defs>
      <linearGradient id="paint0_linear" x1="5" y1="5" x2="95" y2="95" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0EA5E9" />
        <stop offset="1" stopColor="#9333EA" />
      </linearGradient>
      <linearGradient id="paint1_linear" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0EA5E9" />
        <stop offset="1" stopColor="#9333EA" />
      </linearGradient>
      <linearGradient id="paint2_linear" x1="5" y1="50" x2="95" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9333EA" />
        <stop offset="1" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id="paint3_linear" x1="18" y1="18" x2="82" y2="82" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0EA5E9" />
        <stop offset="1" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id="paint4_linear" x1="82" y1="18" x2="18" y2="82" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9333EA" />
        <stop offset="1" stopColor="#0EA5E9" />
      </linearGradient>
      <linearGradient id="paint5_linear" x1="40" y1="40" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0EA5E9" />
        <stop offset="1" stopColor="#9333EA" />
      </linearGradient>
    </defs>
  </svg>
);

export function Login() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao fazer login com Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B1120]">
      {/* Left Side - Hero & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0F172A] p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120]/90 via-[#0B1120]/80 to-purple-900/20"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <InsightEsferaLogo className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">EsferaZap</h1>
              <p className="text-sm text-purple-400 font-medium tracking-wider">by InsightEsfera</p>
            </div>
          </div>

          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Automatize seu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              WhatsApp com IA
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-md">
            Plataforma completa de IA conversacional para empresas.
            Transforme atendimento, vendas e suporte com automação inteligente.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              IA Personalizada
            </h3>
            <p className="text-sm text-slate-500">Treine com seus próprios dados e documentos.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Multi-tenant
            </h3>
            <p className="text-sm text-slate-500">Gestão isolada para múltiplos clientes.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              BigQuery Leads
            </h3>
            <p className="text-sm text-slate-500">Acesso a base de dados premium.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Campanhas
            </h3>
            <p className="text-sm text-slate-500">Disparos em massa inteligentes.</p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-sm text-slate-500">
          <div>
            <span className="block text-2xl font-bold text-white">10k+</span>
            <span>Mensagens/dia</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-white">99.9%</span>
            <span>Uptime</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-white">24/7</span>
            <span>Disponível</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Mobile Logo */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <InsightEsferaLogo className="w-8 h-8" />
          <div>
            <span className="font-bold text-white">EsferaZap</span>
            <span className="block text-[10px] text-purple-400">by InsightEsfera</span>
          </div>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Acessar Plataforma</h2>
            <p className="mt-2 text-slate-400">
              Entre com sua conta ou{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                crie uma nova
              </button>
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-6 mt-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-[#151E32] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all sm:text-sm"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Senha</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-[#151E32] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all sm:text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-700 bg-[#151E32] text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-purple-400 hover:text-purple-300">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0B1120] text-slate-500">Ou continue com</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-slate-700 rounded-lg shadow-sm bg-[#151E32] text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-slate-700 rounded-lg shadow-sm bg-[#151E32] text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Confiado por empresas de todos os portes
            </p>
            <div className="flex justify-center gap-4 mt-2 text-xs text-slate-600">
              <span>ISO 27001</span>
              <span>•</span>
              <span>LGPD Compliant</span>
              <span>•</span>
              <span>4.9/5.0 Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
