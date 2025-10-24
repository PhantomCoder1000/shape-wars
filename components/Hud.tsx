import React from 'react';
import { GAME_WIDTH } from '../constants';
import { PlayerIcon, ShieldIcon } from './icons';

interface HudProps {
    score: number;
    lives: number;
    currency: number;
    level: string;
    armor: number;
    maxArmor: number;
}

export const Hud: React.FC<HudProps> = ({ score, lives, currency, level, armor, maxArmor }) => {
    return (
        <div 
            className="grid grid-cols-4 gap-4 items-center mt-4 p-2 border-2 border-cyan-400/50 rounded-lg text-cyan-300 text-lg font-bold"
            style={{ width: GAME_WIDTH }}
        >
            <div className="col-span-1">
                SCORE: <span className="text-white tabular-nums">{score.toString().padStart(6, '0')}</span>
            </div>
            <div className="col-span-2 text-center">
                <span>{level}</span>
                <span className="mx-4">|</span>
                <span>CURRENCY: <span className="text-yellow-400 tabular-nums">${currency.toString().padStart(4, '0')}</span></span>
            </div>
            <div className="col-span-1 flex justify-end items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: maxArmor }).map((_, index) => (
                      <div key={index} className="w-5 h-5">
                          <ShieldIcon active={index < armor} />
                      </div>
                  ))}
                </div>
                <div className="flex items-center space-x-1">
                    {Array.from({ length: lives }).map((_, index) => (
                        <div key={index} className="w-5 h-5 text-cyan-400">
                            <PlayerIcon />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};