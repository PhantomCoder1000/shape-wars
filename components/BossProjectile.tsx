import React from 'react';
import { BossProjectileGameObject } from '../types';
import { BOSS_PROJECTILE_STATS } from '../constants';

interface BossProjectileProps {
    projectile: BossProjectileGameObject;
}

export const BossProjectile: React.FC<BossProjectileProps> = ({ projectile }) => {
    const isBullet = projectile.type === 'bullet';
    const stats = BOSS_PROJECTILE_STATS[projectile.type];
    
    const renderShape = () => {
        if (isBullet) { // Circle
            return (
                <svg viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="6" />
                </svg>
            )
        } else { // Octagon
            return (
                <svg viewBox="0 0 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                     <path d="M9.513 0L15.487 0L25 9.513L25 15.487L15.487 25L9.513 25L0 15.487L0 9.513Z"/>
                </svg>
            )
        }
    }

    const style = isBullet 
        ? "text-red-500" 
        : "text-purple-500";

    return (
        <div
            className={`absolute ${style}`}
            style={{
                left: projectile.x,
                top: projectile.y,
                width: stats.width,
                height: stats.height,
            }}
        >
            {renderShape()}
        </div>
    );
};