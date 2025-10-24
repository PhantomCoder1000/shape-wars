import React from 'react';
import { GameMode } from '../types';

interface LevelIndicatorProps {
    level: number;
    wave: number;
    mode: GameMode | null;
}

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({ level, wave, mode }) => {
    const text = mode === GameMode.Campaign ? `Level ${level}` : `Wave ${wave}`;

    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30 pointer-events-none">
            <h2 className="text-7xl font-bold text-cyan-300 animate-pulse">
                {text}
            </h2>
        </div>
    );
};
