import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-amber-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {children}
            </main>
            <footer className="mt-16 border-t border-amber-100 bg-white/60 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-xl">🪙</span>
                        <span className="font-display font-semibold text-gray-700">NumisColección</span>
                    </div>
                    <p className="text-xs text-gray-400">Sistema de gestión numismática · 2026</p>
                </div>
            </footer>
        </div>
    );
};

