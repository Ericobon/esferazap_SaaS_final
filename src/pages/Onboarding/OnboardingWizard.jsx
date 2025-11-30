/**
 * Wizard de Onboarding - EsferaZap
 * Progressive Onboarding - Fase 2
 * 3 Steps: Empresa → WhatsApp → Objetivo
 * Integrado com Firebase
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, title: 'Sua Empresa', description: 'Conte-nos sobre seu negócio' },
  { id: 2, title: 'WhatsApp', description: 'Configure sua integração' },
  { id: 3, title: 'Objetivo', description: 'O que você quer fazer primeiro?' },
];

export function OnboardingWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Empresa
    companyName: '',
    segment: '',
    teamSize: '',

    // Step 2: WhatsApp
    phoneNumber: '',
    hasWhatsAppBusiness: false,

    // Step 3: Objetivo
    primaryGoal: '',
  });

  const progress = (currentStep / STEPS.length) * 100;

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      // Salvar dados do onboarding no Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        company: formData.companyName,
        sector: formData.segment,
        companySize: formData.teamSize,
        phone: formData.phoneNumber,
        hasWhatsAppBusiness: formData.hasWhatsAppBusiness,
        primaryGoal: formData.primaryGoal,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString()
      });

      toast.success('Configuração concluída com sucesso!');

      // Redirecionar baseado no objetivo
      const goalRoutes = {
        leads: '/dashboard',  // Por enquanto vai para dashboard
        automation: '/dashboard',
        campaigns: '/dashboard',
      };

      navigate(goalRoutes[formData.primaryGoal] || '/dashboard');
    } catch (error) {
      console.error('Erro ao salvar onboarding:', error);
      toast.error('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  step.id < STEPS.length ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                    currentStep > step.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : currentStep === step.id
                      ? 'border-primary text-primary'
                      : 'border-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                {step.id < STEPS.length && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Card do Wizard */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Step 1: Empresa */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da empresa</Label>
                  <Input
                    id="companyName"
                    placeholder="Minha Empresa Ltda"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segment">Segmento</Label>
                  <Select
                    value={formData.segment}
                    onValueChange={(value) => handleChange('segment', value)}
                  >
                    <SelectTrigger id="segment" className="h-11">
                      <SelectValue placeholder="Selecione o segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Tecnologia</SelectItem>
                      <SelectItem value="health">Saúde</SelectItem>
                      <SelectItem value="education">Educação</SelectItem>
                      <SelectItem value="retail">Varejo</SelectItem>
                      <SelectItem value="services">Serviços</SelectItem>
                      <SelectItem value="finance">Financeiro</SelectItem>
                      <SelectItem value="real-estate">Imobiliário</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Tamanho da equipe</Label>
                  <Select
                    value={formData.teamSize}
                    onValueChange={(value) => handleChange('teamSize', value)}
                  >
                    <SelectTrigger id="teamSize" className="h-11">
                      <SelectValue placeholder="Selecione o tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Apenas eu</SelectItem>
                      <SelectItem value="2-10">2-10 pessoas</SelectItem>
                      <SelectItem value="11-50">11-50 pessoas</SelectItem>
                      <SelectItem value="51-200">51-200 pessoas</SelectItem>
                      <SelectItem value="201+">Mais de 200 pessoas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: WhatsApp */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Número do WhatsApp Business</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+55 11 99999-9999"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    className="h-11"
                  />
                  <p className="text-sm text-muted-foreground">
                    Número que será usado para automação
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hasWhatsAppBusiness">
                    Você já tem WhatsApp Business API?
                  </Label>
                  <Select
                    value={formData.hasWhatsAppBusiness ? 'yes' : 'no'}
                    onValueChange={(value) =>
                      handleChange('hasWhatsAppBusiness', value === 'yes')
                    }
                  >
                    <SelectTrigger id="hasWhatsAppBusiness" className="h-11">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Sim, já tenho</SelectItem>
                      <SelectItem value="no">Não, preciso configurar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!formData.hasWhatsAppBusiness && (
                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                    <p className="text-sm text-secondary-foreground">
                      <strong>💡 Não se preocupe!</strong> Vamos te ajudar a configurar
                      o WhatsApp Business API gratuitamente no próximo passo.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Objetivo */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>O que você quer fazer primeiro?</Label>

                  {/* Opção: Comprar Leads */}
                  <button
                    type="button"
                    onClick={() => handleChange('primaryGoal', 'leads')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.primaryGoal === 'leads'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">🎯</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Comprar Leads Qualificados</h4>
                        <p className="text-sm text-muted-foreground">
                          Adquira leads com filtros personalizados (estado, segmento,
                          atividade)
                        </p>
                      </div>
                      {formData.primaryGoal === 'leads' && (
                        <CheckCircle2 className="text-primary w-5 h-5 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  {/* Opção: Automatizar Atendimento */}
                  <button
                    type="button"
                    onClick={() => handleChange('primaryGoal', 'automation')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.primaryGoal === 'automation'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">🤖</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">
                          Automatizar Atendimento WhatsApp
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Configure bots inteligentes com IA para atender clientes 24/7
                        </p>
                      </div>
                      {formData.primaryGoal === 'automation' && (
                        <CheckCircle2 className="text-primary w-5 h-5 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  {/* Opção: Criar Campanhas */}
                  <button
                    type="button"
                    onClick={() => handleChange('primaryGoal', 'campaigns')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.primaryGoal === 'campaigns'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">📢</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Criar Campanhas</h4>
                        <p className="text-sm text-muted-foreground">
                          Lance campanhas de marketing automatizadas via WhatsApp
                        </p>
                      </div>
                      {formData.primaryGoal === 'campaigns' && (
                        <CheckCircle2 className="text-primary w-5 h-5 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Botões de Navegação */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isLoading}
              >
                Voltar
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.primaryGoal || isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? 'Finalizando...' : 'Começar! 🚀'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skip */}
        <div className="mt-4 text-center">
          <button
            onClick={async () => {
              if (user) {
                await updateDoc(doc(db, 'users', user.uid), {
                  onboardingCompleted: true,
                  updatedAt: new Date().toISOString()
                });
              }
              navigate('/dashboard');
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pular configuração por agora
          </button>
        </div>
      </div>
    </div>
  );

  function isStepValid() {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.segment && formData.teamSize;
      case 2:
        return formData.phoneNumber;
      case 3:
        return formData.primaryGoal;
      default:
        return false;
    }
  }
}

export default OnboardingWizard;
