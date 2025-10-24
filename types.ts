// FIX: Removed self-import of `EnemyType`, which was conflicting with the local declaration.
export interface Position {
  x: number;
  y: number;
}

export enum GameState {
  ModeSelection,
  Playing,
  Upgrades,
  GameOver,
  CampaignWon,
}

export enum GameMode {
  Campaign,
  Endless,
}

export interface PlayerUpgrades {
  fireRate: number; // level
  missileCooldown: number; // level
  missilePotency: number; // level
  armor: number; // level
}

export type EnemyType = 'standard' | 'brute' | 'scout';

// Note: The full EnemyStats type (including horizontalSpeed, shootChance, etc.) is defined in constants.ts
export interface EnemyGameObject extends Position {
  id: number;
  hp: number;
  type: EnemyType;
  vx: number; // Horizontal velocity
}

export interface ProjectileGameObject extends Position {
  id: number;
}

export interface EnemyProjectileGameObject extends Position {
  id: number;
}

export interface MissileGameObject extends Position {
  id: number;
}

export interface ExplosionGameObject extends Position {
  id: number;
}

export interface BossGameObject extends Position {
  hp: number;
  maxHp: number;
}

export type BossProjectileType = 'bullet' | 'missile';

export interface BossProjectileGameObject extends Position {
  id: number;
  type: BossProjectileType;
  hp?: number; // Only for missiles
}