import React from 'react';

export const PlayerIcon: React.FC = () => (
    <svg viewBox="0 0 60 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 0L60 50H0L30 0Z" />
    </svg>
);

export const ScoutIcon: React.FC = () => ( // Square
    <svg viewBox="0 0 30 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" />
    </svg>
);

export const StandardIcon: React.FC = () => ( // Pentagon
    <svg viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0L40 15L32 40H8L0 15L20 0Z" />
    </svg>
);

export const BruteIcon: React.FC = () => ( // Hexagon
    <svg viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 0L50 12.5V37.5L25 50L0 37.5V12.5L25 0Z" />
    </svg>
);


export const BossIcon: React.FC = () => (
    <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="75" cy="75" r="75" fill="#2D0138"/>
        <circle cx="75" cy="75" r="65" stroke="#E000FF" strokeWidth="4"/>
        <circle cx="75" cy="75" r="30" fill="#FF003D" className="animate-pulse"/>
        <circle cx="75" cy="75" r="50" stroke="#7B008A" strokeWidth="2" strokeDasharray="10 5"/>
    </svg>
);

export const ShieldIcon: React.FC<{ active: boolean }> = ({ active }) => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M10 0L20 4V12C20 16.4 15.6 20 10 20C4.4 20 0 16.4 0 12V4L10 0Z" 
            className={active ? 'fill-blue-500' : 'fill-gray-600'}
        />
        <path 
            d="M10 0L20 4V12C20 16.4 15.6 20 10 20C4.4 20 0 16.4 0 12V4L10 0Z" 
            stroke={active ? '#60A5FA' : '#4B5563'} 
            strokeWidth="1.5"
        />
    </svg>
);