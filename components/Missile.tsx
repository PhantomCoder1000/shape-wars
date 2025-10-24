import React from 'react';
import { Position } from '../types';
import { MISSILE_WIDTH, MISSILE_HEIGHT } from '../constants';

interface MissileProps {
    position: Position;
}

export const Missile: React.FC<MissileProps> = ({ position }) => {
    return (
        <div
            className="absolute text-orange-500"
            style={{
                left: position.x,
                top: position.y,
                width: MISSILE_WIDTH,
                height: MISSILE_HEIGHT,
            }}
        >
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
            </svg>
        </div>
    );
};