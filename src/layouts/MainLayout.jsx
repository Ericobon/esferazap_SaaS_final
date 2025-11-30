import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, MessageSquare, BookOpen, Settings,
    LogOut, Bell, Search, User, Menu, Database, Send
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/leads', icon: Database, label: 'Comprar Leads' },
        { path: '/campaigns', icon: Send, label: 'Campanhas' },
        { path: '/chat', icon: MessageSquare, label: 'Chat' },
        { path: '/knowledge', icon: BookOpen, label: 'Knowledge Base' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#0B1120]">
            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A]/90 backdrop-blur-xl border-r border-white/5 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <span className="text-white font-bold text-xl">E</span>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                EsferaZap
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-2 py-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full sidebar-link ${isActive ? 'active' : ''}`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer w-full"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {user?.displayName?.[0] || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.displayName || 'Usuário'}
                                </p>
                                <p className="text-xs text-slate-400 truncate">Sair da conta</p>
                            </div>
                            <LogOut className="w-4 h-4 text-slate-500 hover:text-red-400" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-[#0B1120]/50 backdrop-blur-sm z-40">
                    <button
                        className="md:hidden p-2 text-slate-400"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1 max-w-xl ml-4 md:ml-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-[#151E32] border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0B1120]"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
