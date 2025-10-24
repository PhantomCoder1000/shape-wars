import React from 'react';

interface GameOverScreenProps {
    score: number;
    onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
    return (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center z-10 p-4">
            <h2 className="text-6xl font-bold text-red-500 mb-4">Game Over</h2>
            <p className="text-2xl text-gray-300 mb-2">Your Final Score:</p>
            <p className="text-5xl font-bold text-cyan-400 mb-8">{score}</p>
            <button
                onClick={onRestart}
                className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 text-2xl font-bold uppercase tracking-widest
                           hover:bg-cyan-400 hover:text-black transition-all duration-300
                           shadow-[0_0_15px_theme(colors.cyan.400)] hover:shadow-[0_0_25px_theme(colors.cyan.400)]"
            >
                Return to Menu
            </button>
        </div>
    );
};