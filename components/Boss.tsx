import React from 'react';
import { BossGameObject } from '../types';
import { BOSS_STATS } from '../constants';
import { BossIcon } from './icons';

interface BossProps {
    boss: BossGameObject;
}

export const Boss: React.FC<BossProps> = ({ boss }) => {
    const healthPercentage = (boss.hp / boss.maxHp) * 100;

    return (
        <div
            className="absolute text-purple-500"
            style={{
                left: boss.x,
                top: boss.y,
                width: BOSS_STATS.width,
                height: BOSS_STATS.height,
            }}
        >
            <BossIcon />
            {/* Health Bar */}
            <div className="absolute -top-6 left-0 w-full h-4 bg-gray-700 border-2 border-purple-400 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-red-500 transition-all duration-300" 
                    style={{ width: `${healthPercentage}%`}}
                />
            </div>
        </div>
    );
};