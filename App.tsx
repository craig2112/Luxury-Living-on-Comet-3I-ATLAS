import React, { useState, useCallback, useEffect } from 'react';
import { Condo, City } from './types';
import CondoCard from './components/CondoCard';
import InteractiveModal from './components/InteractiveModal';
import { StarField } from './components/StarField';
import { GoogleGenAI, Modality } from '@google/genai';
import TeleporterMap from './components/TeleporterMap';
import { TeleporterIcon } from './components/TeleporterIcon';
import PaymentForm from './components/PaymentForm';

const initialCondos: Condo[] = [
  {
    id: 1,
    name: 'Stardust Spire',
    priceTier: 'Modest',
    description: 'An efficient and compact living space carved from pure comet ice. The Spire offers panoramic views of the cosmos through a reinforced crystalline window. Ideal for the solo astronomer or the minimalist pioneer.',
    imageUrl: 'https://dq0hsqwjhea1.cloudfront.net/3I-ATLAS-Gemini-North-Aug-27-2025-S.webp',
    hasGeneratedImage: false,
  },
  {
    id: 2,
    name: 'Meteorite Manor',
    priceTier: 'Comfort',
    description: 'A spacious, family-oriented dwelling integrated with rare iron-nickel alloys from the comet\'s core. Features bio-luminescent gardens and a zero-gravity recreation room, providing comfort and style amidst the stars.',
    imageUrl: 'https://dq0hsqwjhea1.cloudfront.net/3I-ATLAS-Sept-17-2025-Jaeger-Rhemann.webp',
    hasGeneratedImage: false,
  },
  {
    id: 3,
    name: 'Nebula Nexus',
    priceTier: 'Luxury',
    description: 'A high-end residence boasting state-of-the-art atmospheric controls and customizable holographic interiors. The Nexus is a hub of elegance, featuring a private docking bay and observatory-grade telescopic arrays.',
    imageUrl: 'https://dq0hsqwjhea1.cloudfront.net/Comet-Lemmon-150mm-lens-35-second-exp-Oct-26-2025-A-ST.webp',
    hasGeneratedImage: false,
  },
  {
    id: 4,
    name: 'Galactic Grandeur',
    priceTier: 'Galaxy',
    description: 'The pinnacle of celestial living. This palatial estate is powered by a miniature captured star, featuring self-sustaining ecosystems across multiple biomes, a quantum teleportation pad, and unparalleled luxury. For those who command the cosmos.',
    imageUrl: 'https://dq0hsqwjhea1.cloudfront.net/Comet-Lemmon-panel-Oct-26-27-2025-Seestar-ST-2.webp',
    hasGeneratedImage: false,
  },
];

const App: React.FC = () => {
  const [condos, setCondos] = useState<Condo[]>(initialCondos);
  const [selectedCondo, setSelectedCondo] = useState<Condo | null>(null);
  const [selectedForPurchase, setSelectedForPurchase] = useState<Condo | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState<'condos' | 'map'>('condos');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-01-01T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectCondo = (condo: Condo) => {
    setSelectedCondo(condo);
    setSelectedForPurchase(condo);
  };

  const handleGenerateImage = async (condo: Condo) => {
    if (!condo || condo.hasGeneratedImage) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Futuristic architectural render of "${condo.name}", a ${condo.priceTier.toLowerCase()} class condo on a comet. ${condo.description}. The style should be sleek, cosmic, and awe-inspiring. High resolution, photorealistic.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${base64ImageBytes}`;

          const updatedCondos = condos.map((c) =>
            c.id === condo.id ? { ...c, imageUrl, hasGeneratedImage: true } : c
          );
          setCondos(updatedCondos);
          const updatedSelectedCondo = updatedCondos.find(c => c.id === condo.id) || null;
          setSelectedCondo(updatedSelectedCondo);
          if (selectedForPurchase?.id === condo.id) {
            setSelectedForPurchase(updatedSelectedCondo);
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handlePaymentSubmit = () => {
    setPaymentSubmitted(true);
  };

  const handleCloseModal = () => {
    setSelectedCondo(null);
    setIsGenerating(false);
  };

  const handleCitySelect = useCallback((city: City) => {
    setSelectedCity(city);
    setView('condos');
  }, []);

  const handleBackFromMap = useCallback(() => {
    setView('condos');
  }, []);

  if (view === 'map') {
    return <TeleporterMap onBack={handleBackFromMap} onCitySelect={handleCitySelect} />;
  }

  return (
    <div className="relative min-h-screen bg-stone-950 text-gray-200 overflow-hidden">
      <StarField />
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-cyan-400 text-glow">
            Luxury Living on Comet 3I/ATLAS
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-400">
            Your consciousness lives on forever through space in glorious luxury!
          </p>
        </header>

        <div className="text-center mb-12">
            <p className="text-lg text-gray-400 font-orbitron uppercase tracking-widest">Consciousness Transfer In:</p>
            <div className="flex justify-center items-center gap-4 md:gap-8 mt-4 text-cyan-300 text-glow">
                <div className="text-center">
                    <span className="font-orbitron text-4xl md:text-6xl font-bold">{String(timeLeft.days).padStart(3, '0')}</span>
                    <span className="block text-sm text-gray-500 uppercase">Days</span>
                </div>
                <div className="text-4xl md:text-6xl font-orbitron">:</div>
                <div className="text-center">
                    <span className="font-orbitron text-4xl md:text-6xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="block text-sm text-gray-500 uppercase">Hours</span>
                </div>
                <div className="text-4xl md:text-6xl font-orbitron">:</div>
                <div className="text-center">
                    <span className="font-orbitron text-4xl md:text-6xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="block text-sm text-gray-500 uppercase">Minutes</span>
                </div>
                <div className="text-4xl md:text-6xl font-orbitron">:</div>
                <div className="text-center">
                    <span className="font-orbitron text-4xl md:text-6xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="block text-sm text-gray-500 uppercase">Seconds</span>
                </div>
            </div>
        </div>

        <main>
          <div className="text-center mb-8">
            <h2 className="font-orbitron text-2xl text-cyan-300 text-glow">Choose your space below now!</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {condos.map((condo) => (
              <CondoCard
                key={condo.id}
                condo={condo}
                onSelect={handleSelectCondo}
                isSelected={selectedForPurchase?.id === condo.id}
              />
            ))}
          </div>
        </main>
        
        <footer className="text-center mt-16 py-8 border-t border-cyan-500/20">
            {selectedCity && (
              <div className="font-orbitron mb-4">
                <p className="text-lg text-gray-400">Chosen Teleporter Location:</p>
                <p className="text-2xl text-cyan-300 text-glow">{selectedCity.name}</p>
              </div>
            )}
            <h2 className="text-lg text-gray-400 mb-4">
              {selectedCity ? 'Select a different location or proceed:' : 'Click here to find the location of the nearest StarCast Teleporter.'}
            </h2>
            <button 
              onClick={() => setView('map')}
              className="group"
              aria-label="Find nearest StarCast Teleporter"
            >
              <TeleporterIcon />
            </button>
        </footer>
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-16">
        {!paymentSubmitted ? (
           <PaymentForm 
             condo={selectedForPurchase} 
             city={selectedCity}
             onSubmit={handlePaymentSubmit}
           />
         ) : (
          <div className="text-center max-w-4xl mx-auto p-8 bg-green-900/40 border border-green-500 rounded-lg card-glow">
            <p className="text-2xl font-orbitron text-green-300 text-glow">Payment received!</p>
            <p className="mt-2 text-gray-300">Before the Consciousness Transfer Date, you will be provided detailed instructions on the process!</p>
          </div>
        )}
      </div>
      
      {selectedCondo && (
        <InteractiveModal 
          condo={selectedCondo} 
          onClose={handleCloseModal} 
          isGeneratingImage={isGenerating}
          onGenerateImage={handleGenerateImage}
        />
      )}
    </div>
  );
};

export default App;
