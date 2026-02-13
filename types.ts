
export enum GrowthStage {
  SEED = '种子🌰',
  SPROUT = '发芽🌱',
  SAPLING = '幼苗🌿',
  FLOWER = '开花🌸'
}

export type WeatherType = 'sunny' | 'rainy' | 'snowy' | 'cherry' | 'autumn';

export type PlantType = 'HAPPY_TREE' | 'MATH_FLOWER' | 'LANGUAGE_TREE' | 'SCIENCE_FRUIT';

export interface PlantInstance {
  id: string;
  type: PlantType;
  name: string;
  growthPoints: number;
  stage: GrowthStage;
  flowerLanguages: FlowerLanguage[];
}

export interface UserStats {
  sunlight: number;
  totalKnowledgeLearned: number;
  weather: WeatherType;
  ownedPlants: PlantInstance[];
}

export interface KnowledgeItem {
  id: string;
  content: string;
  source: string;
  category: string;
  reward: number;
  date: string;
}

export interface FlowerLanguage {
  id: string;
  knowledgePoint: string;
  message: string;
  date: string;
}

export interface CheckInRecord {
  id: string;
  goal: string;
  timestamp: string;
  points: number;
}

export type AppTab = 'garden' | 'study' | 'shop' | 'collection';
