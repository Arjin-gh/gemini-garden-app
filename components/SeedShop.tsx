
import React from 'react';
import { SHOP_ITEMS } from '../constants';
import { PlantType } from '../types';

interface SeedShopProps {
  sunlight: number;
  onPurchase: (type: PlantType, name: string) => void;
}

const SeedShop: React.FC<SeedShopProps> = ({ sunlight, onPurchase }) => {
  return (
    <div className="flex flex-col px-6 pt-10 pb-24 h-full overflow-y-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-gray-700 mb-2 font-handwritten">种子商店</h1>
        <p className="text-gray-500 text-sm">用阳光换取新的生命</p>
      </div>

      <div className="space-y-6">
        {SHOP_ITEMS.map((item) => (
          <div key={item.type} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-700">{item.name}</h3>
                <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                  <span>☀️</span> {item.cost} 阳光
                </div>
              </div>
            </div>
            <button
              onClick={() => onPurchase(item.type, item.name)}
              disabled={sunlight < item.cost}
              className={`px-6 py-2 rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-95 ${
                sunlight >= item.cost
                  ? 'bg-[#7ebc59] text-white hover:bg-[#6da94a]'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              购买
            </button>
          </div>
        ))}

        <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 mt-4">
          <p className="text-xs text-orange-700 leading-relaxed italic">
            "每一个种子的买入，都是一次对未来好奇心的投资。让你的花园在这个多样的知识世界里绽放。"
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeedShop;
