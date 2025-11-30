import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';
import {
  User, Mail, Lock, Building2, MapPin, Phone, Briefcase,
  Users, ChevronRight, ChevronLeft, Check, Zap, Loader2
} from 'lucide-react';

// Componente de Logo Personalizado
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

export function Register() {
  console.log('Register component rendering...');
  const navigate = useNavigate();
  const { signUpWithEmail } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', country: 'BR', role: '',
    password: '', confirmPassword: '',
    company: '', sector: '', companySize: '', website: '', city: '', state: '',
    whatsappNumber: '', whatsappType: 'official', useCaseMain: '', expectedVolume: ''
  });

  // Auto-fill phone code based on country
  useEffect(() => {
    const codes = { 'BR': '+55', 'US': '+1', 'PT': '+351', 'ES': '+34' };
    const code = codes[formData.country] || '';

    const currentPhone = formData.phone;
    // Check if phone starts with any known code
    const oldCode = Object.values(codes).find(c => currentPhone.startsWith(c));

    if (oldCode && oldCode !== code) {
      // Replace old code with new code
      setFormData(prev => ({ ...prev, phone: currentPhone.replace(oldCode, code) }));
    } else if (!currentPhone) {
      // If empty, just set the code
      setFormData(prev => ({ ...prev, phone: code }));
    } else if (!oldCode && code) {
      // If has number but no code, prepend code (optional, maybe risky if user already typed code manually)
      // Let's just leave it alone if it doesn't match a known code to avoid messing up
    }
  }, [formData.country]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.role) {
      toast.error(language === 'pt' ? 'Preencha todos os campos obrigatórios' : 'Please fill in all required fields');
      return false;
    }
    if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      toast.error(language === 'pt' ? 'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números.' : 'Password must be at least 8 characters, including uppercase, lowercase letters, and numbers.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error(language === 'pt' ? 'As senhas não coincidem' : 'Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.company || !formData.sector || !formData.companySize) {
      toast.error(language === 'pt' ? 'Preencha todos os campos obrigatórios' : 'Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar antes de submeter
    if (!formData.company?.trim()) {
      toast.error(language === 'pt' ? 'Nome da empresa é obrigatório' : 'Company name is required');
      return;
    }

    console.log('Submitting registration form...', formData);
    setLoading(true);

    // Timeout de segurança - 30 segundos
    const timeoutId = setTimeout(() => {
      setLoading(false);
      toast.error(language === 'pt' ? 'Operação demorou muito. Tente novamente.' : 'Operation took too long. Please try again.');
    }, 30000);

    try {
      await signUpWithEmail(formData.email, formData.password, formData);
      clearTimeout(timeoutId);
      console.log('Registration success!');
      toast.success(language === 'pt' ? 'Conta criada com sucesso!' : 'Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Registration failed:', error);
      toast.error(language === 'pt' ? 'Erro ao criar conta: ' + error.message : 'Error creating account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: t('register.steps.personal'), icon: User },
    { number: 2, title: t('register.steps.company'), icon: Building2 },
    { number: 3, title: t('register.steps.config'), icon: Zap }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B1120]">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <InsightEsferaLogo className="w-10 h-10" />
            <div>
              <span className="text-2xl font-bold text-white block leading-none">EsferaZap</span>
              <span className="text-[10px] text-purple-400 font-medium tracking-wider">by InsightEsfera</span>
            </div>
          </button>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-2 bg-slate-800 rounded-full p-1 border border-slate-700">
              <button
                onClick={() => setLanguage('pt')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${language === 'pt' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                PT
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${language === 'en' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400 hidden md:inline">{language === 'pt' ? 'Já tem uma conta?' : 'Already have an account?'}</span>
              <button onClick={() => navigate('/login')} className="btn-outline text-sm">
                {t('login.signIn')}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-slate-800 -z-10">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      isActive ? 'bg-purple-600 ring-4 ring-purple-500/20' : 'bg-slate-800 border border-slate-700'
                    }`}>
                    {isCompleted ? <Check className="w-5 h-5 text-white" /> : <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${isActive || isCompleted ? 'text-white' : 'text-slate-500'}`}>{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-panel p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{t('register.personal.title')}</h2>
                  <p className="text-slate-400">{t('register.personal.subtitle')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('register.personal.firstName')} *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('register.personal.lastName')} *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{t('register.personal.email')} *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('register.personal.country')}</label>
                    <select name="country" value={formData.country} onChange={handleChange} className="input-field">
                      <option value="BR">Brasil 🇧🇷</option>
                      <option value="US">United States 🇺🇸</option>
                      <option value="PT">Portugal 🇵🇹</option>
                      <option value="ES">España 🇪🇸</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('register.personal.phone')}</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{t('register.personal.role')} *</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="input-field" required>
                    <option value="">{language === 'pt' ? 'Selecione...' : 'Select...'}</option>
                    <option value="ceo">{t('roles.ceo')}</option>
                    <option value="manager">{t('roles.manager')}</option>
                    <option value="dev">{t('roles.dev')}</option>
                    <option value="marketing">{t('roles.marketing')}</option>
                    <option value="support">{t('roles.support')}</option>
                    <option value="other">{t('roles.other')}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('register.personal.password')} *</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('register.personal.confirmPassword')} *</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field" required />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{t('register.company.title')}</h2>
                  <p className="text-slate-400">{t('register.company.subtitle')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{t('register.company.name')} *</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} className="input-field" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{t('register.company.website')}</label>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://" className="input-field" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('register.company.sector')} *</label>
                    <select name="sector" value={formData.sector} onChange={handleChange} className="input-field" required>
                      <option value="">{language === 'pt' ? 'Selecione...' : 'Select...'}</option>
                      <option value="tech">{t('sectors.tech')}</option>
                      <option value="retail">{t('sectors.retail')}</option>
                      <option value="services">{t('sectors.services')}</option>
                      <option value="health">{t('sectors.health')}</option>
                      <option value="education">{t('sectors.education')}</option>
                      <option value="finance">{t('sectors.finance')}</option>
                      <option value="real_estate">{t('sectors.real_estate')}</option>
                      <option value="logistics">{t('sectors.logistics')}</option>
                      <option value="agro">{t('sectors.agro')}</option>
                      <option value="industry">{t('sectors.industry')}</option>
                      <option value="marketing">{t('sectors.marketing')}</option>
                      <option value="other">{t('sectors.other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('register.company.size')} *</label>
                    <select name="companySize" value={formData.companySize} onChange={handleChange} className="input-field" required>
                      <option value="">{language === 'pt' ? 'Selecione...' : 'Select...'}</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{t('register.config.title')}</h2>
                  <p className="text-slate-400">{t('register.config.subtitle')}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setFormData({ ...formData, whatsappType: 'official' })} className={`p-4 rounded-lg border-2 transition-all ${formData.whatsappType === 'official' ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                    <Check className={`w-6 h-6 mb-2 ${formData.whatsappType === 'official' ? 'text-purple-400' : 'text-slate-500'}`} />
                    <p className="font-semibold text-white mb-1">{t('register.config.official')}</p>
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, whatsappType: 'buy' })} className={`p-4 rounded-lg border-2 transition-all ${formData.whatsappType === 'buy' ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                    <Zap className={`w-6 h-6 mb-2 ${formData.whatsappType === 'buy' ? 'text-purple-400' : 'text-slate-500'}`} />
                    <p className="font-semibold text-white mb-1">{t('register.config.buy')}</p>
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
              {currentStep > 1 ? (
                <button type="button" onClick={handleBack} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" /> {t('register.actions.back')}
                </button>
              ) : <div></div>}

              {currentStep < 3 ? (
                <button type="button" onClick={handleNext} className="btn-primary flex items-center gap-2">
                  {t('register.actions.next')} <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="btn-primary min-w-[180px] flex justify-center">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('register.actions.create')}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
