import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    Database,
    Settings,
    LogOut,
    Bot,
    ChevronRight,
    ShoppingCart,
    Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export function Sidebar({ className }) {
    const { logout, user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: MessageSquare, label: 'Chat', href: '/chat' },
        { icon: Database, label: 'Knowledge Base', href: '/knowledge' },
        { icon: Bot, label: 'Agents', href: '/settings' },
        { icon: ShoppingCart, label: 'Buy Leads', href: '/leads' },
    ];

    return (
        <aside className={cn(
            "flex flex-col h-screen bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border transition-all duration-300",
            collapsed ? "w-20" : "w-64",
            className
        )}>
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
                <div className="flex items-center gap-2 text-sidebar-primary font-bold text-xl">
                    <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground">
                        <Bot className="w-5 h-5" />
                    </div>
                    {!collapsed && <span className="text-sidebar-foreground">IRIS</span>}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                            isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5 shrink-0", collapsed && "mx-auto")} />
                        {!collapsed && <span className="font-medium">{item.label}</span>}
                        {!collapsed && (
                            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Profile & Logout */}
            <div className="p-4 border-t border-sidebar-border space-y-2">
                {/* User Profile */}
                {user && (
                    <div className="px-2 py-3 rounded-lg bg-sidebar-accent/50 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                            </div>
                            {!collapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                                        {user.displayName || 'Usuário'}
                                    </p>
                                    <p className="text-xs text-sidebar-foreground/60 truncate">
                                        {user.company || user.email}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10",
                        collapsed && "justify-center px-0"
                    )}
                    onClick={() => logout()}
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span className="ml-3">Logout</span>}
                </Button>
            </div>
        </aside>
    );
}
