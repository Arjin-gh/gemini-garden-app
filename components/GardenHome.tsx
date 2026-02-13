
import React from 'react';
import { PlantInstance } from '../types';
import PlantDisplay from './PlantDisplay';

interface GardenHomeProps {
  plants: PlantInstance[];
  onSelect: (id: string) => void;
  sunlight: number;
}

const GardenHome: React.FC<GardenHomeProps> = ({ plants, onSelect, sunlight }) => {
  return (
    <div className="flex flex-col h-full px-6 pt-6 pb-24 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-700 font-handwritten">我的花园</h1>
          <p className="text-gray-400 text-xs mt-1">共有 {plants.length} 株植物正在生长</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-md border border-white/50 flex items-center gap-2">
          <span className="text-lg">☀️</span>
          <span className="font-bold text-orange-500">{sunlight}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {plants.map((plant) => (
          <button
            key={plant.id}
            onClick={() => onSelect(plant.id)}
            className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-4 border border-white/50 shadow-sm hover:shadow-md transition-all active:scale-95 group relative overflow-hidden h-64 flex flex-col items-center justify-between"
          >
            <div className="w-full h-32 flex items-center justify-center">
              <PlantDisplay stage={plant.stage} type={plant.type} />
            </div>
            <div className="text-center mt-2 w-full">
              <div className="text-xs font-bold text-green-600 bg-green-50 rounded-full py-1 px-2 inline-block mb-1">
                {plant.stage}
              </div>
              <h3 className="text-sm font-bold text-gray-700 truncate px-2">{plant.name}</h3>
              <div className="text-[10px] text-gray-400 mt-1">成长值: {plant.growthPoints}</div>
            </div>
            <div className="absolute top-4 right-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              🔍
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GardenHome;
