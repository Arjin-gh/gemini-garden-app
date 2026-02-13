
import React, { useState } from 'react';
import { KnowledgeItem, FlowerLanguage } from '../types';

interface CollectionViewProps {
  collection: KnowledgeItem[];
  flowerLanguages: FlowerLanguage[];
}

const CollectionView: React.FC<CollectionViewProps> = ({ collection, flowerLanguages }) => {
  const [tab, setTab] = useState<'knowledge' | 'flower'>('flower');

  return (
    <div className="flex flex-col px-6 pt-12 pb-24 h-full overflow-y-auto">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-semibold text-gray-700 mb-2 font-handwritten">花语集</h1>
        <p className="text-gray-500 text-sm italic">知识与植物的共鸣</p>
      </div>

      <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-2xl mb-6 border border-white/50">
        <button 
          onClick={() => setTab('flower')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'flower' ? 'bg-[#7ebc59] text-white shadow-sm' : 'text-gray-400'}`}
        >
          知识花语
        </button>
        <button 
          onClick={() => setTab('knowledge')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'knowledge' ? 'bg-[#7ebc59] text-white shadow-sm' : 'text-gray-400'}`}
        >
          灵感卡片
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tab === 'flower' ? (
          flowerLanguages.length === 0 ? (
            <EmptyState message="还没有生成过花语呢" icon="✨" />
          ) : (
            flowerLanguages.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-green-50 hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-3">
                   <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-sm">🌸</div>
                   <span className="text-[10px] text-gray-300 font-medium">{item.date}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">今日所学：{item.knowledgePoint}</div>
                  <p className="text-gray-700 text-sm font-handwritten leading-relaxed bg-green-50/30 p-3 rounded-2xl italic border border-green-50/50">
                    {item.message}
                  </p>
                </div>
              </div>
            ))
          )
        ) : (
          collection.length === 0 ? (
            <EmptyState message="还没有收集到知识呢" icon="📚" />
          ) : (
            collection.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-bold">{item.category}</span>
                  <span className="text-[10px] text-gray-300">{item.date}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3 italic">"{item.content}"</p>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400">—— {item.source}</span>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ message, icon }: { message: string, icon: string }) => (
  <div className="text-center py-20 bg-white/40 rounded-3xl border border-dashed border-gray-300">
    <span className="text-4xl block mb-4">{icon}</span>
    <p className="text-gray-400 text-sm">{message}<br/>快去学习页面看看吧</p>
  </div>
);

export default CollectionView;
