import React, { useState, useEffect, useMemo } from 'react';
import { UserStats, GrowthStage, FlowerLanguage, WeatherType } from '../types';
import { STAGE_THRESHOLDS } from '../constants';
import PlantDisplay from './PlantDisplay';

interface GardenViewProps {
  stats: UserStats;
  onWater: () => void;
  onWeatherChange: (weather: WeatherType) => void;
  flowerLanguages: FlowerLanguage[];
}

const GardenView: React.FC<GardenViewProps> = ({ stats, onWater, onWeatherChange, flowerLanguages }) => {
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  // Fix: Access the primary plant from ownedPlants as stage and growthPoints are not directly on stats
  const mainPlant = stats.ownedPlants[0];

  useEffect(() => {
    if (flowerLanguages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentLanguageIndex((prev) => (prev + 1) % flowerLanguages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [flowerLanguages.length]);

  const calculateProgress = () => {
    if (!mainPlant) return 0;
    let currentThreshold = 0;
    let nextThreshold = 0;

    // Fix: Access stage from mainPlant instead of stats
    switch (mainPlant.stage) {
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
    // Fix: Access growthPoints from mainPlant instead of stats
    const progressInRange = mainPlant.growthPoints - currentThreshold;
    return Math.min(100, Math.max(0, (progressInRange / range) * 100));
  };

  const progress = calculateProgress();
  const canWater = stats.sunlight >= 5;
  const currentLanguage = flowerLanguages[currentLanguageIndex];

  // Particle generation for weather
  const particles = useMemo(() => {
    if (stats.weather === 'sunny') return [];
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
      opacity: 0.3 + Math.random() * 0.7
    }));
  }, [stats.weather]);

  const weatherIcons: { type: WeatherType; icon: string; label: string }[] = [
    { type: 'sunny', icon: '☀️', label: '晴天' },
    { type: 'rainy', icon: '🌧️', label: '雨天' },
    { type: 'snowy', icon: '❄️', label: '雪天' },
    { type: 'cherry', icon: '🌸', label: '樱花' },
    { type: 'autumn', icon: '🍂', label: '秋叶' },
  ];

  return (
    <div className="relative flex flex-col items-center justify-between h-full px-6 pt-6 pb-24 transition-colors duration-1000">
      
      {/* Dynamic Weather Layer (Behind Plant) */}
      <div className="weather-layer">
        {stats.weather === 'rainy' && particles.map(p => (
          <div key={p.id} className="particle rain-drop" style={{ left: p.left, animationDelay: p.delay, animationDuration: '1s', opacity: p.opacity }} />
        ))}
        {stats.weather === 'snowy' && particles.map(p => (
          <div key={p.id} className="particle snow-flake" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, opacity: p.opacity }} />
        ))}
        {/* Fix: Added index 'i' to map parameters for cherry weather particles */}
        {stats.weather === 'cherry' && particles.map((p, i) => (
          <div key={p.id} className="particle petal" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, opacity: p.opacity, background: i % 2 === 0 ? '#ffc0cb' : '#ffb6c1' }} />
        ))}
        {/* Fix: Added index 'i' to map parameters for autumn weather particles */}
        {stats.weather === 'autumn' && particles.map((p, i) => (
          <div key={p.id} className="particle leaf" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, opacity: p.opacity, background: i % 2 === 0 ? '#d4a373' : '#bc6c25' }} />
        ))}
      </div>

      {/* Top Bar with Weather Switcher & Sunlight */}
      <div className="w-full flex justify-between items-start z-20">
        <div className="bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 flex gap-1">
          {weatherIcons.map(w => (
            <button
              key={w.type}
              onClick={() => onWeatherChange(w.type)}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                stats.weather === w.type ? 'bg-white shadow-sm scale-110' : 'opacity-60 hover:opacity-100'
              }`}
              title={w.label}
            >
              <span className="text-sm">{w.icon}</span>
            </button>
          ))}
        </div>

        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-md border border-white/50 flex items-center gap-2 animate-float">
          <span className="text-xl">☀️</span>
          <span className="font-bold text-orange-500 text-lg">{stats.sunlight}</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mt-4 z-10">
        <h1 className="text-3xl font-semibold text-gray-700 mb-1 font-handwritten">我的幸福树</h1>
        <p className="text-gray-500 text-sm italic">浇灌知识，静待成长</p>
      </div>

      {/* Plant Area */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center z-10">
        {/* Flower Language Speech Bubble */}
        {currentLanguage && (
          <div className="absolute top-4 z-20 px-4 py-3 bg-white/95 backdrop-blur-md border border-green-100 rounded-2xl shadow-lg max-w-[85%] animate-bounce transition-all duration-1000">
            <p className="text-xs text-green-700 font-handwritten text-center leading-relaxed">
              {currentLanguage.message}
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-green-100" />
          </div>
        )}
        
        {/* Fix: Pass stage and type from mainPlant to PlantDisplay and ensure mainPlant exists */}
        {mainPlant && <PlantDisplay stage={mainPlant.stage} type={mainPlant.type} />}
      </div>

      {/* Stats Card */}
      <div className="w-full max-w-sm space-y-6 z-10">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/50 space-y-5">
          <div className="flex justify-between items-center text-sm font-medium text-gray-600">
            <span className="flex items-center gap-1">幸福树状态 <span className="text-xs opacity-50">Species: {mainPlant?.type || 'Happy Tree'}</span></span>
            {/* Fix: Access stage from mainPlant instead of stats */}
            <span className="text-green-600 bg-green-100/80 px-4 py-1 rounded-full font-bold">{mainPlant?.stage || '种子🌰'}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-400">
              {/* Fix: Access growthPoints from mainPlant instead of stats */}
              <span>成长值: {mainPlant?.growthPoints || 0}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-4 bg-gray-200/50 rounded-full overflow-hidden p-0.5 border border-gray-100">
              <div 
                className="h-full bg-gradient-to-r from-green-300 via-green-400 to-green-500 rounded-full progress-transition shadow-[0_0_10px_rgba(74,222,128,0.3)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">💧</div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">给幸福树浇水</div>
                <div className="text-sm font-bold text-gray-600">5 ☀️ / 次</div>
              </div>
            </div>
            
            <button 
              onClick={onWater}
              disabled={!canWater}
              className={`px-8 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-90 ${
                canWater 
                ? 'bg-[#7ebc59] text-white hover:bg-[#6da94a] shadow-green-200 hover:shadow-green-300' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed grayscale'
              }`}
            >
              浇灌阳光
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenView;