import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Menu, 
  X, 
  ExternalLink, 
  Layers, 
  Activity, 
  Radio, 
  Database,
  Cpu,
  Box
} from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';
import { useAR } from '../context/ARContext';

export const Header: React.FC = () => {
  const { simulatedPing } = useAR();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fps, setFps] = useState(60.0);

  // Subtle FPS jitter simulator for authentic technical feel
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(+(59.4 + Math.random() * 0.8).toFixed(1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-obsidian-950/80 backdrop-blur-xl border-b border-obsidian-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand System Designation */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-xl bg-obsidian-900 border-hairline-accent flex items-center justify-center text-phosphor-teal shadow-phosphor-glow">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
              <span>AR-1 MONOGRAPH</span>
              <span className="w-1.5 h-1.5 rounded-full bg-phosphor-teal animate-pulse" />
            </div>
            <div className="text-[10px] font-mono text-titanium-400">
              SPATIAL OPTICS & SLAM
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
          {[
            { id: 'studio-viewport', label: 'Studio' },
            { id: 'hardware-monograph', label: 'Hardware CAD' },
            { id: 'gesture-lab', label: 'Gesture Lab' },
            { id: 'persistence', label: 'Persistence' },
            { id: 'network-sync', label: 'Network' },
            { id: 'system-architecture', label: 'Architecture' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="px-3 py-1.5 rounded-lg text-titanium-400 hover:text-white hover:bg-obsidian-900 transition-colors"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right Status Badges & GitHub Link */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-xs">
          <div className="bg-obsidian-900/90 px-2.5 py-1 rounded-lg border-hairline flex items-center gap-2">
            <span className="text-[10px] text-titanium-500">FPS:</span>
            <span className="text-phosphor-teal font-medium tabular-data">{fps}</span>
          </div>

          <div className="bg-obsidian-900/90 px-2.5 py-1 rounded-lg border-hairline flex items-center gap-2">
            <span className="text-[10px] text-titanium-500">PING:</span>
            <span className="text-white tabular-data">{simulatedPing}ms</span>
          </div>

          <a
            href="https://github.com/ameydongre10/ar-project-1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tactile p-2 rounded-xl bg-obsidian-900 hover:bg-obsidian-800 text-titanium-300 hover:text-white border-hairline flex items-center gap-1.5"
            title="GitHub Repository"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-obsidian-900 text-titanium-300 hover:text-white border-hairline"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-obsidian-950/95 border-b border-obsidian-800 px-4 py-4 space-y-2 font-mono text-xs">
          {[
            { id: 'studio-viewport', label: '3D Spatial Studio' },
            { id: 'hardware-monograph', label: 'Hardware CAD Monograph' },
            { id: 'gesture-lab', label: 'Gesture Laboratory' },
            { id: 'persistence', label: 'Scene Persistence & Schema' },
            { id: 'network-sync', label: 'Multiplayer Network Sync' },
            { id: 'system-architecture', label: 'System Architecture' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="block w-full text-left px-3 py-2 rounded-lg text-titanium-300 hover:text-white hover:bg-obsidian-900"
            >
              {label}
            </button>
          ))}
          <div className="pt-2 border-t border-obsidian-800 flex items-center justify-between text-titanium-400">
            <span>FPS: {fps} &bull; PING: {simulatedPing}ms</span>
            <a
              href="https://github.com/ameydongre10/ar-project-1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-phosphor-teal flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
