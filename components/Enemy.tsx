import React from 'react';
import { Position, EnemyType } from '../types';
import { ENEMY_TYPES } from '../constants';
import { ScoutIcon, StandardIcon, BruteIcon } from './icons';

interface EnemyProps {
    position: Position;
    type: EnemyType;
}

export const Enemy: React.FC<EnemyProps> = ({ position, type }) => {
    const stats = ENEMY_TYPES[type];

    const renderIcon = () => {
        switch(type) {
            case 'scout': return <ScoutIcon />;
            case 'standard': return <StandardIcon />;
            case 'brute': return <BruteIcon />;
            default: return null;
        }
    }

    return (
        <div
            className={`absolute ${stats.color}`}
            style={{
                left: position.x,
                top: position.y,
                width: stats.width,
                height: stats.height,
            }}
        >
          {renderIcon()}
        </div>
    );
};