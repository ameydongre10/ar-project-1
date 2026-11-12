import React, { useState } from 'react';
import { Headset, Eye, X, Copy, Check, ExternalLink, Sparkles, ShieldCheck, Usb, Monitor, Smartphone, Terminal } from 'lucide-react';
import { useAR } from '../../context/ARContext';

export const QuestXRModal: React.FC = () => {
  const { 
    showQuestModal, 
    setShowQuestModal, 
    xrErrorMessage, 
    isXRSupported, 
    xrSupportedMode,
    enterVR,
    enterAR,
    isXRPresenting
  } = useAR();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedAdb, setCopiedAdb] = useState(false);
  const [activeTab, setActiveTab] = useState<'quest' | 'usb' | 'pcvr' | 'emulator'>('quest');

  if (!showQuestModal) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://ameydongre10.github.io/ar-project-1/';
  const adbCommand = 'adb reverse tcp:5173 tcp:5173';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyAdb = () => {
    navigator.clipboard.writeText(adbCommand);
    setCopiedAdb(true);
    setTimeout(() => setCopiedAdb(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fade-in">
      <div className="surface-monograph-elevated border-hairline-accent rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        
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
                  WEBXR SPATIAL BRIDGE // VR & AR
                </span>
                <span className="w-2 h-2 rounded-full bg-phosphor-teal animate-pulse" />
              </div>
              <p className="text-[11px] font-mono text-titanium-400">
                Meta Quest &bull; PC VR OpenXR &bull; USB Debugging
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 pt-4 pb-2 border-b border-obsidian-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('quest')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'quest' ? 'bg-phosphor-teal/20 text-phosphor-teal font-bold' : 'text-titanium-400 hover:text-white'
            }`}
          >
            <Headset className="w-3.5 h-3.5" />
            <span>Meta Quest</span>
          </button>
          <button
            onClick={() => setActiveTab('usb')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'usb' ? 'bg-phosphor-teal/20 text-phosphor-teal font-bold' : 'text-titanium-400 hover:text-white'
            }`}
          >
            <Usb className="w-3.5 h-3.5" />
            <span>USB Debugging</span>
          </button>
          <button
            onClick={() => setActiveTab('pcvr')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'pcvr' ? 'bg-phosphor-teal/20 text-phosphor-teal font-bold' : 'text-titanium-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>PC VR / SteamVR</span>
          </button>
          <button
            onClick={() => setActiveTab('emulator')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'emulator' ? 'bg-phosphor-teal/20 text-phosphor-teal font-bold' : 'text-titanium-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>WebXR Emulator</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="py-4 space-y-4 font-mono text-xs relative z-10">
          {xrErrorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
              {xrErrorMessage}
            </div>
          )}

          {activeTab === 'quest' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-obsidian-900/90 border border-obsidian-700/50 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-titanium-400">STANDALONE WEBXR</span>
                  <span className="text-phosphor-teal font-semibold">1-CLICK BROWSER LAUNCH</span>
                </div>
                <p className="text-titanium-300 font-sans text-xs leading-relaxed">
                  Put on your Meta Quest headset (Quest 3, 3S, Pro, or 2), open the built-in <strong>Meta Quest Browser</strong>, and open this URL:
                </p>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-obsidian-800/40 border-hairline">
                  <span className="w-5 h-5 rounded-lg bg-phosphor-teal/20 text-phosphor-teal flex items-center justify-center font-bold text-[10px]">1</span>
                  <span className="text-titanium-200">Open <strong>Meta Quest Browser</strong> in VR.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-obsidian-800/40 border-hairline">
                  <span className="w-5 h-5 rounded-lg bg-phosphor-teal/20 text-phosphor-teal flex items-center justify-center font-bold text-[10px]">2</span>
                  <span className="text-titanium-200">Type or paste this URL into the address bar.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-obsidian-800/40 border-hairline">
                  <span className="w-5 h-5 rounded-lg bg-phosphor-teal/20 text-phosphor-teal flex items-center justify-center font-bold text-[10px]">3</span>
                  <span className="text-titanium-200">Tap <strong>ENTER VR</strong> for full 3D cleanroom studio or <strong>ENTER AR</strong> for color passthrough.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usb' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-obsidian-900/90 border border-obsidian-700/50 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-titanium-400">USB REVERSE TETHERING</span>
                  <span className="text-phosphor-teal font-semibold">PORT 5173 ZERO-LATENCY</span>
                </div>
                <p className="text-titanium-300 font-sans text-xs leading-relaxed">
                  To test your local dev server in VR over USB cable, run ADB reverse port forwarding:
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-titanium-400 uppercase tracking-wider">Run in Terminal / PowerShell</span>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-obsidian-900 border border-obsidian-700">
                  <code className="bg-transparent flex-1 text-xs text-phosphor-teal outline-none select-all font-mono">
                    {adbCommand}
                  </code>
                  <button
                    onClick={handleCopyAdb}
                    className="btn-tactile px-3 py-1.5 rounded-lg bg-obsidian-800 text-white font-bold text-[11px] flex items-center gap-1.5 hover:bg-obsidian-700 transition-all"
                  >
                    {copiedAdb ? <Check className="w-3.5 h-3.5 text-phosphor-teal" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAdb ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-titanium-400 font-sans">
                Then inside Meta Quest Browser, simply open <strong>http://localhost:5173/</strong> directly!
              </p>
            </div>
          )}

          {activeTab === 'pcvr' && (
            <div className="space-y-3 text-[11px]">
              <div className="p-3.5 rounded-2xl bg-obsidian-900/90 border border-obsidian-700/50 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-titanium-400">PC VR HEADSET</span>
                  <span className="text-phosphor-teal font-semibold">OPENXR RUNTIME</span>
                </div>
                <p className="text-titanium-300 font-sans text-xs leading-relaxed">
                  Compatible with SteamVR, Valve Index, HTC Vive, Oculus Link, and Windows Mixed Reality.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-obsidian-800/40 border-hairline text-titanium-200">
                  1. Connect headset to PC and launch <strong>SteamVR</strong> or <strong>Meta Quest Link</strong>.
                </div>
                <div className="p-2.5 rounded-xl bg-obsidian-800/40 border-hairline text-titanium-200">
                  2. Open <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> on your PC.
                </div>
                <div className="p-2.5 rounded-xl bg-obsidian-800/40 border-hairline text-titanium-200">
                  3. Click the <strong>ENTER VR</strong> button below. Your PC VR headset will activate immediately in 6-DoF.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emulator' && (
            <div className="space-y-3 text-[11px]">
              <div className="p-3.5 rounded-2xl bg-obsidian-900/90 border border-obsidian-700/50 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-titanium-400">DESKTOP SIMULATION</span>
                  <span className="text-phosphor-teal font-semibold">NO HEADSET REQUIRED</span>
                </div>
                <p className="text-titanium-300 font-sans text-xs leading-relaxed">
                  Test full 6-DoF VR controller raycasting and studio physics directly on your desktop PC screen.
                </p>
              </div>

              <div className="space-y-2 text-titanium-200">
                <div className="p-2.5 rounded-xl bg-obsidian-800/40 border-hairline">
                  1. Install the free <strong>WebXR API Emulator</strong> extension from Chrome Web Store.
                </div>
                <div className="p-2.5 rounded-xl bg-obsidian-800/40 border-hairline">
                  2. Press <code>F12</code> to open DevTools &rarr; switch to the <strong>WebXR</strong> tab.
                </div>
                <div className="p-2.5 rounded-xl bg-obsidian-800/40 border-hairline">
                  3. Select <strong>Meta Quest 3</strong>. The VR button below will activate instantly.
                </div>
              </div>
            </div>
          )}

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
                onClick={handleCopyUrl}
                className="btn-tactile px-3 py-1.5 rounded-lg bg-phosphor-teal text-obsidian-950 font-bold text-[11px] flex items-center gap-1.5 hover:brightness-110 transition-all"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-obsidian-800 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-titanium-400 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowQuestModal(false);
                enterVR();
              }}
              className="btn-tactile px-3.5 py-2 rounded-xl bg-phosphor-teal text-obsidian-950 font-bold flex items-center gap-1.5 hover:brightness-110 transition-all shadow-phosphor-glow"
            >
              <Headset className="w-3.5 h-3.5" />
              <span>LAUNCH VR</span>
            </button>
            <button
              onClick={() => {
                setShowQuestModal(false);
                enterAR();
              }}
              className="btn-tactile px-3.5 py-2 rounded-xl bg-obsidian-800 text-white font-semibold hover:bg-obsidian-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-phosphor-teal" />
              <span>LAUNCH AR</span>
            </button>
          </div>

          <button
            onClick={() => setShowQuestModal(false)}
            className="btn-tactile px-4 py-2 rounded-xl bg-obsidian-900 text-titanium-300 hover:text-white hover:bg-obsidian-800 transition-colors border border-obsidian-700"
          >
            DISMISS
          </button>
        </div>

      </div>
    </div>
  );
};

export const QuestXRButton: React.FC<{ variant?: 'hero' | 'toolbar' | 'stage'; mode?: 'vr' | 'ar' | 'both' }> = ({ 
  variant = 'stage',
  mode = 'both'
}) => {
  const { isXRPresenting, xrSessionMode, enterVR, enterAR, exitXR } = useAR();
  const [connectingVR, setConnectingVR] = useState(false);
  const [connectingAR, setConnectingAR] = useState(false);

  const handleLaunchVR = async () => {
    if (isXRPresenting) {
      await exitXR();
    } else {
      setConnectingVR(true);
      try {
        await enterVR();
      } finally {
        setConnectingVR(false);
      }
    }
  };

  const handleLaunchAR = async () => {
    if (isXRPresenting) {
      await exitXR();
    } else {
      setConnectingAR(true);
      try {
        await enterAR();
      } finally {
        setConnectingAR(false);
      }
    }
  };

  if (variant === 'hero') {
    return (
      <div className="flex items-center gap-3">
        {/* Dedicated ENTER VR Button */}
        <button
          onClick={handleLaunchVR}
          disabled={connectingVR}
          className={`btn-tactile px-5 py-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2.5 shadow-optical transition-all duration-200 ${
            isXRPresenting && xrSessionMode === 'vr'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              : connectingVR
              ? 'bg-obsidian-800 text-titanium-400 border border-obsidian-700 animate-pulse'
              : 'bg-phosphor-teal text-obsidian-950 hover:brightness-110 shadow-phosphor-glow'
          }`}
        >
          <Headset className="w-4 h-4" />
          <span>{connectingVR ? 'STARTING VR...' : isXRPresenting && xrSessionMode === 'vr' ? 'EXIT VR' : 'ENTER VR'}</span>
          {!isXRPresenting && !connectingVR && (
            <span className="w-2 h-2 rounded-full bg-obsidian-950 animate-ping" />
          )}
        </button>

        {/* Dedicated ENTER AR Button */}
        <button
          onClick={handleLaunchAR}
          disabled={connectingAR}
          className={`btn-tactile px-4 py-3 rounded-xl text-xs font-mono font-semibold tracking-wider uppercase flex items-center gap-2 border transition-all duration-200 ${
            isXRPresenting && xrSessionMode === 'ar'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : connectingAR
              ? 'bg-obsidian-800 text-titanium-400 border-obsidian-700 animate-pulse'
              : 'surface-monograph text-white hover:bg-obsidian-800 border-hairline'
          }`}
        >
          <Eye className="w-4 h-4 text-phosphor-teal" />
          <span>{connectingAR ? 'STARTING AR...' : isXRPresenting && xrSessionMode === 'ar' ? 'EXIT AR' : 'ENTER AR'}</span>
        </button>
      </div>
    );
  }

  if (variant === 'toolbar') {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleLaunchVR}
          disabled={connectingVR}
          title={isXRPresenting && xrSessionMode === 'vr' ? 'Exit Virtual Reality' : 'Enter VR Virtual Studio'}
          className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
            isXRPresenting && xrSessionMode === 'vr'
              ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
              : connectingVR
              ? 'bg-obsidian-800 border-obsidian-700 text-titanium-400'
              : 'bg-obsidian-900/90 border-phosphor-teal/40 text-phosphor-teal hover:bg-phosphor-teal/15 hover:border-phosphor-teal shadow-phosphor-glow'
          }`}
        >
          <Headset className="w-3.5 h-3.5" />
          <span className="font-semibold">{connectingVR ? 'STARTING...' : isXRPresenting && xrSessionMode === 'vr' ? 'EXIT VR' : 'ENTER VR'}</span>
        </button>

        <button
          onClick={handleLaunchAR}
          disabled={connectingAR}
          title={isXRPresenting && xrSessionMode === 'ar' ? 'Exit Mixed Reality' : 'Enter Mixed Reality Passthrough'}
          className={`btn-tactile flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all border ${
            isXRPresenting && xrSessionMode === 'ar'
              ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
              : 'bg-obsidian-900/70 border-obsidian-700 text-titanium-300 hover:text-white hover:bg-obsidian-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-phosphor-teal" />
          <span className="hidden sm:inline">AR</span>
        </button>
      </div>
    );
  }

  // Default 'stage' variant
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLaunchVR}
        disabled={connectingVR}
        className={`btn-tactile flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
          isXRPresenting && xrSessionMode === 'vr'
            ? 'bg-rose-950/90 border-rose-500/60 text-rose-300 hover:bg-rose-900'
            : connectingVR
            ? 'bg-obsidian-800 border-obsidian-700 text-titanium-400'
            : 'bg-emerald-500/15 border-phosphor-teal/50 text-phosphor-teal hover:bg-phosphor-teal/25 hover:border-phosphor-teal shadow-phosphor-glow'
        }`}
      >
        <Headset className="w-4 h-4" />
        <span>{connectingVR ? 'STARTING VR...' : isXRPresenting && xrSessionMode === 'vr' ? 'EXIT VR' : 'ENTER VR'}</span>
        <span className={`w-1.5 h-1.5 rounded-full ${connectingVR ? 'bg-amber-400 animate-spin' : 'bg-phosphor-teal animate-pulse'}`} />
      </button>

      <button
        onClick={handleLaunchAR}
        disabled={connectingAR}
        className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
          isXRPresenting && xrSessionMode === 'ar'
            ? 'bg-rose-950/90 border-rose-500/60 text-rose-300'
            : 'bg-obsidian-900/80 border-obsidian-700 text-titanium-300 hover:text-white hover:bg-obsidian-800'
        }`}
      >
        <Eye className="w-3.5 h-3.5 text-phosphor-teal" />
        <span>AR</span>
      </button>
    </div>
  );
};
