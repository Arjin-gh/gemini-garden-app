
import React from 'react';
import { PlantType, GrowthStage } from './types';

export const COLORS = {
  primary: '#7ebc59',
  secondary: '#fff9c4',
  accent: '#ff8a65',
  bgGradient: 'from-[#f0fdf4] via-[#fcfdf2] to-[#f0fdf4]',
  card: '#ffffffcc'
};

export const STAGE_THRESHOLDS = {
  '种子🌰': 50,
  '发芽🌱': 100,
  '幼苗🌿': 200,
  '开花🌸': 200
};

const Pot = () => (
  <path d="M30 85 L70 85 L75 98 L25 98 Z" fill="#d2b48c" stroke="#8b4513" strokeWidth="2" />
);
const Soil = () => (
  <ellipse cx="50" cy="85" rx="20" ry="5" fill="#5d4037" />
);

export const PLANT_ASSETS: Record<PlantType, Record<GrowthStage, React.ReactNode>> = {
  HAPPY_TREE: {
    [GrowthStage.SEED]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-float">
        <Pot /><Soil />
        <path d="M45 78 Q50 70 55 78 Q55 85 50 85 Q45 85 45 78" fill="#a0522d" />
      </svg>
    ),
    [GrowthStage.SPROUT]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-sway">
        <Pot /><Soil />
        <path d="M50 85 Q50 65 50 65" stroke="#4a2c2a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M50 65 Q65 50 60 45 Q55 40 50 65" fill="#8bc34a" />
        <path d="M50 65 Q35 50 40 45 Q45 40 50 65" fill="#aed581" />
      </svg>
    ),
    [GrowthStage.SAPLING]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-sway">
        <Pot /><Soil />
        <path d="M50 85 L50 45" stroke="#5d4037" strokeWidth="5" strokeLinecap="round" />
        <path d="M50 65 L68 55" stroke="#5d4037" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 55 L32 48" stroke="#5d4037" strokeWidth="3" strokeLinecap="round" />
        <circle cx="68" cy="55" r="10" fill="#8bc34a" />
        <circle cx="32" cy="48" r="9" fill="#9ccc65" />
        <circle cx="50" cy="40" r="12" fill="#7cb342" />
      </svg>
    ),
    [GrowthStage.FLOWER]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-sway">
        <Pot /><Soil />
        <path d="M50 85 L50 40" stroke="#5d4037" strokeWidth="6" strokeLinecap="round" />
        <circle cx="50" cy="25" r="10" fill="#ff80ab" />
        <circle cx="65" cy="35" r="10" fill="#ff80ab" />
        <circle cx="60" cy="50" r="10" fill="#ff80ab" />
        <circle cx="40" cy="50" r="10" fill="#ff80ab" />
        <circle cx="35" cy="35" r="10" fill="#ff80ab" />
        <circle cx="50" cy="38" r="8" fill="#ffd54f" />
      </svg>
    )
  },
  MATH_FLOWER: {
    [GrowthStage.SEED]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-float">
        <Pot /><Soil />
        <rect x="42" y="75" width="16" height="10" fill="#546e7a" rx="2" />
      </svg>
    ),
    [GrowthStage.SPROUT]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-sway">
        <Pot /><Soil />
        <path d="M50 85 V65" stroke="#546e7a" strokeWidth="4" />
        <path d="M40 60 H60 M50 50 V70" stroke="#ffb300" strokeWidth="3" />
      </svg>
    ),
    [GrowthStage.SAPLING]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-sway">
        <Pot /><Soil />
        <path d="M50 85 V50" stroke="#546e7a" strokeWidth="4" />
        <polygon points="50,30 65,55 35,55" fill="#00acc1" />
        <rect x="60" y="55" width="10" height="10" fill="#e53935" />
      </svg>
    ),
    [GrowthStage.FLOWER]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-sway">
        <Pot /><Soil />
        <path d="M50 85 V40" stroke="#546e7a" strokeWidth="5" />
        <circle cx="50" cy="25" r="15" fill="#fdd835" />
        <text x="50" y="30" fontSize="12" textAnchor="middle" fill="#795548" fontWeight="bold">π</text>
        <rect x="30" y="45" width="12" height="12" fill="#fb8c00" transform="rotate(45 36 51)" />
        <rect x="58" y="45" width="12" height="12" fill="#fb8c00" transform="rotate(45 64 51)" />
      </svg>
    )
  },
  LANGUAGE_TREE: {
    [GrowthStage.SEED]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-float">
        <Pot /><Soil />
        <circle cx="50" cy="80" r="6" fill="#795548" />
      </svg>
    ),
    [GrowthStage.SPROUT]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-sway">
        <Pot /><Soil />
        <path d="M50 85 Q50 60 50 60" stroke="#795548" strokeWidth="3" />
        <path d="M50 60 Q60 50 70 60" stroke="#8e24aa" strokeWidth="2" fill="none" />
        <text x="65" y="55" fontSize="10" fill="#8e24aa" fontWeight="bold">A</text>
      </svg>
    ),
    [GrowthStage.SAPLING]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-sway">
        <Pot /><Soil />
        <path d="M50 85 V50" stroke="#795548" strokeWidth="4" />
        <rect x="35" y="35" width="30" height="20" fill="#fff" stroke="#8e24aa" />
        <line x1="50" y1="35" x2="50" y2="55" stroke="#8e24aa" />
      </svg>
    ),
    [GrowthStage.FLOWER]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-sway">
        <Pot /><Soil />
        <path d="M50 85 V30" stroke="#795548" strokeWidth="5" />
        <path d="M30 10 Q50 0 70 10 Q80 30 50 40 Q20 30 30 10" fill="#ab47bc" />
        <text x="50" y="25" fontSize="12" textAnchor="middle" fill="white">文</text>
      </svg>
    )
  },
  SCIENCE_FRUIT: {
    [GrowthStage.SEED]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-float">
        <Pot /><Soil />
        <path d="M45 80 A5 5 0 0 1 55 80" fill="#37474f" />
      </svg>
    ),
    [GrowthStage.SPROUT]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-sway">
        <Pot /><Soil />
        <path d="M50 85 Q55 75 50 65 Q45 55 50 45" stroke="#1e88e5" strokeWidth="3" fill="none" />
      </svg>
    ),
    [GrowthStage.SAPLING]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-sway">
        <Pot /><Soil />
        <path d="M50 85 V50" stroke="#1e88e5" strokeWidth="4" />
        <circle cx="50" cy="40" r="10" fill="#90caf9" stroke="#1565c0" />
        <circle cx="50" cy="40" r="3" fill="#1565c0" />
      </svg>
    ),
    [GrowthStage.FLOWER]: (
      <svg viewBox="0 0 100 100" className="w-full h-full animate-sway">
        <Pot /><Soil />
        <path d="M50 85 V40" stroke="#1e88e5" strokeWidth="5" />
        <circle cx="50" cy="25" r="18" fill="#e1f5fe" stroke="#0288d1" strokeWidth="2" />
        <ellipse cx="50" cy="25" rx="15" ry="5" stroke="#0288d1" fill="none" />
        <ellipse cx="50" cy="25" rx="5" ry="15" stroke="#0288d1" fill="none" />
        <circle cx="50" cy="25" r="4" fill="#0288d1" />
      </svg>
    )
  }
};

export const SHOP_ITEMS = [
  { type: 'MATH_FLOWER' as PlantType, name: '数学之花', cost: 50, icon: '📐' },
  { type: 'LANGUAGE_TREE' as PlantType, name: '语言之树', cost: 50, icon: '📖' },
  { type: 'SCIENCE_FRUIT' as PlantType, name: '科学之果', cost: 50, icon: '🧪' },
];
