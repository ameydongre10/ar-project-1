import React from 'react';
import { ARProvider } from './context/ARContext';
import { Header } from './components/Header';
import { HeroMonograph } from './components/HeroMonograph';
import { HardwareAnatomy } from './components/HardwareMonograph/HardwareAnatomy';
import { GestureLaboratory } from './components/GestureLab/GestureLaboratory';
import { ScenePersistence } from './components/PersistenceEngine/ScenePersistence';
import { NetworkSyncVisualizer } from './components/NetworkVisualizer/NetworkSyncVisualizer';
import { ArchitectureDiagram } from './components/SystemArchitecture/ArchitectureDiagram';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <ARProvider>
      <div className="min-h-screen bg-obsidian-950 text-titanium-200 flex flex-col font-sans">
        <Header />
        <main className="flex-1">
          <HeroMonograph />
          <HardwareAnatomy />
          <GestureLaboratory />
          <ScenePersistence />
          <NetworkSyncVisualizer />
          <ArchitectureDiagram />
        </main>
        <Footer />
      </div>
    </ARProvider>
  );
};

export default App;
