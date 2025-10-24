import React from 'react';
import { Position } from '../types';
import { ENEMY_PROJECTILE_WIDTH, ENEMY_PROJECTILE_HEIGHT } from '../constants';

interface EnemyProjectileProps {
    position: Position;
}

export const EnemyProjectile: React.FC<EnemyProjectileProps> = ({ position }) => {
    return (
        <div
            className="absolute text-pink-500"
            style={{
                left: position.x,
                top: position.y,
                width: ENEMY_PROJECTILE_WIDTH,
                height: ENEMY_PROJECTILE_HEIGHT,
            }}
        >
            <svg viewBox="0 0 8 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <rect width="8" height="8" />
            </svg>
        </div>
    );
};