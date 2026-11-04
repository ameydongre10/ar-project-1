import React from 'react';
import { ArrowUp, Eye, Cpu, ShieldCheck } from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-obsidian-800 bg-obsidian-950 py-16 text-titanium-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-obsidian-900 border-hairline-accent flex items-center justify-center text-phosphor-teal">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-white tracking-widest uppercase">
                AR-1 // SPATIAL MONOGRAPH
              </span>
            </div>
            <p className="text-xs text-titanium-400 font-sans leading-relaxed max-w-sm">
              Industrial spatial computing flagship and interactive hardware monograph for the AR Glasses Unity Mobile AR application.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-phosphor-teal pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PRODUCTION-GRADE AR FOUNDATION 6.0 PIPELINE</span>
            </div>
          </div>

          {/* Subsystem Manifest Links */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-[10px] text-titanium-500 uppercase tracking-widest block mb-2">
              CORE SYSTEM REPOSITORY ARTIFACTS
            </span>
            <ul className="space-y-1.5 text-titanium-400">
              <li>
                <a href="#studio-viewport" className="hover:text-white transition-colors">
                  &bull; ARVisualizationSystem.cs (3D Procedural Meshes)
                </a>
              </li>
              <li>
                <a href="#gesture-lab" className="hover:text-white transition-colors">
                  &bull; InputGestureSystem.cs (Multi-touch Telemetry)
                </a>
              </li>
              <li>
                <a href="#persistence" className="hover:text-white transition-colors">
                  &bull; PersistenceService.cs (JSON Scene Storage)
                </a>
              </li>
              <li>
                <a href="#network-sync" className="hover:text-white transition-colors">
                  &bull; NetworkingSyncSystem.cs (LAN & Cloud Replication)
                </a>
              </li>
            </ul>
          </div>

          {/* Technical Specs & Colophon */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-[10px] text-titanium-500 uppercase tracking-widest block mb-2">
              RUNTIME ENVIRONMENT
            </span>
            <div className="space-y-1 text-[11px] text-titanium-400">
              <div>ENGINE: Unity 6000.4.3f1</div>
              <div>XR SDK: AR Foundation 6.0</div>
              <div>WEBGL: Three.js + R3F</div>
              <div>DEPLOY: Vite + React 18 + TS</div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-obsidian-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[11px] text-titanium-500">
            <span>&copy; {new Date().getFullYear()} AR-1 Spatial Project. All rights reserved.</span>
            <a
              href="https://github.com/ameydongre10/ar-project-1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>ameydongre10/ar-project-1</span>
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="btn-tactile px-3 py-1.5 rounded-lg bg-obsidian-900 hover:bg-obsidian-850 text-titanium-300 hover:text-white border-hairline flex items-center gap-1.5"
          >
            <ArrowUp className="w-3.5 h-3.5 text-phosphor-teal" />
            <span>RETURN TO SUMMIT</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
