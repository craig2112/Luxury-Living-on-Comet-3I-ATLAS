import React, { useState, useRef, useEffect } from 'react';
import { Condo } from '../types';

interface InteractiveModalProps {
  condo: Condo;
  onClose: () => void;
  isGeneratingImage: boolean;
  onGenerateImage: (condo: Condo) => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="w-full h-full rounded-lg bg-stone-900/50 flex items-center justify-center">
    <div className="text-center">
      <svg className="animate-spin h-10 w-10 text-cyan-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4 font-orbitron text-cyan-300">downloading image through StarCast Teleporter connection...</p>
      <p className="text-sm text-gray-400 mt-1">This may take a moment.</p>
    </div>
  </div>
);

const InteractiveModal: React.FC<InteractiveModalProps> = ({ condo, onClose, isGeneratingImage, onGenerateImage }) => {
  const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isGeneratingImage) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = ((height / 2 - y) / (height / 2)) * -8; // Max rotation 8 degrees
    const rotateY = ((x - width / 2) / (width / 2)) * 8;   // Max rotation 8 degrees

    setRotation({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ rotateX: 0, rotateY: 0 });
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  // Reset rotation when image is generating to prevent weird state
  useEffect(() => {
    if (isGeneratingImage) {
      setRotation({ rotateX: 0, rotateY: 0 });
    }
  }, [isGeneratingImage]);

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-stone-900/80 border border-cyan-400/50 rounded-xl w-full max-w-4xl max-h-[90vh] grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto card-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="perspective-[1000px] w-full min-h-[300px] md:min-h-full"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {isGeneratingImage && !condo.hasGeneratedImage ? (
            <LoadingSpinner />
          ) : (
            <div 
              className="w-full h-full rounded-lg overflow-hidden transition-transform duration-200 ease-out"
              style={{ 
                transform: `rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg) scale(1.05)`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <img 
                src={condo.imageUrl} 
                alt={`Interactive render of ${condo.name}`} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col text-gray-300">
           <div className="flex justify-between items-start">
            <div>
              <h2 className="font-orbitron text-3xl font-bold text-cyan-300 text-glow">{condo.name}</h2>
              <p className="text-md text-gray-400 mt-1">{condo.hasGeneratedImage ? "AI Generated 3D Render" : "Architectural Concept"}</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors text-3xl leading-none"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
          <p className="mt-6 text-gray-300 leading-relaxed flex-grow">
            {condo.description}
          </p>
           <div className="mt-4 pt-4 border-t border-cyan-500/20 flex justify-between items-center">
            <button
              onClick={() => onGenerateImage(condo)}
              disabled={isGeneratingImage || condo.hasGeneratedImage}
              className="bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-bold py-2 px-4 rounded-lg transition-colors font-orbitron disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-cyan-500/40"
            >
              {condo.hasGeneratedImage ? 'Image Received' : isGeneratingImage ? 'Requesting...' : 'Request Image from Comet'}
            </button>
            <span className="text-lg font-semibold text-amber-400">{condo.priceTier} Class</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveModal;