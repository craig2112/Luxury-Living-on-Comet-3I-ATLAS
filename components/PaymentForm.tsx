import React, { useState } from 'react';
import { Condo, City } from '../types';

interface PaymentFormProps {
  condo: Condo | null;
  city: City | null;
  onSubmit: () => void;
}

const condoPrices: Record<Condo['priceTier'], number> = {
    Modest: 10,
    Comfort: 25,
    Luxury: 50,
    Galaxy: 100,
};

const PaymentForm: React.FC<PaymentFormProps> = ({ condo, city, onSubmit }) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEnabled = !!condo && !!city;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEnabled || !walletAddress || !email) {
            return;
        }
        setIsSubmitting(true);
        // Simulate network request
        setTimeout(() => {
            onSubmit();
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8 card-glow">
            <h2 className="font-orbitron text-3xl text-cyan-300 text-glow text-center mb-6">Finalize Consciousness Transfer</h2>
            
            {!isEnabled && (
                 <p className="text-center text-amber-400 font-orbitron mb-6 -mt-2">Select a condo and a teleporter location to proceed.</p>
            )}

            <form onSubmit={handleSubmit}>
                <fieldset disabled={!isEnabled} className="transition-opacity duration-300 disabled:opacity-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-lg">
                        <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-700">
                            <label className="block text-sm text-gray-400 font-orbitron uppercase">Selected Space</label>
                            <p className="text-cyan-200 min-h-[28px]">{condo?.name ?? '...'}</p>
                        </div>
                        <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-700">
                            <label className="block text-sm text-gray-400 font-orbitron uppercase">Teleporter Location</label>
                            <p className="text-cyan-200 min-h-[28px]">{city?.name ?? '...'}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-400 font-orbitron">Price</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    name="price"
                                    id="price"
                                    className="block w-full bg-stone-800 border-stone-600 rounded-md p-2 text-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                                    value={condo ? `${condoPrices[condo.priceTier]} BTC` : '...'}
                                    disabled
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="wallet" className="block text-sm font-medium text-gray-400 font-orbitron">Your Bitcoin Wallet Address</label>
                             <div className="mt-1">
                                <input
                                    type="text"
                                    name="wallet"
                                    id="wallet"
                                    className="block w-full bg-stone-800 border-stone-600 rounded-md p-2 text-gray-300 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                                    placeholder={isEnabled ? "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" : "Selections required"}
                                    value={walletAddress}
                                    onChange={(e) => setWalletAddress(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 font-orbitron">Your Email Address</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="block w-full bg-stone-800 border-stone-600 rounded-md p-2 text-gray-300 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                                    placeholder={isEnabled ? "you@domain.com" : "Selections required"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <button
                            type="submit"
                            disabled={isSubmitting || !walletAddress || !email}
                            className="bg-cyan-500 border border-cyan-400 text-stone-950 font-bold py-3 px-8 rounded-lg transition-all font-orbitron text-xl enabled:hover:bg-cyan-400 enabled:hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Transmitting...' : 'Submit Payment'}
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default PaymentForm;