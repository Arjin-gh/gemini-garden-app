
import React from 'react';
import { GrowthStage, PlantType } from '../types';
import { PLANT_ASSETS } from '../constants';

interface PlantDisplayProps {
  stage: GrowthStage;
  type: PlantType;
}

const PlantDisplay: React.FC<PlantDisplayProps> = ({ stage, type }) => {
  const asset = PLANT_ASSETS[type][stage];

  return (
    <div className="flex justify-center items-center h-full relative">
      <div className="absolute bottom-4 w-48 h-12 bg-black/5 rounded-[100%] blur-xl" />
      <div className="w-64 h-64 flex items-center justify-center">
        {asset}
      </div>
    </div>
  );
};

export default PlantDisplay;
