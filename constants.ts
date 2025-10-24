import { EnemyType, PlayerUpgrades } from "./types";

export const GAME_WIDTH = 600;
export const GAME_HEIGHT = 800;

export const PLAYER_WIDTH = 60;
export const PLAYER_HEIGHT = 50;
export const PLAYER_INITIAL_Y = GAME_HEIGHT - PLAYER_HEIGHT - 20;
export const PLAYER_SMOOTHING = 0.15; // Lower is smoother

export const PROJECTILE_WIDTH = 8;
export const PROJECTILE_HEIGHT = 20;
export const PROJECTILE_SPEED = 10;
export const BASE_PROJECTILE_COOLDOWN = 220; // milliseconds

export const MISSILE_WIDTH = 24;
export const MISSILE_HEIGHT = 24;
export const MISSILE_SPEED = 8;
export const BASE_MISSILE_COOLDOWN = 2500; // milliseconds
export const BASE_MISSILE_DAMAGE = 10;
export const BASE_MISSILE_BLAST_RADIUS = 100;

export const INITIAL_LIVES = 3;
export const BASE_ARMOR = 0;
export const INITIAL_UPGRADES: PlayerUpgrades = {
  fireRate: 0,
  missileCooldown: 0,
  missilePotency: 0,
  armor: 0,
};

type EnemyStats = {
    hp: number;
    width: number;
    height: number;
    horizontalSpeed: number;
    color: string;
    currency: number;
    shootChance: number; // Probability to shoot per frame
};

export const ENEMY_TYPES: Record<EnemyType, EnemyStats> = {
  standard: { hp: 2, width: 40, height: 40, horizontalSpeed: 0.8, color: 'text-red-500', currency: 1, shootChance: 0.001 },
  brute: { hp: 5, width: 50, height: 50, horizontalSpeed: 0.4, color: 'text-purple-500', currency: 3, shootChance: 0.002 },
  scout: { hp: 1, width: 30, height: 30, horizontalSpeed: 1.2, color: 'text-green-400', currency: 2, shootChance: 0.0015 },
};

export const ENEMY_PROJECTILE_WIDTH = 8;
export const ENEMY_PROJECTILE_HEIGHT = 8;
export const ENEMY_PROJECTILE_SPEED = 3;

export const ENEMY_SPAWN_INTERVAL = 800; // Time in ms between enemy spawns
export const ENEMY_RANDOM_DIRECTION_CHANGE_CHANCE = 0.002; // Small chance to change direction each frame
export const ENEMY_SPAWN_Y = 50;


// --- CAMPAIGN MODE ---
export const CAMPAIGN_LEVELS = [
  { enemies: { standard: 10 } }, // Level 1
  { enemies: { scout: 15 } }, // Level 2, changed to scouts
  { enemies: { standard: 10, brute: 3 } }, // Level 3
  { enemies: { scout: 25 } }, // Level 4
  { enemies: { standard: 20, scout: 10, brute: 5 } }, // Level 5
  { enemies: { brute: 10 } }, // Level 6
  { enemies: { standard: 25, scout: 20 } }, // Level 7
  { enemies: { brute: 10, scout: 15 } }, // Level 8
  { enemies: { standard: 20, scout: 20, brute: 10 } }, // Level 9
  { enemies: { boss: 1 } }, // Level 10
];
export const CAMPAIGN_MAX_LEVEL = CAMPAIGN_LEVELS.length;

// --- BOSS ---
export const BOSS_STATS = {
  width: 150,
  height: 150,
  initialHp: 500,
  x: (GAME_WIDTH - 150) / 2,
  y: 50,
  bulletCooldown: 1500,
  missileCooldown: 4000,
  currency: 100,
};
export const BOSS_PROJECTILE_STATS = {
  bullet: { width: 12, height: 12, speed: 4 },
  missile: { width: 25, height: 25, speed: 2, hp: 3 },
};

// --- UPGRADES ---
type UpgradeTier = { cost: number, description: string };
export const UPGRADES: Record<keyof PlayerUpgrades, UpgradeTier[]> = {
  fireRate: [
    { cost: 15, description: "Fire Rate I" },
    { cost: 30, description: "Fire Rate II" },
    { cost: 50, description: "Fire Rate III" },
    { cost: 75, description: "Fire Rate IV" },
    { cost: 100, description: "Fire Rate V (Max)" },
  ],
  missileCooldown: [
    { cost: 20, description: "Missile Cooldown I" },
    { cost: 40, description: "Missile Cooldown II" },
    { cost: 60, description: "Missile Cooldown III" },
    { cost: 80, description: "Missile Cooldown IV (Max)" },
  ],
  missilePotency: [
    { cost: 25, description: "Missile Potency I" },
    { cost: 50, description: "Missile Potency II" },
    { cost: 75, description: "Missile Potency III (Max)" },
  ],
  armor: [
    { cost: 30, description: "Armor Plating I" },
    { cost: 50, description: "Armor Plating II" },
    { cost: 70, description: "Armor Plating III (Max)" },
  ]
};

// Functions to calculate stats based on upgrade levels
export const getProjectileCooldown = (level: number) => BASE_PROJECTILE_COOLDOWN - level * 25;
export const getMissileCooldown = (level: number) => BASE_MISSILE_COOLDOWN - level * 300;
export const getMissileDamage = (level: number) => BASE_MISSILE_DAMAGE + level * 5;
export const getMissileBlastRadius = (level: number) => BASE_MISSILE_BLAST_RADIUS + level * 20;
export const getPlayerMaxArmor = (level: number) => BASE_ARMOR + level;