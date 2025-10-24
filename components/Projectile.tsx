import React from 'react';
import { Position } from '../types';
import { PROJECTILE_WIDTH, PROJECTILE_HEIGHT } from '../constants';

interface ProjectileProps {
    position: Position;
}

export const Projectile: React.FC<ProjectileProps> = ({ position }) => {
    return (
        <div
            className="absolute text-yellow-400"
            style={{
                left: position.x,
                top: position.y,
                width: PROJECTILE_WIDTH,
                height: PROJECTILE_HEIGHT,
            }}
        >
            <svg viewBox="0 0 8 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 0L8 10L4 20L0 10L4 0Z" />
            </svg>
        </div>
    );
};