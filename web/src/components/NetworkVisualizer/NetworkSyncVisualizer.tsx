import React from 'react';
import { 
  Wifi, 
  Radio, 
  Cloud, 
  Activity, 
  Users, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2, 
  Zap,
  HardDrive
} from 'lucide-react';
import { useAR } from '../../context/ARContext';
import { NetworkSyncMode } from '../../types/ar';

export const NetworkSyncVisualizer: React.FC = () => {
  const { 
    syncMode, 
    setSyncMode, 
    networkPackets, 
    simulatedPing, 
    connectedPeers 
  } = useAR();

  const MODES: { mode: NetworkSyncMode; label: string; desc: string }[] = [
    { mode: 'Local', label: 'Local LAN', desc: 'Direct peer UDP multicast & TCP reliable broadcast' },
    { mode: 'Cloud', label: 'Cloud Relay', desc: 'Managed WebSocket cluster with regional edge routing' },
    { mode: 'Hybrid', label: 'Hybrid Sync', desc: 'Local peer discovery with cloud persistence fallback' },
    { mode: 'Offline', label: 'Offline Mode', desc: 'Air-gapped operation with zero network transmission' }
  ];

  return (
    <section id="network-sync" className="py-24 border-t border-obsidian-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-phosphor-teal uppercase tracking-widest mb-3">
              <Radio className="w-4 h-4 text-phosphor-teal" />
              <span>MULTIPLAYER REPLICATION // NETWORKINGSYNCSYSTEM.CS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase font-sans">
              Network Telemetry & Multi-Device Sync
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-obsidian-900 px-4 py-2 rounded-xl border-hairline">
              <span className="w-2.5 h-2.5 rounded-full bg-phosphor-teal animate-pulse" />
              <span className="text-xs font-mono text-titanium-300">
                PING: <strong className="text-white tabular-data">{simulatedPing} ms</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 bg-obsidian-900 px-4 py-2 rounded-xl border-hairline">
              <Users className="w-3.5 h-3.5 text-phosphor-teal" />
              <span className="text-xs font-mono text-titanium-300">
                PEERS: <strong className="text-white tabular-data">{connectedPeers.length}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Sync Mode Selector Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {MODES.map(({ mode, label, desc }) => (
            <div
              key={mode}
              onClick={() => setSyncMode(mode)}
              className={`p-5 rounded-2xl cursor-pointer btn-tactile border transition-all ${
                syncMode === mode
                  ? 'bg-obsidian-800/90 border-phosphor-teal shadow-optical ring-1 ring-phosphor-teal/40'
                  : 'bg-obsidian-900/60 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold font-mono text-white">{label}</span>
                <span className={`w-2 h-2 rounded-full ${syncMode === mode ? 'bg-phosphor-teal' : 'bg-obsidian-700'}`} />
              </div>
              <p className="text-xs text-titanium-400 font-sans leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Packet Stream + Peer Node Cluster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Live Packet Waterfall */}
          <div className="lg:col-span-8 surface-monograph rounded-3xl p-6 sm:p-8 border-hairline flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-obsidian-700/60 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-phosphor-teal" />
                <h3 className="text-base font-bold text-white font-mono">
                  REAL-TIME PACKET TRAFFIC WATERFALL
                </h3>
              </div>
              <div className="text-xs font-mono text-titanium-500">
                DELTA COMPRESSION ACTIVE: ~74% SAVINGS
              </div>
            </div>

            {/* Packet Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="text-titanium-500 border-b border-obsidian-800 text-[10px] uppercase">
                    <th className="pb-2">Packet ID</th>
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Channel</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Payload</th>
                    <th className="pb-2">Latency</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-800/50">
                  {networkPackets.map((pkt) => (
                    <tr key={pkt.id} className="hover:bg-obsidian-850/50 transition-colors">
                      <td className="py-2.5 font-semibold text-white tabular-data">{pkt.id}</td>
                      <td className="py-2.5 text-titanium-400 tabular-data">{pkt.timestamp}</td>
                      <td className="py-2.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          pkt.channel === 'TCP_RELIABLE' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : pkt.channel === 'CLOUD_WSS'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {pkt.channel}
                        </span>
                      </td>
                      <td className="py-2.5 text-titanium-200">{pkt.type}</td>
                      <td className="py-2.5 text-titanium-400 tabular-data">{pkt.payloadSize} B</td>
                      <td className="py-2.5 text-phosphor-teal tabular-data">{pkt.latencyMs} ms</td>
                      <td className="py-2.5 text-right">
                        <span className="text-[10px] text-phosphor-teal bg-obsidian-900 px-2 py-0.5 rounded border-hairline">
                          {pkt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 mt-4 border-t border-obsidian-700/60 text-[11px] font-mono text-titanium-400 flex items-center justify-between">
              <span>ACTIVE PROTOCOL: UDP MULTICAST / PORT 7777 + WSS SECURE</span>
              <span className="text-phosphor-teal">ZERO DROPPED PACKETS</span>
            </div>
          </div>

          {/* Right: Connected Nodes & Topology */}
          <div className="lg:col-span-4 surface-monograph-elevated rounded-3xl p-6 sm:p-8 border-hairline shadow-optical flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-obsidian-700/60">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Users className="w-4 h-4 text-phosphor-teal" />
                MESH TOPOLOGY
              </h3>
              <span className="text-[10px] font-mono text-phosphor-teal bg-obsidian-900 px-2 py-0.5 rounded border-hairline">
                SYNCHRONIZED
              </span>
            </div>

            <div className="space-y-3">
              {connectedPeers.map((peer, i) => (
                <div key={peer} className="p-3 rounded-xl bg-obsidian-900/80 border-hairline flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-phosphor-teal" />
                    <div>
                      <div className="text-xs font-mono font-medium text-white">{peer}</div>
                      <div className="text-[10px] font-mono text-titanium-500">Node ID: 0x48F{i + 1} &bull; Latency 3.9ms</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-phosphor-teal bg-obsidian-800 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>

            {/* Architecture Protocol Callout */}
            <div className="p-4 rounded-2xl bg-obsidian-950 border-hairline text-xs font-mono space-y-2">
              <div className="text-titanium-300 font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-phosphor-teal" />
                <span>STATE DETERMINISM</span>
              </div>
              <p className="text-[11px] text-titanium-400 leading-relaxed font-sans">
                Objects synchronized via delta timestamps and rotational quaternions. Conflict resolution uses authoritative Host timestamp arbitration with client-side interpolation.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
