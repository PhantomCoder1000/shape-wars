import React from 'react';
import { GameMode } from '../types';

interface ModeSelectionScreenProps {
    onModeSelect: (mode: GameMode) => void;
}

export const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onModeSelect }) => {
    return (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center z-10 p-4">
            <h2 className="text-5xl font-bold text-cyan-300 mb-10 animate-pulse">Choose Your Fate</h2>
            <div className="flex space-x-8">
                <button
                    onClick={() => onModeSelect(GameMode.Campaign)}
                    className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 text-2xl font-bold uppercase tracking-widest
                               hover:bg-cyan-400 hover:text-black transition-all duration-300
                               shadow-[0_0_15px_theme(colors.cyan.400)] hover:shadow-[0_0_25px_theme(colors.cyan.400)]"
                >
                    Campaign
                </button>
                <button
                    onClick={() => onModeSelect(GameMode.Endless)}
                    className="px-8 py-4 border-2 border-orange-400 text-orange-400 text-2xl font-bold uppercase tracking-widest
                               hover:bg-orange-400 hover:text-black transition-all duration-300
                               shadow-[0_0_15px_theme(colors.orange.400)] hover:shadow-[0_0_25px_theme(colors.orange.400)]"
                >
                    Endless
                </button>
            </div>
             <div className="max-w-xl text-lg text-gray-300 mt-12 space-y-4">
              <p><span className="font-bold text-cyan-400">Campaign:</span> Battle through 10 challenging levels and face the ultimate boss.</p>
              <p><span className="font-bold text-orange-400">Endless:</span> Survive against infinite waves of increasingly difficult enemies.</p>
            </div>
        </div>
    );
};