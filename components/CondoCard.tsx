

import React from 'react';
import { Condo } from '../types';

interface CondoCardProps {
  condo: Condo;
  onSelect: (condo: Condo) => void;
  isSelected: boolean;
}

const priceTierColors = {
    Modest: 'text-green-400',
    Comfort: 'text-blue-400',
    Luxury: 'text-purple-400',
    Galaxy: 'text-amber-400',
}

const CondoCard: React.FC<CondoCardProps> = ({ condo, onSelect, isSelected }) => {
  return (
    <div
      className={`bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 ease-in-out card-glow ${isSelected ? 'card-glow-selected' : 'hover:scale-105'}`}
      onClick={() => onSelect(condo)}
    >
      <div className="overflow-hidden">
        <img
          src={condo.imageUrl}
          alt={`Exterior of ${condo.name}`}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="font-orbitron text-xl font-bold text-cyan-300 truncate">
          {condo.name}
        </h3>
        <p className={`text-sm font-semibold mt-1 ${priceTierColors[condo.priceTier]}`}>
          {condo.priceTier} Class
        </p>
      </div>
    </div>
  );
};

export default CondoCard;