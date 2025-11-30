import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, Users, Settings, Bot, DollarSign, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AdminSidebar = ({ user }) => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Visão Geral', href: '/admin' },
        { icon: Users, label: 'Gestão de Usuários', href: '/admin/users' },
        { icon: Bot, label: 'Configuração do Agente', href: '/admin/agent-config' },
        { icon: DollarSign, label: 'Faturamento', href: '/admin/billing' },
        { icon: Settings, label: 'Configurações do Tenant', href: '/admin/tenant-settings' },
    ];

    return (
        <nav className="w-64 flex flex-col p-4 space-y-2 border-r border-slate-800 bg-[#0F172A]">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">
                Painel Admin
            </h2>
            <div className="text-sm text-slate-400 mb-4">
                Tenant: <span className="font-semibold text-purple-400">{user?.company || 'N/A'}</span>
            </div>
            {navItems.map((item) => (
                <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === '/admin'}
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive
                            ? "bg-purple-600 text-white shadow-md"
                            : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    )}
                >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export function AdminPanel() {
    const { user, logout } = useAuth();

    if (!user) {
        return <div className="text-white">Carregando...</div>;
    }

    // O Painel Administrativo deve ser um layout aninhado, mas para manter a simplicidade
    // e seguir a estrutura atual, vamos criar um layout simples aqui.
    // Em um projeto real, seria uma rota aninhada no App.jsx com um <Outlet />

    return (
        <div className="flex h-full min-h-[calc(100vh-48px)] bg-[#0B1120] text-white">
            <AdminSidebar user={user} />
            <div className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-6">Visão Geral do Tenant</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#151E32] p-6 rounded-lg shadow-lg border border-slate-700">
                        <h3 className="text-lg font-semibold text-purple-400 mb-2">Usuário Admin</h3>
                        <p className="text-slate-300">Nome: {user.displayName}</p>
                        <p className="text-slate-300">Email: {user.email}</p>
                        <p className="text-slate-300">Função: {user.role}</p>
                    </div>
                    <div className="bg-[#151E32] p-6 rounded-lg shadow-lg border border-slate-700">
                        <h3 className="text-lg font-semibold text-purple-400 mb-2">Tenant ID</h3>
                        <p className="text-slate-300">{user.tenantId || 'Não Definido'}</p>
                    </div>
                    <div className="bg-[#151E32] p-6 rounded-lg shadow-lg border border-slate-700">
                        <h3 className="text-lg font-semibold text-purple-400 mb-2">Plano Atual</h3>
                        <p className="text-slate-300">Básico (Upgrade)</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sair da Conta
                    </button>
                </div>
            </div>
        </div>
    );
}
