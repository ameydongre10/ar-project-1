import React, { useState, useRef } from 'react';
import { 
  Fingerprint, 
  Activity, 
  RotateCw, 
  Maximize, 
  Minimize, 
  Move, 
  Clock, 
  MousePointer, 
  Sparkles,
  Trash2
} from 'lucide-react';
import { useAR } from '../../context/ARContext';
import { GestureType } from '../../types/ar';

export const GestureLaboratory: React.FC = () => {
  const { 
    gestures, 
    recordGesture, 
    clearGestures, 
    selectedPrimitive 
  } = useAR();

  const padRef = useRef<HTMLDivElement>(null);
  const [touchPoint, setTouchPoint] = useState<{ x: number; y: number } | null>(null);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartTimeRef = useRef<number>(0);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle trackpad pointer down
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTouchPoint({ x, y });
    setIsPressing(true);
    pressStartTimeRef.current = performance.now();
    startPosRef.current = { x, y };

    // Set timer for LongPress detection
    pressTimerRef.current = setTimeout(() => {
      const normX = +(x / rect.width).toFixed(2);
      const normY = +(y / rect.height).toFixed(2);
      recordGesture({
        type: 'LongPress',
        coords: [normX, normY],
        delta: [0, 0],
        magnitude: 1.0,
        durationMs: 520,
        targetId: selectedPrimitive?.id
      });
      setIsPressing(false);
    }, 500);
  };

  // Handle pointer move (Swipe / Drag)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPressing || !padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    setTouchPoint({ x: currentX, y: currentY });

    const dx = currentX - startPosRef.current.x;
    const dy = currentY - startPosRef.current.y;
    const dist = Math.hypot(dx, dy);

    // If moved more than threshold, cancel long press
    if (dist > 15 && pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  // Handle pointer up (SingleTap or Swipe)
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const duration = Math.round(performance.now() - pressStartTimeRef.current);
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const dx = Math.round(endX - startPosRef.current.x);
    const dy = Math.round(endY - startPosRef.current.y);
    const dist = Math.hypot(dx, dy);
    const normX = +(endX / rect.width).toFixed(2);
    const normY = +(endY / rect.height).toFixed(2);

    if (dist > 30) {
      // Detected Swipe
      recordGesture({
        type: 'Swipe',
        coords: [normX, normY],
        delta: [dx, dy],
        magnitude: +(dist / 100).toFixed(2),
        durationMs: duration,
        targetId: selectedPrimitive?.id
      });
    } else if (duration < 350) {
      // Detected SingleTap
      recordGesture({
        type: 'SingleTap',
        coords: [normX, normY],
        delta: [0, 0],
        magnitude: 1.0,
        durationMs: duration,
        targetId: selectedPrimitive?.id
      });
    }

    setIsPressing(false);
    setTimeout(() => setTouchPoint(null), 300);
  };

  // Handle wheel for Pinch simulation
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = +(x / rect.width).toFixed(2);
    const normY = +(y / rect.height).toFixed(2);

    const isZoomIn = e.deltaY < 0;
    recordGesture({
      type: 'Pinch',
      coords: [normX, normY],
      delta: [0, Math.round(e.deltaY)],
      magnitude: isZoomIn ? 1.15 : 0.85,
      durationMs: 120,
      targetId: selectedPrimitive?.id
    });
  };

  // Quick gesture trigger helper
  const triggerQuickGesture = (type: GestureType) => {
    recordGesture({
      type,
      coords: [0.5, 0.5],
      delta: type === 'Swipe' ? [45, -20] : [0, 0],
      magnitude: type === 'Pinch' ? 1.25 : 1.0,
      durationMs: 150,
      targetId: selectedPrimitive?.id
    });
  };

  return (
    <section id="gesture-lab" className="py-24 border-t border-obsidian-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-phosphor-teal uppercase tracking-widest mb-3">
              <Fingerprint className="w-4 h-4 text-phosphor-teal" />
              <span>SPATIAL INPUT TELEMETRY // INPUTGESTURESYSTEM.CS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase font-sans">
              Gesture Laboratory
            </h2>
          </div>
          <p className="text-sm text-titanium-400 max-w-md font-mono">
            Interactive multi-touch trackpad simulating mobile AR input. Taps, holds, pinch-scaling, and directional flicks translate directly to real-time 3D object transforms.
          </p>
        </div>

        {/* Studio Trackpad + Live Telemetry Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Touchpad */}
          <div className="lg:col-span-7 surface-monograph rounded-3xl p-6 sm:p-8 border-hairline flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-titanium-400">
                <span className="w-2 h-2 rounded-full bg-phosphor-teal animate-ping" />
                <span>ACTIVE CAPACITIVE TRACKPAD // 120HZ TOUCH SAMPLING</span>
              </div>
              <span className="text-[10px] font-mono text-titanium-500">
                GESTURES ACTIVELY MODIFY 3D STUDIO
              </span>
            </div>

            {/* Capacitive Surface */}
            <div
              ref={padRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
              className="relative w-full h-80 bg-obsidian-900/90 rounded-2xl border-hairline border-dashed border-white/20 cursor-crosshair overflow-hidden touch-none flex items-center justify-center select-none"
            >
              {/* Background Crosshairs & Grid */}
              <div className="absolute inset-0 tech-dots opacity-40 pointer-events-none" />
              <div className="absolute w-px h-full bg-white/5 pointer-events-none" />
              <div className="absolute h-px w-full bg-white/5 pointer-events-none" />

              {/* Touch ripple indicator */}
              {touchPoint && (
                <div
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
                  style={{ left: touchPoint.x, top: touchPoint.y }}
                >
                  <div className="w-12 h-12 rounded-full border border-phosphor-teal bg-phosphor-teal/20 animate-ping" />
                  <div className="w-4 h-4 rounded-full bg-phosphor-teal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-phosphor-glow" />
                  <span className="absolute top-6 left-6 text-[9px] font-mono text-phosphor-teal bg-obsidian-950 px-1.5 py-0.5 rounded border-hairline whitespace-nowrap">
                    [{touchPoint.x}, {touchPoint.y}]
                  </span>
                </div>
              )}

              {/* Center Helper Text */}
              <div className="text-center pointer-events-none text-titanium-400/60 z-10">
                <MousePointer className="w-8 h-8 mx-auto mb-2 opacity-40 text-phosphor-teal" />
                <p className="text-xs font-mono">
                  TAP TO SELECT &bull; HOLD FOR LONG-PRESS &bull; DRAG TO SWIPE &bull; SCROLL TO PINCH
                </p>
                {selectedPrimitive && (
                  <p className="text-[11px] font-mono text-phosphor-teal mt-1">
                    TARGET: {selectedPrimitive.name}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Trigger Buttons */}
            <div className="mt-6 pt-4 border-t border-obsidian-700/60 flex flex-wrap gap-2">
              <span className="text-[11px] font-mono text-titanium-500 self-center mr-2">SIMULATE:</span>
              {[
                { type: 'SingleTap', label: 'Single Tap' },
                { type: 'DoubleTap', label: 'Double Tap' },
                { type: 'LongPress', label: 'Long Press' },
                { type: 'Pinch', label: 'Pinch Zoom' },
                { type: 'Rotate', label: '2-Finger Rotate' },
                { type: 'Swipe', label: 'Swipe Flick' },
              ].map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => triggerQuickGesture(type as GestureType)}
                  className="btn-tactile px-3 py-1.5 rounded-xl bg-obsidian-900/80 hover:bg-obsidian-800 text-xs font-mono text-titanium-300 hover:text-white border-hairline"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Live Telemetry Feed */}
          <div className="lg:col-span-5 surface-monograph-elevated rounded-3xl p-6 sm:p-8 border-hairline shadow-optical flex flex-col max-h-[500px]">
            <div className="flex items-center justify-between pb-4 border-b border-obsidian-700/60 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-phosphor-teal" />
                <h3 className="text-base font-bold text-white font-mono">
                  GESTURE EVENT LOG
                </h3>
              </div>
              <button
                onClick={clearGestures}
                title="Clear log"
                className="p-1.5 rounded-lg text-titanium-500 hover:text-white hover:bg-obsidian-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Telemetry Stream List */}
            <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
              {gestures.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-xs font-mono text-titanium-500">
                  NO GESTURE EVENTS RECORDED YET. INTERACT ON TRACKPAD.
                </div>
              ) : (
                gestures.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 rounded-xl bg-obsidian-900/90 border-hairline font-mono text-xs hover:border-white/20 transition-all flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-phosphor-teal uppercase tracking-wide">
                        {g.type}
                      </span>
                      <span className="text-[10px] text-titanium-500 tabular-data">
                        {g.timestamp}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-titanium-400">
                      <div>
                        NORM: <span className="text-white tabular-data">[{g.normalizedCoords[0]}, {g.normalizedCoords[1]}]</span>
                      </div>
                      <div>
                        DELTA: <span className="text-white tabular-data">[{g.pixelDelta[0]}, {g.pixelDelta[1]}]px</span>
                      </div>
                      <div>
                        DUR: <span className="text-white tabular-data">{g.durationMs}ms</span>
                      </div>
                      <div>
                        MAG: <span className="text-white tabular-data">{g.magnitude.toFixed(2)}</span>
                      </div>
                    </div>

                    {g.targetId && (
                      <div className="text-[10px] text-phosphor-amber pt-1 border-t border-obsidian-800">
                        DISPATCHED TO: {g.targetId}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            <div className="pt-3 mt-3 border-t border-obsidian-700/60 text-[11px] font-mono text-titanium-400 flex items-center justify-between">
              <span>EVENTS IN BUFFER: {gestures.length}</span>
              <span className="text-phosphor-teal">EVENT DISPATCHER 100% GREEN</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
