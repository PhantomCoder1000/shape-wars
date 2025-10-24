
import React from 'react';
import { Position } from '../types';
import { PLAYER_WIDTH, PLAYER_HEIGHT } from '../constants';
import { PlayerIcon } from './icons';

interface PlayerProps {
    position: Position;
}

export const Player: React.FC<PlayerProps> = ({ position }) => {
    return (
        <div
            className="absolute text-cyan-400"
            style={{
                left: position.x,
                top: position.y,
                width: PLAYER_WIDTH,
                height: PLAYER_HEIGHT,
            }}
        >
          <PlayerIcon />
        </div>
    );
};
