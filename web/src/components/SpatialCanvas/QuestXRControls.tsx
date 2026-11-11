import React, { useState } from 'react';
import { Headset, Eye, X, Copy, Check, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { useAR } from '../../context/ARContext';

export const QuestXRModal: React.FC = () => {
  const { showQuestModal, setShowQuestModal, xrErrorMessage, isXRSupported, xrSupportedMode } = useAR();
  const [copied, setCopied] = useState(false);

  if (!showQuestModal) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://ameydongre10.github.io/ar-project-1/';

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fade-in">
      <div className="surface-monograph-elevated border-hairline-accent rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-phosphor-teal/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-obsidian-700/60 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-obsidian-900 border-hairline-accent flex items-center justify-center text-phosphor-teal shadow-phosphor-glow">
              <Headset className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
                  META QUEST // WEBXR PASSTHROUGH
                </span>
                <span className="w-2 h-2 rounded-full bg-phosphor-teal animate-pulse" />
              </div>
              <p className="text-[11px] font-mono text-titanium-400">
                Spatial Mixed Reality & Full-Room Passthrough
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowQuestModal(false)}
            className="btn-tactile p-1.5 rounded-xl text-titanium-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-5 space-y-4 font-mono text-xs relative z-10">
          {xrErrorMessage && (
            <div className="p-3 rounded-xl bg-phosphor-red/10 border border-phosphor-red/30 text-phosphor-red text-[11px]">
              {xrErrorMessage}
            </div>
          )}

          <div className="p-4 rounded-2xl bg-obsidian-900/90 border border-obsidian-700/50 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-titanium-400">
              <span>HEADSET DETECTION</span>
              <span className="text-phosphor-teal font-semibold">
                {isXRSupported ? `${xrSupportedMode?.toUpperCase()} READY` : 'STANDALONE OR LINK READY'}
              </span>
            </div>
            <p className="text-titanium-300 font-sans text-xs leading-relaxed">
              To experience this interactive spatial studio anchored to your physical table in color passthrough:
            </p>
          </div>

          {/* Quick Steps */}
          <div className="space-y-2 text-[11px]">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-obsidian-800/40 border-hairline">
              <span className="w-5 h-5 rounded-lg bg-phosphor-teal/20 text-phosphor-teal flex items-center justify-center font-bold text-[10px]">1</span>
              <span className="text-titanium-200">Put on your Meta Quest headset (Quest 3, Quest Pro, or Quest 2).</span>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-obsidian-800/40 border-hairline">
              <span className="w-5 h-5 rounded-lg bg-phosphor-teal/20 text-phosphor-teal flex items-center justify-center font-bold text-[10px]">2</span>
              <span className="text-titanium-200">Open the built-in <strong>Meta Quest Browser</strong>.</span>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-obsidian-800/40 border-hairline">
              <span className="w-5 h-5 rounded-lg bg-phosphor-teal/20 text-phosphor-teal flex items-center justify-center font-bold text-[10px]">3</span>
              <span className="text-titanium-200">Navigate to this URL and tap <strong>ENTER QUEST AR</strong> for 1-click passthrough.</span>
            </div>
          </div>

          {/* Copy URL Field */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-titanium-400 uppercase tracking-wider">Direct Headset URL</span>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-obsidian-900 border border-obsidian-700">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="bg-transparent flex-1 text-xs text-white outline-none select-all font-mono"
              />
              <button
                onClick={handleCopy}
                className="btn-tactile px-3 py-1.5 rounded-lg bg-phosphor-teal text-obsidian-950 font-bold text-[11px] flex items-center gap-1.5 hover:brightness-110 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-obsidian-800 flex items-center justify-between text-[11px] font-mono text-titanium-400 relative z-10">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-phosphor-teal" />
            <span>OPENXR / WEBXR API COMPLIANT</span>
          </span>
          <button
            onClick={() => setShowQuestModal(false)}
            className="btn-tactile px-4 py-1.5 rounded-lg bg-obsidian-800 text-white hover:bg-obsidian-700 transition-colors"
          >
            DISMISS
          </button>
        </div>

      </div>
    </div>
  );
};

export const QuestXRButton: React.FC<{ variant?: 'hero' | 'toolbar' | 'stage' }> = ({ variant = 'stage' }) => {
  const { isXRPresenting, enterQuestXR, exitQuestXR, isXRSupported } = useAR();
  const [connecting, setConnecting] = useState(false);

  const handleClick = async () => {
    if (isXRPresenting) {
      await exitQuestXR();
    } else {
      setConnecting(true);
      try {
        await enterQuestXR();
      } finally {
        setConnecting(false);
      }
    }
  };

  const label = connecting ? 'STARTING VR/AR...' : isXRPresenting ? 'EXIT PASSTHROUGH' : 'ENTER QUEST AR';

  if (variant === 'hero') {
    return (
      <button
        onClick={handleClick}
        disabled={connecting}
        className={`btn-tactile px-5 py-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2.5 shadow-optical transition-all duration-200 ${
          isXRPresenting
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
            : connecting
            ? 'bg-obsidian-800 text-titanium-400 border border-obsidian-700 animate-pulse'
            : 'bg-phosphor-teal text-obsidian-950 hover:brightness-110 shadow-phosphor-glow'
        }`}
      >
        <Headset className="w-4 h-4" />
        <span>{label}</span>
        {!isXRPresenting && !connecting && (
          <span className="w-2 h-2 rounded-full bg-obsidian-950 animate-ping" />
        )}
      </button>
    );
  }

  if (variant === 'toolbar') {
    return (
      <button
        onClick={handleClick}
        disabled={connecting}
        title={isXRPresenting ? 'Exit WebXR Passthrough' : 'Enter Meta Quest Mixed Reality AR'}
        className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
          isXRPresenting
            ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
            : connecting
            ? 'bg-obsidian-800 border-obsidian-700 text-titanium-400'
            : 'bg-obsidian-900/90 border-phosphor-teal/40 text-phosphor-teal hover:bg-phosphor-teal/15 hover:border-phosphor-teal shadow-phosphor-glow'
        }`}
      >
        <Headset className="w-4 h-4" />
        <span className="font-semibold">{connecting ? 'STARTING...' : isXRPresenting ? 'EXIT AR' : 'QUEST AR'}</span>
      </button>
    );
  }

  // Default 'stage' variant: sits in top stage header
  return (
    <button
      onClick={handleClick}
      disabled={connecting}
      className={`btn-tactile flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
        isXRPresenting
          ? 'bg-rose-950/90 border-rose-500/60 text-rose-300 hover:bg-rose-900'
          : connecting
          ? 'bg-obsidian-800 border-obsidian-700 text-titanium-400'
          : 'bg-emerald-500/15 border-phosphor-teal/50 text-phosphor-teal hover:bg-phosphor-teal/25 hover:border-phosphor-teal shadow-phosphor-glow'
      }`}
    >
      <Headset className="w-4 h-4" />
      <span>{label}</span>
      <span className={`w-1.5 h-1.5 rounded-full ${connecting ? 'bg-amber-400 animate-spin' : 'bg-phosphor-teal animate-pulse'}`} />
    </button>
  );
};
