
import React, { useState, useEffect } from 'react';
import { UserStats, GrowthStage, AppTab, KnowledgeItem, CheckInRecord, FlowerLanguage, WeatherType, PlantInstance, PlantType } from './types';
import { STAGE_THRESHOLDS } from './constants';
import { generateFlowerLanguage } from './services/geminiService';
import GardenHome from './components/GardenHome';
import GardenDetail from './components/GardenDetail';
import StudyView from './components/StudyView';
import CollectionView from './components/CollectionView';
import SeedShop from './components/SeedShop';

const STORAGE_KEY = 'knowledge_garden_data_v6';

const INITIAL_PLANT: PlantInstance = {
  id: 'happy-tree-1',
  type: 'HAPPY_TREE',
  name: '初代幸福树',
  growthPoints: 0,
  stage: GrowthStage.SEED,
  flowerLanguages: []
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('garden');
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  
  const [stats, setStats] = useState<UserStats>({
    sunlight: 100,
    totalKnowledgeLearned: 0,
    weather: 'sunny',
    ownedPlants: [INITIAL_PLANT]
  });
  
  const [collection, setCollection] = useState<KnowledgeItem[]>([]);
  const [checkInHistory, setCheckInHistory] = useState<CheckInRecord[]>([]);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStats(parsed.stats || stats);
        setCollection(parsed.collection || []);
        setCheckInHistory(parsed.checkInHistory || []);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ stats, collection, checkInHistory }));
  }, [stats, collection, checkInHistory]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const handleWater = (plantId: string) => {
    if (stats.sunlight >= 5) {
      setStats(prev => {
        const updatedPlants = prev.ownedPlants.map(p => {
          if (p.id !== plantId) return p;
          
          const newPoints = p.growthPoints + 10;
          let newStage = p.stage;
          let msg = '';

          if (p.stage === GrowthStage.SEED && newPoints >= STAGE_THRESHOLDS['种子🌰']) {
            newStage = GrowthStage.SPROUT; msg = `${p.name} 破土而出了！🌱`;
          } else if (p.stage === GrowthStage.SPROUT && newPoints >= STAGE_THRESHOLDS['发芽🌱']) {
            newStage = GrowthStage.SAPLING; msg = `${p.name} 正在茁壮成长！🌿`;
          } else if (p.stage === GrowthStage.SAPLING && newPoints >= STAGE_THRESHOLDS['幼苗🌿']) {
            newStage = GrowthStage.FLOWER; msg = `${p.name} 终于绽放了！🌸`;
          }

          if (msg) showToast(msg);
          return { ...p, growthPoints: newPoints, stage: newStage };
        });

        return { ...prev, sunlight: prev.sunlight - 5, ownedPlants: updatedPlants };
      });
    }
  };

  const handlePurchase = (type: PlantType, name: string) => {
    if (stats.sunlight >= 50) {
      const newPlant: PlantInstance = {
        id: `plant-${Date.now()}`,
        type,
        name: `${name}-${stats.ownedPlants.length + 1}`,
        growthPoints: 0,
        stage: GrowthStage.SEED,
        flowerLanguages: []
      };
      setStats(prev => ({
        ...prev,
        sunlight: prev.sunlight - 50,
        ownedPlants: [...prev.ownedPlants, newPlant]
      }));
      showToast(`成功购买了 ${name}！🌿`);
    }
  };

  const handleLearn = (reward: number, item: KnowledgeItem) => {
    setStats(prev => ({ ...prev, sunlight: prev.sunlight + reward, totalKnowledgeLearned: prev.totalKnowledgeLearned + 1 }));
    setCollection(prev => [item, ...prev].slice(0, 100));
  };

  const handleCheckIn = async (goal: string, knowledgePoint: string) => {
    const aiMessage = await generateFlowerLanguage(knowledgePoint);
    const newRecord: CheckInRecord = { id: Date.now().toString(), goal, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), points: 10 };
    const newFlowerLanguage: FlowerLanguage = { id: `${Date.now()}-ai`, knowledgePoint, message: aiMessage, date: new Date().toLocaleDateString() };
    
    setStats(prev => {
      // Add flower language to the most active/first plant for now, or you could let them choose.
      // Let's add it to the first owned plant by default to satisfy "independent collections".
      const updatedPlants = [...prev.ownedPlants];
      if (updatedPlants.length > 0) {
        updatedPlants[0] = { ...updatedPlants[0], flowerLanguages: [newFlowerLanguage, ...updatedPlants[0].flowerLanguages].slice(0, 50) };
      }
      return { ...prev, sunlight: prev.sunlight + 10, ownedPlants: updatedPlants };
    });
    setCheckInHistory(prev => [newRecord, ...prev].slice(0, 10));
    showToast("花语已生成，植物很高兴！🌸");
  };

  const handleWeatherChange = (weather: WeatherType) => setStats(prev => ({ ...prev, weather }));

  // Flattened all flower languages for the general collection view
  const allFlowerLanguages = stats.ownedPlants.flatMap(p => p.flowerLanguages).sort((a, b) => b.id.localeCompare(a.id));

  const renderContent = () => {
    if (selectedPlantId) {
      const plant = stats.ownedPlants.find(p => p.id === selectedPlantId);
      if (plant) return <GardenDetail plant={plant} sunlight={stats.sunlight} weather={stats.weather} onWater={handleWater} onBack={() => setSelectedPlantId(null)} onWeatherChange={handleWeatherChange} />;
    }

    switch (activeTab) {
      case 'garden': return <GardenHome plants={stats.ownedPlants} sunlight={stats.sunlight} onSelect={setSelectedPlantId} />;
      case 'study': return <StudyView onLearn={handleLearn} onCheckIn={handleCheckIn} checkInHistory={checkInHistory} />;
      case 'shop': return <SeedShop sunlight={stats.sunlight} onPurchase={handlePurchase} />;
      case 'collection': return <CollectionView collection={collection} flowerLanguages={allFlowerLanguages} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden bg-gradient-to-b from-[#f0fdf4] via-[#fcfdf2] to-[#f0fdf4]">
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
        <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border border-green-100 text-[#7ebc59] font-bold text-sm">
          {toast.message}
        </div>
      </div>

      <div className={`absolute inset-0 transition-opacity duration-1000 ${stats.weather === 'rainy' ? 'bg-blue-900/10' : ''}`} />
      <div className={`absolute inset-0 transition-opacity duration-1000 ${stats.weather === 'snowy' ? 'bg-blue-50/20' : ''}`} />

      <main className="flex-1 overflow-hidden relative z-10">{renderContent()}</main>

      {!selectedPlantId && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center h-20 pb-4 px-4 z-20 shadow-lg">
          <NavButton active={activeTab === 'garden'} onClick={() => setActiveTab('garden')} icon="🌿" label="花园" />
          <NavButton active={activeTab === 'study'} onClick={() => setActiveTab('study')} icon="📚" label="学习" />
          <NavButton active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} icon="🛍️" label="商店" />
          <NavButton active={activeTab === 'collection'} onClick={() => setActiveTab('collection')} icon="🌸" label="花语" />
        </nav>
      )}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center transition-all flex-1 py-2 ${active ? 'scale-110' : 'opacity-40'}`}>
    <span className="text-xl mb-1">{icon}</span>
    <span className={`text-[10px] font-bold ${active ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
    {active && <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 animate-pulse" />}
  </button>
);

export default App;
