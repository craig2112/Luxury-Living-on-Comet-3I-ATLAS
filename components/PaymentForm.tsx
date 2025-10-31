
import React, { useState } from 'react';
import { Condo, City, MeatSuitDesign } from '../types';

interface PaymentFormProps {
  condo: Condo;
  city: City;
  meatSuit: MeatSuitDesign;
  onSubmit: () => void;
}

const condoPrices: Record<Condo['priceTier'], number> = {
    Modest: 10,
    Comfort: 25,
    Luxury: 50,
    Galaxy: 100,
};

const PaymentForm: React.FC<PaymentFormProps> = ({ condo, city, meatSuit, onSubmit }) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!walletAddress) {
            alert('Please enter your wallet address.');
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
            <form onSubmit={handleSubmit}>
                <div className="bg-stone-900/50 p-6 rounded-lg border border-stone-700 mb-6">
                    <h3 className="block text-lg text-gray-300 font-orbitron uppercase mb-4 text-center">Order Summary</h3>
                    <div className="space-y-4">
                        {/* Condo */}
                        <div className="flex justify-between items-start">
                            <p className="text-cyan-200">Condo Reservation: <span className="text-white">{condo.name}</span></p>
                            <p className="text-gray-300 font-mono whitespace-nowrap pl-4">{condoPrices[condo.priceTier]}.00 BTC</p>
                        </div>
                        {/* Meat Suit */}
                        <div>
                            <div className="flex justify-between items-start">
                                <p className="text-cyan-200">Bespoke Meat Suit:</p>
                                <p className="text-gray-300 whitespace-nowrap pl-4">Included</p>
                            </div>
                            <ul className="text-gray-400 text-sm list-disc list-inside mt-1 pl-4">
                                <li>Base: <span className="text-gray-300">{meatSuit.baseModel}</span></li>
                                <li>Skin: <span className="text-gray-300">{meatSuit.skin}</span></li>
                                <li>Eyes: <span className="text-gray-300">{meatSuit.eyes}</span></li>
                                <li>Hair: <span className="text-gray-300">{meatSuit.hair}</span></li>
                            </ul>
                        </div>
                        {/* Teleporter */}
                        <div className="flex justify-between items-start">
                            <p className="text-cyan-200">Teleporter Origin:</p>
                            <p className="text-white whitespace-nowrap pl-4">{city.name}</p>
                        </div>

                        <div className="pt-4 border-t border-stone-600"></div>
                        {/* Total */}
                        <div className="flex justify-between items-center font-bold text-xl">
                            <p className="text-cyan-100 font-orbitron">Total Deposit</p>
                            <p className="text-amber-400 font-mono">{condoPrices[condo.priceTier]}.00 BTC</p>
                        </div>
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
                            placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            required
                        />
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <button
                        type="submit"
                        disabled={isSubmitting || !walletAddress}
                        className="bg-cyan-500 border border-cyan-400 text-stone-950 font-bold py-3 px-8 rounded-lg transition-all font-orbitron text-xl enabled:hover:bg-cyan-400 enabled:hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Transmitting Deposit...' : 'Submit Deposit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;
