import React from 'react';
import { Position } from '../types';

interface ExplosionProps {
    position: Position;
    blastRadius: number;
}

export const Explosion: React.FC<ExplosionProps> = ({ position, blastRadius }) => {
    return (
        <div
            className="absolute bg-yellow-400/50 rounded-full animate-ping"
            style={{
                left: position.x - blastRadius,
                top: position.y - blastRadius,
                width: blastRadius * 2,
                height: blastRadius * 2,
                animationDuration: '0.5s',
            }}
        />
    );
};