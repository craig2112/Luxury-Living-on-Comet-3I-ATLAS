
import React, { useState } from 'react';
import { MeatSuitDesign } from '../types';
import { StarField } from './StarField';
import { GoogleGenAI, Modality } from '@google/genai';

interface MeatSuitDesignerProps {
  onFinalize: (design: MeatSuitDesign) => void;
}

const baseModelOptions = ['a sleek, futuristic build', 'a muscular, powerful build', 'an androgynous, slender build', 'an enhanced, cybernetic build'];
const skinOptions = ['natural terran fleshtone skin', 'bioluminescent blue skin', 'metallic silver skin', 'matte carbon black skin'];
const eyeOptions = ['normal human blue eyes', 'glowing starlight gold eyes', 'cybernetic red eyes', 'deep galactic purple eyes'];
const hairOptions = ['long, flowing hair as if in zero-g', 'a chrome dome (bald)', 'a bright neon mohawk', 'a classic, simple haircut'];


interface CustomRadioProps {
    label: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (val: string) => void;
}

const CustomRadio: React.FC<CustomRadioProps> = ({ label, name, value, checked, onChange }) => (
    <label className={`block w-full text-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${checked ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200' : 'bg-stone-800/50 border-stone-700 text-gray-400 hover:border-cyan-600'}`}>
        <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="hidden" />
        <span className="font-orbitron tracking-wide text-sm">{label.split(' ')[0]} {label.split(' ')[1]}</span>
    </label>
);

const LoadingSpinner: React.FC = () => (
    <div className="w-full h-full rounded-lg bg-stone-900/50 flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin h-10 w-10 text-cyan-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 font-orbitron text-cyan-300">Fabricating new vessel...</p>
        <p className="text-sm text-gray-400 mt-1">This may take a few moments.</p>
      </div>
    </div>
  );

const MeatSuitDesigner: React.FC<MeatSuitDesignerProps> = ({ onFinalize }) => {
    const [design, setDesign] = useState<MeatSuitDesign>({
        baseModel: baseModelOptions[0],
        skin: skinOptions[0],
        eyes: eyeOptions[0],
        hair: hairOptions[0],
    });
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
                setGeneratedImage(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const buildPrompt = () => {
        return `Modify the person in this image to have ${design.baseModel}. Change their skin to be ${design.skin}. Make their eyes ${design.eyes}. Finally, give them ${design.hair}. Maintain the original photo's composition, background, and the person's facial structure as much as possible. The modifications should look photorealistic.`;
    };

    const handleGenerate = async () => {
        if (!uploadedImage) return;

        setIsGenerating(true);
        setGeneratedImage(null);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const mimeType = uploadedImage.split(';')[0].split(':')[1];
            const base64Data = uploadedImage.split(',')[1];
            
            const imagePart = { inlineData: { data: base64Data, mimeType } };
            const textPart = { text: buildPrompt() };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [imagePart, textPart] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                  const base64ImageBytes: string = part.inlineData.data;
                  const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                  setGeneratedImage(imageUrl);
                  break;
                }
            }
            if (!response.candidates[0].content.parts.some(p => p.inlineData)) {
                setError('The model did not return an image. Please try adjusting your selections.');
            }

        } catch (e) {
            console.error(e);
            setError('An error occurred during image generation. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFinalize = () => {
        setIsFinalizing(true);
        setTimeout(() => {
            onFinalize(design);
            setIsFinalizing(false);
        }, 1500);
    };
    
    return (
        <div className="fixed inset-0 bg-stone-950 z-50 overflow-y-auto">
            <StarField />
            <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 text-gray-200">
                <header className="text-center mb-10">
                    <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-cyan-400 text-glow">
                        Design Your Bespoke Meat Suit
                    </h1>
                    <p className="mt-4 text-lg text-gray-400">
                        Upload your photo, then modify your vessel for its new existence.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {/* Preview Pane */}
                    <div className="flex items-center justify-center w-full h-full bg-stone-900/50 rounded-lg border border-stone-700 min-h-[400px] p-4">
                       {!uploadedImage ? (
                            <div className="text-center">
                                <label htmlFor="image-upload" className="font-orbitron text-xl text-cyan-300 cursor-pointer hover:text-cyan-100 transition-colors">
                                    Upload Your Photo
                                </label>
                                <p className="text-sm text-gray-400 mt-2">to begin the fabrication process</p>
                                <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </div>
                       ) : isGenerating ? (
                            <LoadingSpinner />
                       ) : (
                            <img 
                                src={generatedImage || uploadedImage} 
                                alt={generatedImage ? "Generated Avatar" : "Uploaded photo"}
                                className="max-w-full max-h-[500px] object-contain rounded-md"
                            />
                       )}
                    </div>

                    {/* Controls Pane */}
                    <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 space-y-6 card-glow">
                        <div>
                            <h3 className="font-orbitron text-xl text-cyan-300 mb-3">Base Model</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {baseModelOptions.map(model => <CustomRadio key={model} label={model} name="baseModel" value={model} checked={design.baseModel === model} onChange={(val) => setDesign(d => ({ ...d, baseModel: val }))} />)}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-orbitron text-xl text-cyan-300 mb-3">Integument (Skin)</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {skinOptions.map(opt => <CustomRadio key={opt} label={opt} name="skin" value={opt} checked={design.skin === opt} onChange={(val) => setDesign(d => ({...d, skin: val}))} />)}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-orbitron text-xl text-cyan-300 mb-3">Ocular System</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {eyeOptions.map(opt => <CustomRadio key={opt} label={opt} name="eyes" value={opt} checked={design.eyes === opt} onChange={(val) => setDesign(d => ({...d, eyes: val}))} />)}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-orbitron text-xl text-cyan-300 mb-3">Cranial Foliage</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {hairOptions.map(opt => <CustomRadio key={opt} label={opt} name="hair" value={opt} checked={design.hair === opt} onChange={(val) => setDesign(d => ({...d, hair: val}))} />)}
                            </div>
                        </div>
                         <div className="pt-4 border-t border-cyan-500/20 text-center">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !uploadedImage}
                                className="bg-fuchsia-600 border border-fuchsia-500 text-white font-bold py-3 px-8 rounded-lg transition-all font-orbitron text-lg enabled:hover:bg-fuchsia-500 enabled:hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? 'Generating...' : 'Generate Avatar'}
                            </button>
                            {error && <p className="text-red-400 mt-4">{error}</p>}
                        </div>
                    </div>
                </div>
                 <div className="mt-10 text-center">
                    <button
                        onClick={handleFinalize}
                        disabled={isFinalizing || !generatedImage}
                        className="bg-cyan-500 border border-cyan-400 text-stone-950 font-bold py-3 px-12 rounded-lg transition-all font-orbitron text-xl enabled:hover:bg-cyan-400 enabled:hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isFinalizing ? 'Registering Design...' : 'Finalize Design'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MeatSuitDesigner;
