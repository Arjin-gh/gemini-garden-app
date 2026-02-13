
import React, { useState, useEffect, useMemo } from 'react';
import { PlantInstance, FlowerLanguage, WeatherType, GrowthStage } from '../types';
import { STAGE_THRESHOLDS } from '../constants';
import PlantDisplay from './PlantDisplay';

interface GardenDetailProps {
  plant: PlantInstance;
  sunlight: number;
  weather: WeatherType;
  onWater: (plantId: string) => void;
  onBack: () => void;
  onWeatherChange: (weather: WeatherType) => void;
}

const GardenDetail: React.FC<GardenDetailProps> = ({ plant, sunlight, weather, onWater, onBack, onWeatherChange }) => {
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);

  useEffect(() => {
    if (plant.flowerLanguages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentLanguageIndex((prev) => (prev + 1) % plant.flowerLanguages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [plant.flowerLanguages.length]);

  const calculateProgress = () => {
    let currentThreshold = 0;
    let nextThreshold = 0;

    switch (plant.stage) {
      case GrowthStage.SEED:
        currentThreshold = 0;
        nextThreshold = STAGE_THRESHOLDS['种子🌰'];
        break;
      case GrowthStage.SPROUT:
        currentThreshold = STAGE_THRESHOLDS['种子🌰'];
        nextThreshold = STAGE_THRESHOLDS['发芽🌱'];
        break;
      case GrowthStage.SAPLING:
        currentThreshold = STAGE_THRESHOLDS['发芽🌱'];
        nextThreshold = STAGE_THRESHOLDS['幼苗🌿'];
        break;
      case GrowthStage.FLOWER:
        return 100;
      default:
        return 0;
    }

    const range = nextThreshold - currentThreshold;
    const progressInRange = plant.growthPoints - currentThreshold;
    return Math.min(100, Math.max(0, (progressInRange / range) * 100));
  };

  const progress = calculateProgress();
  const canWater = sunlight >= 5;
  const currentLanguage = plant.flowerLanguages[currentLanguageIndex];

  const particles = useMemo(() => {
    if (weather === 'sunny') return [];
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
      opacity: 0.3 + Math.random() * 0.7
    }));
  }, [weather]);

  const weatherIcons: { type: WeatherType; icon: string; label: string }[] = [
    { type: 'sunny', icon: '☀️', label: '晴天' },
    { type: 'rainy', icon: '🌧️', label: '雨天' },
    { type: 'snowy', icon: '❄️', label: '雪天' },
    { type: 'cherry', icon: '🌸', label: '樱花' },
    { type: 'autumn', icon: '🍂', label: '秋叶' },
  ];

  return (
    <div className="relative flex flex-col items-center justify-between h-full px-6 pt-6 pb-24 overflow-hidden">
      {/* Weather Layer */}
      <div className="weather-layer">
        {weather === 'rainy' && particles.map(p => <div key={p.id} className="particle rain-drop" style={{ left: p.left, animationDelay: p.delay, animationDuration: '1s', opacity: p.opacity }} />)}
        {weather === 'snowy' && particles.map(p => <div key={p.id} className="particle snow-flake" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, opacity: p.opacity }} />)}
        {weather === 'cherry' && particles.map((p, i) => <div key={p.id} className="particle petal" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, opacity: p.opacity, background: i % 2 === 0 ? '#ffc0cb' : '#ffb6c1' }} />)}
        {weather === 'autumn' && particles.map((p, i) => <div key={p.id} className="particle leaf" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, opacity: p.opacity, background: i % 2 === 0 ? '#d4a373' : '#bc6c25' }} />)}
      </div>

      <div className="w-full flex justify-between items-start z-20">
        <button onClick={onBack} className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center shadow-sm">
          🔙
        </button>
        <div className="bg-white/40 backdrop-blur-md p-1 rounded-2xl border border-white/40 flex gap-1">
          {weatherIcons.map(w => (
            <button key={w.type} onClick={() => onWeatherChange(w.type)} className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${weather === w.type ? 'bg-white shadow-sm' : 'opacity-60'}`}>
              <span className="text-xs">{w.icon}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center z-10 mt-2">
        <h2 className="text-2xl font-bold text-gray-700 font-handwritten">{plant.name}</h2>
        <p className="text-gray-400 text-xs">浇灌阳光，让它快快长大</p>
      </div>

      <div className="relative w-full flex-1 flex flex-col items-center justify-center z-10">
        {currentLanguage && (
          <div className="absolute top-0 z-20 px-4 py-3 bg-white/95 backdrop-blur-md border border-green-100 rounded-2xl shadow-lg max-w-[85%] animate-bounce text-center">
            <p className="text-xs text-green-700 font-handwritten leading-relaxed">{currentLanguage.message}</p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-green-100" />
          </div>
        )}
        <div className="h-64">
           <PlantDisplay stage={plant.stage} type={plant.type} />
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4 z-10">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] shadow-sm border border-white/50 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-gray-500">
            <span>成长阶段</span>
            <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full">{plant.stage}</span>
          </div>
          <div className="space-y-1">
             <div className="flex justify-between text-[10px] text-gray-400">
                <span>成长值 {plant.growthPoints}</span>
                <span>{Math.round(progress)}%</span>
             </div>
             <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 progress-transition" style={{ width: `${progress}%` }} />
             </div>
          </div>
          <div className="flex justify-between items-center pt-2">
             <div className="text-orange-500 font-bold text-sm">☀️ {sunlight} <span className="text-gray-300 font-normal">可用</span></div>
             <button
               onClick={() => onWater(plant.id)}
               disabled={!canWater}
               className={`px-8 py-2 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 ${canWater ? 'bg-[#7ebc59] text-white' : 'bg-gray-200 text-gray-400'}`}
             >
               浇灌 (5☀️)
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenDetail;
