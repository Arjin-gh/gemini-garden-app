
import React, { useState, useEffect } from 'react';
import { generateKnowledge } from '../services/geminiService';
import { KnowledgeItem, CheckInRecord } from '../types';

interface StudyViewProps {
  onLearn: (reward: number, item: KnowledgeItem) => void;
  onCheckIn: (goal: string, learnedNote: string) => Promise<void>;
  checkInHistory: CheckInRecord[];
}

const StudyView: React.FC<StudyViewProps> = ({ onLearn, onCheckIn, checkInHistory }) => {
  const [currentCard, setCurrentCard] = useState<KnowledgeItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [learned, setLearned] = useState(false);
  const [goal, setGoal] = useState('');
  
  // Knowledge Flower Language Modal States
  const [showModal, setShowModal] = useState(false);
  const [knowledgeInput, setKnowledgeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCard = async () => {
    setLoading(true);
    setLearned(false);
    const card = await generateKnowledge();
    setCurrentCard(card);
    setLoading(false);
  };

  useEffect(() => {
    fetchCard();
  }, []);

  const handleLearn = () => {
    if (currentCard && !learned) {
      onLearn(currentCard.reward, currentCard);
      setLearned(true);
    }
  };

  const handleStartCheckIn = () => {
    if (goal.trim()) {
      setShowModal(true);
    }
  };

  const handleSubmitCheckIn = async () => {
    if (knowledgeInput.trim()) {
      setIsSubmitting(true);
      await onCheckIn(goal, knowledgeInput);
      setGoal('');
      setKnowledgeInput('');
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-6 pt-10 pb-24 h-full overflow-y-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-700 mb-1 font-handwritten">知识汲取</h1>
        <p className="text-gray-500 text-xs">每一次打卡，都是向着阳光生长</p>
      </div>

      <div className="w-full max-w-sm space-y-8">
        {/* Study Check-in Section */}
        <div className="bg-white/80 p-6 rounded-3xl shadow-sm border border-white/50 space-y-4">
          <h2 className="text-sm font-bold text-gray-600 flex items-center gap-2">
            <span className="text-lg">🎯</span> 今日学习目标
          </h2>
          <div className="relative">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="例如：阅读30分钟、背10个单词..."
              className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-300"
            />
          </div>
          <button
            onClick={handleStartCheckIn}
            disabled={!goal.trim()}
            className={`w-full py-3 rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
              goal.trim()
                ? 'bg-[#7ebc59] text-white hover:bg-[#6da94a]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            完成学习 +10☀️
          </button>
        </div>

        {/* AI Knowledge Card Section */}
        <div className="space-y-4">
           <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">灵感一刻</h2>
           {loading ? (
            <div className="bg-white p-10 rounded-3xl shadow-sm text-center animate-pulse border border-gray-50">
              <div className="w-10 h-10 bg-green-50 rounded-full mx-auto mb-4" />
              <div className="h-3 bg-gray-50 rounded w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-gray-50 rounded w-1/2 mx-auto" />
            </div>
          ) : currentCard && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex flex-col gap-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-16 bg-green-50/50 rounded-bl-full pointer-events-none" />
               <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-green-500 px-2 py-0.5 bg-green-50 rounded-lg">{currentCard.category}</span>
                  <span className="text-gray-300 text-[10px]">{currentCard.date}</span>
                </div>
                
                <p className="text-gray-600 text-base leading-relaxed font-handwritten italic">
                  "{currentCard.content}"
                </p>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                  <span className="text-gray-400 text-[10px]">—— {currentCard.source}</span>
                  <button 
                    onClick={handleLearn}
                    disabled={learned}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
                      learned ? 'text-gray-300 bg-gray-50' : 'text-orange-500 bg-orange-50 hover:bg-orange-100'
                    }`}
                  >
                    {learned ? '已汲取' : `汲取灵感 +${currentCard.reward}☀️`}
                  </button>
                </div>
            </div>
          )}
          {!loading && (
            <button onClick={fetchCard} className="w-full text-center text-[10px] text-gray-400 hover:text-green-500 transition-colors">
              换一张灵感卡片 ✨
            </button>
          )}
        </div>

        {/* Recent History Section */}
        <div className="space-y-3 pb-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">最近打卡</h2>
          {checkInHistory.length === 0 ? (
            <p className="text-center text-xs text-gray-300 py-4 italic">今天还没有打卡记录哦...</p>
          ) : (
            <div className="space-y-2">
              {checkInHistory.slice(0, 3).map((record) => (
                <div key={record.id} className="bg-white/40 border border-white/60 p-3 rounded-2xl flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm">✅</div>
                    <div>
                      <div className="text-xs font-medium text-gray-700 line-clamp-1">{record.goal}</div>
                      <div className="text-[9px] text-gray-400">{record.timestamp}</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-orange-400">+{record.points}☀️</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Flower Language Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-[scaleIn_0.3s_ease-out]">
            <div className="text-center space-y-4">
              <div className="text-4xl">🌸</div>
              <h3 className="text-xl font-bold text-gray-700 font-handwritten">生成知识花语</h3>
              <p className="text-gray-500 text-sm">今天学到了什么？（一句话）</p>
              <textarea
                value={knowledgeInput}
                onChange={(e) => setKnowledgeInput(e.target.value)}
                rows={3}
                placeholder="例如：我学会了光合作用的原理"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
              />
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-gray-400 text-sm font-bold hover:bg-gray-50 rounded-2xl transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitCheckIn}
                  disabled={!knowledgeInput.trim() || isSubmitting}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm text-white shadow-md transition-all ${
                    knowledgeInput.trim() && !isSubmitting
                      ? 'bg-[#7ebc59] hover:bg-[#6da94a]'
                      : 'bg-gray-200 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? '花语生成中...' : '提交'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default StudyView;
