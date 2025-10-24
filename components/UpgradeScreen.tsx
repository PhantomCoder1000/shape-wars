import React from 'react';
import { PlayerUpgrades } from '../types';
import { UPGRADES } from '../constants';

interface UpgradeScreenProps {
    currency: number;
    upgrades: PlayerUpgrades;
    onPurchase: (upgradeKey: keyof PlayerUpgrades) => void;
    onContinue: () => void;
    setCurrency: React.Dispatch<React.SetStateAction<number>>;
}

export const UpgradeScreen: React.FC<UpgradeScreenProps> = ({ currency, upgrades, onPurchase, onContinue, setCurrency }) => {
    
    const handlePurchase = (upgradeKey: keyof PlayerUpgrades) => {
        const currentLevel = upgrades[upgradeKey];
        const upgradeTiers = UPGRADES[upgradeKey];
        if (currentLevel < upgradeTiers.length) {
            const cost = upgradeTiers[currentLevel].cost;
            if (currency >= cost) {
                setCurrency(prev => prev - cost);
                onPurchase(upgradeKey);
            }
        }
    };
    
    const renderUpgradeOption = (upgradeKey: keyof PlayerUpgrades, title: string, color: string) => {
        const currentLevel = upgrades[upgradeKey];
        const upgradeTiers = UPGRADES[upgradeKey];
        const isMaxLevel = currentLevel >= upgradeTiers.length;
        const cost = isMaxLevel ? 0 : upgradeTiers[currentLevel].cost;
        const canAfford = currency >= cost;

        return (
            <div className="bg-gray-800/80 p-4 rounded-lg border-2 border-gray-600 w-full flex flex-col">
                <h4 className={`text-2xl font-bold ${color}`}>{title}</h4>
                <p className="text-gray-300 mb-2 flex-grow">
                    {isMaxLevel ? upgradeTiers[currentLevel-1].description : upgradeTiers[currentLevel].description}
                </p>
                 <div className="h-6 w-full bg-gray-700 rounded-full mb-3 overflow-hidden border border-gray-500">
                    <div className={`h-full ${color.replace('text', 'bg').replace('-400', '-500')}`} style={{ width: `${(currentLevel / upgradeTiers.length) * 100}%` }} />
                </div>
                <button
                    onClick={() => handlePurchase(upgradeKey)}
                    disabled={isMaxLevel || !canAfford}
                    className={`w-full px-4 py-2 text-xl font-bold uppercase transition-all duration-200 rounded
                                ${isMaxLevel ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : ''}
                                ${!isMaxLevel && canAfford ? `${color.replace('text', 'bg')} text-black hover:brightness-125` : ''}
                                ${!isMaxLevel && !canAfford ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : ''}
                                `}
                >
                    {isMaxLevel ? 'Max Level' : `Upgrade ($${cost})`}
                </button>
            </div>
        );
    }
    
    return (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center z-20 p-4 backdrop-blur-sm">
            <h2 className="text-5xl font-bold text-cyan-300 mb-2">Upgrades Available</h2>
            <p className="text-2xl text-yellow-400 font-bold mb-6">Currency: ${currency}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full mb-8">
               {renderUpgradeOption('fireRate', 'Fire Rate', 'text-yellow-400')}
               {renderUpgradeOption('missileCooldown', 'Missile System', 'text-orange-400')}
               {renderUpgradeOption('missilePotency', 'Missile Potency', 'text-red-500')}
               {renderUpgradeOption('armor', 'Armor Plating', 'text-blue-400')}
            </div>

            <button
                onClick={onContinue}
                className="px-10 py-4 border-2 border-cyan-400 text-cyan-400 text-2xl font-bold uppercase tracking-widest
                           hover:bg-cyan-400 hover:text-black transition-all duration-300
                           shadow-[0_0_15px_theme(colors.cyan.400)] hover:shadow-[0_0_25px_theme(colors.cyan.400)]"
            >
                Continue
            </button>
        </div>
    );
};