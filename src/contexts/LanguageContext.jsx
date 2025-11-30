import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
    pt: {
        login: {
            title: 'Acessar Plataforma',
            subtitle: 'Entre com sua conta ou',
            createAccount: 'crie uma nova',
            email: 'Email',
            password: 'Senha',
            rememberMe: 'Lembrar-me',
            forgotPassword: 'Esqueceu a senha?',
            signIn: 'Entrar',
            continueWith: 'Ou continue com',
            trustedBy: 'Confiado por empresas de todos os portes'
        },
        register: {
            steps: {
                personal: 'Dados Pessoais',
                company: 'Empresa',
                config: 'Configuração'
            },
            personal: {
                title: 'Seus Dados Pessoais',
                subtitle: 'Vamos começar com suas informações básicas',
                firstName: 'Nome',
                lastName: 'Sobrenome',
                email: 'Email',
                phone: 'Telefone',
                country: 'País',
                role: 'Cargo',
                password: 'Senha',
                confirmPassword: 'Confirmar Senha'
            },
            company: {
                title: 'Dados da Empresa',
                subtitle: 'Informações sobre sua organização',
                name: 'Nome da Empresa',
                sector: 'Setor',
                size: 'Tamanho',
                website: 'Site da Empresa (Opcional)'
            },
            config: {
                title: 'Configuração Inicial',
                subtitle: 'Configure seu WhatsApp e preferências',
                official: 'WhatsApp Oficial',
                buy: 'Comprar Número'
            },
            actions: {
                back: 'Voltar',
                next: 'Próximo',
                create: 'Criar Conta',
                loading: 'Criando conta...'
            }
        },
        sectors: {
            tech: 'Tecnologia / SaaS',
            retail: 'Varejo / E-commerce',
            services: 'Serviços Profissionais',
            health: 'Saúde / Clínicas',
            education: 'Educação / EdTech',
            finance: 'Financeiro / Fintech',
            real_estate: 'Imobiliário',
            logistics: 'Logística / Transporte',
            agro: 'Agronegócio',
            industry: 'Indústria / Manufatura',
            marketing: 'Agência de Marketing',
            other: 'Outro'
        },
        roles: {
            ceo: 'CEO / Fundador',
            manager: 'Gerente / Diretor',
            dev: 'Desenvolvedor / CTO',
            marketing: 'Marketing / Vendas',
            support: 'Atendimento / Suporte',
            other: 'Outro'
        }
    },
    en: {
        login: {
            title: 'Access Platform',
            subtitle: 'Sign in to your account or',
            createAccount: 'create a new one',
            email: 'Email',
            password: 'Password',
            rememberMe: 'Remember me',
            forgotPassword: 'Forgot password?',
            signIn: 'Sign In',
            continueWith: 'Or continue with',
            trustedBy: 'Trusted by companies of all sizes'
        },
        register: {
            steps: {
                personal: 'Personal Data',
                company: 'Company',
                config: 'Configuration'
            },
            personal: {
                title: 'Your Personal Data',
                subtitle: 'Let\'s start with your basic information',
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'Email',
                phone: 'Phone',
                country: 'Country',
                role: 'Job Title',
                password: 'Password',
                confirmPassword: 'Confirm Password'
            },
            company: {
                title: 'Company Data',
                subtitle: 'Information about your organization',
                name: 'Company Name',
                sector: 'Sector',
                size: 'Size',
                website: 'Company Website (Optional)'
            },
            config: {
                title: 'Initial Configuration',
                subtitle: 'Configure your WhatsApp and preferences',
                official: 'Official WhatsApp',
                buy: 'Buy Number'
            },
            actions: {
                back: 'Back',
                next: 'Next',
                create: 'Create Account',
                loading: 'Creating account...'
            }
        },
        sectors: {
            tech: 'Technology / SaaS',
            retail: 'Retail / E-commerce',
            services: 'Professional Services',
            health: 'Health / Clinics',
            education: 'Education / EdTech',
            finance: 'Financial / Fintech',
            real_estate: 'Real Estate',
            logistics: 'Logistics / Transport',
            agro: 'Agribusiness',
            industry: 'Industry / Manufacturing',
            marketing: 'Marketing Agency',
            other: 'Other'
        },
        roles: {
            ceo: 'CEO / Founder',
            manager: 'Manager / Director',
            dev: 'Developer / CTO',
            marketing: 'Marketing / Sales',
            support: 'Customer Support',
            other: 'Other'
        }
    }
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('pt');

    const t = (path) => {
        return path.split('.').reduce((obj, key) => obj?.[key], translations[language]) || path;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
