import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background/50">
                {/* Header could go here if needed, or inside pages */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
