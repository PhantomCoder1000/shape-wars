import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player } from './components/Player';
import { Enemy } from './components/Enemy';
import { Projectile } from './components/Projectile';
import { EnemyProjectile } from './components/EnemyProjectile';
import { Missile } from './components/Missile';
import { Explosion } from './components/Explosion';
import { Hud } from './components/Hud';
import { ModeSelectionScreen } from './components/ModeSelectionScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { UpgradeScreen } from './components/UpgradeScreen';
import { Boss } from './components/Boss';
import { BossProjectile } from './components/BossProjectile';
import { CampaignWonScreen } from './components/CampaignWonScreen';
import { LevelIndicator } from './components/LevelIndicator';
import { GameState, GameMode, Position, EnemyGameObject, EnemyType, MissileGameObject, ExplosionGameObject, ProjectileGameObject, PlayerUpgrades, BossGameObject, BossProjectileGameObject, EnemyProjectileGameObject } from './types';
import { 
    GAME_WIDTH, GAME_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_INITIAL_Y, 
    PROJECTILE_SPEED, PROJECTILE_WIDTH, PROJECTILE_HEIGHT,
    MISSILE_SPEED, MISSILE_WIDTH, MISSILE_HEIGHT,
    INITIAL_LIVES, PLAYER_SMOOTHING, ENEMY_TYPES, INITIAL_UPGRADES,
    CAMPAIGN_LEVELS, BOSS_STATS, BOSS_PROJECTILE_STATS,
    ENEMY_PROJECTILE_SPEED, ENEMY_PROJECTILE_WIDTH, ENEMY_PROJECTILE_HEIGHT,
    ENEMY_SPAWN_Y, ENEMY_SPAWN_INTERVAL, ENEMY_RANDOM_DIRECTION_CHANGE_CHANCE,
    getProjectileCooldown, getMissileCooldown, getMissileDamage, getMissileBlastRadius, getPlayerMaxArmor
} from './constants';

const App: React.FC = () => {
    // Game State
    const [gameState, setGameState] = useState<GameState>(GameState.ModeSelection);
    const [gameMode, setGameMode] = useState<GameMode | null>(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(INITIAL_LIVES);
    const [armor, setArmor] = useState(getPlayerMaxArmor(INITIAL_UPGRADES.armor));
    const [currency, setCurrency] = useState(0);
    const [currentLevel, setCurrentLevel] = useState(1); // Campaign
    const [currentWave, setCurrentWave] = useState(1); // Endless
    const [upgrades, setUpgrades] = useState<PlayerUpgrades>(INITIAL_UPGRADES);
    const [showLevelIndicator, setShowLevelIndicator] = useState(false);

    // Game Objects
    const [playerPosition, setPlayerPosition] = useState<Position>({ x: (GAME_WIDTH - PLAYER_WIDTH) / 2, y: PLAYER_INITIAL_Y });
    const [projectiles, setProjectiles] = useState<ProjectileGameObject[]>([]);
    const [missiles, setMissiles] = useState<MissileGameObject[]>([]);
    const [enemies, setEnemies] = useState<EnemyGameObject[]>([]);
    const [enemyProjectiles, setEnemyProjectiles] = useState<EnemyProjectileGameObject[]>([]);
    const [explosions, setExplosions] = useState<ExplosionGameObject[]>([]);
    const [boss, setBoss] = useState<BossGameObject | null>(null);
    const [bossProjectiles, setBossProjectiles] = useState<BossProjectileGameObject[]>([]);
    const [spawnQueue, setSpawnQueue] = useState<EnemyType[]>([]);
    
    // Timers & Refs
    const mousePosition = useRef({ x: GAME_WIDTH / 2 });
    const mouseDown = useRef(false);
    const lastShotTime = useRef(0);
    const lastMissileShotTime = useRef(0);
    const lastSpawnTime = useRef(0);
    const bossTimers = useRef({ bullet: 0, missile: 0 });
    const gameLoopRef = useRef<number>();
    const gameAreaRef = useRef<HTMLDivElement>(null);

    // --- Game Flow & State Management ---
    
    const resetGame = useCallback((mode: GameMode) => {
        setScore(0);
        setLives(INITIAL_LIVES);
        setCurrency(0);
        setCurrentLevel(1);
        setCurrentWave(1);
        setUpgrades(INITIAL_UPGRADES);
        setGameMode(mode);
        setArmor(getPlayerMaxArmor(INITIAL_UPGRADES.armor));
        
        const initialPlayerX = (GAME_WIDTH - PLAYER_WIDTH) / 2;
        setPlayerPosition({ x: initialPlayerX, y: PLAYER_INITIAL_Y });
        setProjectiles([]);
        setMissiles([]);
        setEnemies([]);
        setEnemyProjectiles([]);
        setExplosions([]);
        setBoss(null);
        setBossProjectiles([]);

        mousePosition.current = { x: initialPlayerX + PLAYER_WIDTH / 2 };
        mouseDown.current = false;
        lastShotTime.current = 0;
        lastMissileShotTime.current = 0;
        lastSpawnTime.current = 0;
        bossTimers.current = { bullet: 0, missile: 0 };

        prepareLevel(1, mode);
        setGameState(GameState.Playing);
    }, []);

    const prepareLevel = (levelOrWave: number, mode: GameMode | null) => {
        setShowLevelIndicator(true);
        setTimeout(() => setShowLevelIndicator(false), 2000);
        
        setEnemies([]);
        setBoss(null);
        
        let spawnList: EnemyType[] = [];
        if (mode === GameMode.Campaign) {
            const levelData = CAMPAIGN_LEVELS[levelOrWave - 1];
            if (levelData.enemies.boss) {
                setBoss({ x: BOSS_STATS.x, y: BOSS_STATS.y, hp: BOSS_STATS.initialHp, maxHp: BOSS_STATS.initialHp });
            } else {
                for (const [type, count] of Object.entries(levelData.enemies)) {
                    for (let i = 0; i < count; i++) {
                        spawnList.push(type as EnemyType);
                    }
                }
            }
        } else if (mode === GameMode.Endless) {
            const waveSize = 10 + levelOrWave * 3;
            const enemyPool: EnemyType[] = ['standard', 'scout'];
            if (levelOrWave > 2) enemyPool.push('brute');
            if (levelOrWave > 5) enemyPool.push('brute');

            for (let i = 0; i < waveSize; i++) {
                const type = enemyPool[Math.floor(Math.random() * enemyPool.length)];
                spawnList.push(type);
            }
        }
        setSpawnQueue(spawnList);
    };

    const handleModeSelect = (mode: GameMode) => {
        resetGame(mode);
    };

    const handleRestart = () => {
        setGameState(GameState.ModeSelection);
    };

    const handlePurchaseUpgrade = (upgradeKey: keyof PlayerUpgrades) => {
        const newUpgrades = {...upgrades, [upgradeKey]: upgrades[upgradeKey] + 1};
        setUpgrades(newUpgrades);

        if (upgradeKey === 'armor') {
            const newMaxArmor = getPlayerMaxArmor(newUpgrades.armor);
            setArmor(newMaxArmor);
        }
    };

    const continueToNext = () => {
        if (gameMode === GameMode.Campaign) {
            const nextLevel = currentLevel + 1;
            setCurrentLevel(nextLevel);
            prepareLevel(nextLevel, gameMode);
        } else {
            const nextWave = currentWave + 1;
            setCurrentWave(nextWave);
            prepareLevel(nextWave, gameMode);
        }
        setGameState(GameState.Playing);
    };

    // --- Input Handlers ---
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!gameAreaRef.current) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        mousePosition.current.x = e.clientX - rect.left;
    };
    
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => { if (e.button === 0) mouseDown.current = true; };
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => { if (e.button === 0) mouseDown.current = false; };
    
    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const now = Date.now();
        if (now - lastMissileShotTime.current > getMissileCooldown(upgrades.missileCooldown)) {
            lastMissileShotTime.current = now;
            setMissiles(prev => [...prev, {
                id: now,
                x: playerPosition.x + PLAYER_WIDTH / 2 - MISSILE_WIDTH / 2,
                y: playerPosition.y
            }]);
        }
    };

    // --- Core Game Loop ---
    const gameLoop = useCallback(() => {
        if (gameState !== GameState.Playing) return;
        
        const now = Date.now();
        let scoreToAdd = 0;
        let currencyToAdd = 0;
        let wasPlayerHit = false;

        // Player Movement
        let targetX = mousePosition.current.x - PLAYER_WIDTH / 2;
        targetX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_WIDTH, targetX));
        const nextPlayerX = playerPosition.x + (targetX - playerPosition.x) * PLAYER_SMOOTHING;

        // Player Firing
        let nextProjectiles = projectiles.map(p => ({ ...p, y: p.y - PROJECTILE_SPEED }));
        if (mouseDown.current) {
            if (now - lastShotTime.current > getProjectileCooldown(upgrades.fireRate)) {
                lastShotTime.current = now;
                nextProjectiles.push({ id: now, x: playerPosition.x + PLAYER_WIDTH / 2 - PROJECTILE_WIDTH / 2, y: playerPosition.y });
            }
        }
        nextProjectiles = nextProjectiles.filter(p => p.y > -PROJECTILE_HEIGHT);
        let nextMissiles = missiles.map(m => ({ ...m, y: m.y - MISSILE_SPEED })).filter(m => m.y > -MISSILE_HEIGHT);
        
        // --- Enemy Spawning ---
        let newlySpawnedEnemies: EnemyGameObject[] = [];
        if(spawnQueue.length > 0 && now - lastSpawnTime.current > ENEMY_SPAWN_INTERVAL) {
            lastSpawnTime.current = now;
            const typeToSpawn = spawnQueue[0];
            setSpawnQueue(prev => prev.slice(1));
            const stats = ENEMY_TYPES[typeToSpawn];
            newlySpawnedEnemies.push({
                id: now,
                type: typeToSpawn,
                hp: stats.hp,
                x: Math.random() * (GAME_WIDTH - stats.width),
                y: ENEMY_SPAWN_Y,
                vx: (Math.random() < 0.5 ? 1 : -1) * stats.horizontalSpeed,
            });
        }
        let nextEnemies = [...enemies, ...newlySpawnedEnemies];
        
        // --- Enemy & Boss Logic ---
        let nextEnemyProjectiles = enemyProjectiles.map(ep => ({...ep, y: ep.y + ENEMY_PROJECTILE_SPEED})).filter(ep => ep.y < GAME_HEIGHT);
        
        // Enemy Movement & Shooting
        nextEnemies.forEach(e => {
            const stats = ENEMY_TYPES[e.type];
            e.x += e.vx;

            // Boundary collision
            if (e.x <= 0 || e.x >= GAME_WIDTH - stats.width) {
                e.vx *= -1;
            }
            // Random direction change
            if (Math.random() < ENEMY_RANDOM_DIRECTION_CHANGE_CHANCE) {
                e.vx *= -1;
            }

            if (Math.random() < stats.shootChance) {
                nextEnemyProjectiles.push({
                    id: Date.now() + Math.random(),
                    x: e.x + stats.width / 2 - ENEMY_PROJECTILE_WIDTH / 2,
                    y: e.y + stats.height
                });
            }
        });

        let nextBoss = boss;
        let nextBossProjectiles = bossProjectiles.map(bp => {
            const stats = BOSS_PROJECTILE_STATS[bp.type];
            return {...bp, y: bp.y + stats.speed}
        }).filter(bp => bp.y < GAME_HEIGHT);

        if (gameMode === GameMode.Campaign && boss) {
            bossTimers.current.bullet += 16.67;
            bossTimers.current.missile += 16.67;
            if(bossTimers.current.bullet > BOSS_STATS.bulletCooldown) {
                bossTimers.current.bullet = 0;
                nextBossProjectiles.push({id: Date.now(), type: 'bullet', x: boss.x + Math.random() * BOSS_STATS.width, y: boss.y + BOSS_STATS.height });
            }
            if(bossTimers.current.missile > BOSS_STATS.missileCooldown) {
                bossTimers.current.missile = 0;
                nextBossProjectiles.push({id: Date.now() + 1, type: 'missile', x: boss.x + Math.random() * BOSS_STATS.width, y: boss.y + BOSS_STATS.height, hp: BOSS_PROJECTILE_STATS.missile.hp });
            }
        }
        
        // --- Collision Detection ---
        const projectilesAfterCollision: ProjectileGameObject[] = [];
        for (const p of nextProjectiles) {
            let projectileHit = false;
            for (let e of nextEnemies) {
                const stats = ENEMY_TYPES[e.type];
                if (p.x < e.x + stats.width && p.x + PROJECTILE_WIDTH > e.x && p.y < e.y + stats.height && p.y + PROJECTILE_HEIGHT > e.y) {
                    projectileHit = true; e.hp -= 1; break;
                }
            }
            if (projectileHit) continue;
            if (nextBoss && p.x < nextBoss.x + BOSS_STATS.width && p.x + PROJECTILE_WIDTH > nextBoss.x && p.y < nextBoss.y + BOSS_STATS.height && p.y + PROJECTILE_HEIGHT > nextBoss.y) {
                projectileHit = true; nextBoss.hp -= 1;
            }
            if (projectileHit) continue;
            for (let bp of nextBossProjectiles) {
                if(bp.type === 'missile'){
                    const stats = BOSS_PROJECTILE_STATS.missile;
                    if (p.x < bp.x + stats.width && p.x + PROJECTILE_WIDTH > bp.x && p.y < bp.y + stats.height && p.y + PROJECTILE_HEIGHT > bp.y) {
                        projectileHit = true; bp.hp! -= 1; break;
                    }
                }
            }
            if (!projectileHit) projectilesAfterCollision.push(p);
        }

        const missilesAfterCollision: MissileGameObject[] = [];
        const missileDamage = getMissileDamage(upgrades.missilePotency);
        const missileBlastRadius = getMissileBlastRadius(upgrades.missilePotency);
        for (const m of nextMissiles) {
            let missileHit = false;
            let hitTarget: Position | null = null;
            for (const e of nextEnemies) {
                const stats = ENEMY_TYPES[e.type];
                if (m.x < e.x + stats.width && m.x + MISSILE_WIDTH > e.x && m.y < e.y + stats.height && m.y + MISSILE_HEIGHT > e.y) {
                    missileHit = true; hitTarget = {x: e.x, y: e.y}; break;
                }
            }
            if (!missileHit && nextBoss && m.x < nextBoss.x + BOSS_STATS.width && m.x + MISSILE_WIDTH > nextBoss.x && m.y < nextBoss.y + BOSS_STATS.height && m.y + MISSILE_HEIGHT > nextBoss.y) {
                 missileHit = true; hitTarget = {x: nextBoss.x + BOSS_STATS.width/2, y: nextBoss.y + BOSS_STATS.height/2};
            }
            if (missileHit && hitTarget) {
                setExplosions(prev => [...prev, { id: m.id, x: hitTarget!.x, y: hitTarget!.y }]);
                setTimeout(() => setExplosions(exps => exps.filter(ex => ex.id !== m.id)), 500);
                for (const target of nextEnemies) {
                    const targetStats = ENEMY_TYPES[target.type];
                    const distance = Math.sqrt(Math.pow(target.x + targetStats.width / 2 - (hitTarget.x), 2) + Math.pow(target.y + targetStats.height / 2 - (hitTarget.y), 2));
                    if (distance < missileBlastRadius) target.hp -= missileDamage;
                }
                if (nextBoss) {
                     const distance = Math.sqrt(Math.pow(nextBoss.x + BOSS_STATS.width / 2 - (hitTarget.x), 2) + Math.pow(nextBoss.y + BOSS_STATS.height / 2 - (hitTarget.y), 2));
                    if (distance < missileBlastRadius) nextBoss.hp -= missileDamage;
                }
            } else {
                missilesAfterCollision.push(m);
            }
        }
        
        // --- Cleanup & Player Collision ---
        const aliveEnemies = [];
        for (const e of nextEnemies) {
            if (e.hp > 0) {
                aliveEnemies.push(e);
            } else {
                scoreToAdd += 1;
                currencyToAdd += ENEMY_TYPES[e.type].currency;
            }
        }

        const finalEnemies: EnemyGameObject[] = [];
        for (const e of aliveEnemies) {
            const stats = ENEMY_TYPES[e.type];
            if (playerPosition.x < e.x + stats.width && playerPosition.x + PLAYER_WIDTH > e.x && playerPosition.y < e.y + stats.height && playerPosition.y + PLAYER_HEIGHT > e.y) {
                wasPlayerHit = true; 
            } else {
                finalEnemies.push(e);
            }
        }

        const finalEnemyProjectiles: EnemyProjectileGameObject[] = [];
        for (const ep of nextEnemyProjectiles) {
            if (playerPosition.x < ep.x + ENEMY_PROJECTILE_WIDTH && playerPosition.x + PLAYER_WIDTH > ep.x && playerPosition.y < ep.y + ENEMY_PROJECTILE_HEIGHT && playerPosition.y + PLAYER_HEIGHT > ep.y) {
                wasPlayerHit = true;
            } else {
                finalEnemyProjectiles.push(ep);
            }
        }

        const finalBossProjectiles = nextBossProjectiles.filter(bp => {
            const stats = BOSS_PROJECTILE_STATS[bp.type];
            if (bp.hp && bp.hp <= 0) return false;
            if (playerPosition.x < bp.x + stats.width && playerPosition.x + PLAYER_WIDTH > bp.x && playerPosition.y < bp.y + stats.height && playerPosition.y + PLAYER_HEIGHT > bp.y) {
                wasPlayerHit = true; return false;
            }
            return true;
        });

        if (nextBoss && nextBoss.hp <= 0) {
            scoreToAdd += 1;
            currencyToAdd += BOSS_STATS.currency;
            setBoss(null);
            nextBoss = null;
            setGameState(GameState.CampaignWon);
        }

        // --- Apply all state updates ---
        setPlayerPosition({ ...playerPosition, x: nextPlayerX });
        setProjectiles(projectilesAfterCollision);
        setMissiles(missilesAfterCollision);
        setEnemies(finalEnemies);
        setEnemyProjectiles(finalEnemyProjectiles);
        setBoss(nextBoss);
        setBossProjectiles(finalBossProjectiles);
        
        if (scoreToAdd > 0) setScore(prev => prev + scoreToAdd);
        if (currencyToAdd > 0) setCurrency(prev => prev + currencyToAdd);

        if (wasPlayerHit) {
            if (armor > 0) {
                setArmor(prev => prev - 1);
            } else {
                const newLives = lives - 1;
                if (newLives <= 0) {
                    setGameState(GameState.GameOver);
                    setLives(0);
                } else {
                    setLives(newLives);
                    setArmor(getPlayerMaxArmor(upgrades.armor));
                }
            }
        }
        
        // Level/Wave Progression
        if (gameState === GameState.Playing && spawnQueue.length === 0 && finalEnemies.length === 0 && !boss) {
            setGameState(GameState.Upgrades);
        }

        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, [gameState, gameMode, playerPosition, projectiles, enemies, enemyProjectiles, score, missiles, upgrades, boss, bossProjectiles, currentLevel, currentWave, lives, armor, spawnQueue]);

    useEffect(() => {
        if (gameState === GameState.Playing) {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [gameState, gameLoop]);

    const renderGameContent = () => {
        if (gameState === GameState.ModeSelection) return <ModeSelectionScreen onModeSelect={handleModeSelect} />;
        if (gameState === GameState.GameOver) return <GameOverScreen score={score} onRestart={handleRestart} />;
        if (gameState === GameState.CampaignWon) return <CampaignWonScreen score={score} onRestart={handleRestart} />;

        return (
            <>
                {showLevelIndicator && <LevelIndicator level={currentLevel} wave={currentWave} mode={gameMode} />}
                <Player position={playerPosition} />
                {boss && <Boss boss={boss} />}
                {enemies.map(enemy => <Enemy key={enemy.id} position={{ x: enemy.x, y: enemy.y }} type={enemy.type} />)}
                {projectiles.map(p => <Projectile key={p.id} position={{ x: p.x, y: p.y }} />)}
                {enemyProjectiles.map(ep => <EnemyProjectile key={ep.id} position={{ x: ep.x, y: ep.y }} />)}
                {missiles.map(m => <Missile key={m.id} position={{ x: m.x, y: m.y }} />)}
                {bossProjectiles.map(bp => <BossProjectile key={bp.id} projectile={bp} />)}
                {explosions.map(e => <Explosion key={e.id} position={{ x: e.x, y: e.y }} blastRadius={getMissileBlastRadius(upgrades.missilePotency)} />)}

                {gameState === GameState.Upgrades && (
                    <UpgradeScreen
                        currency={currency}
                        upgrades={upgrades}
                        onPurchase={handlePurchaseUpgrade}
                        onContinue={continueToNext}
                        setCurrency={setCurrency}
                    />
                )}
            </>
        )
    }

    const hudLevel = gameMode === GameMode.Campaign ? `Level ${currentLevel}` : `Wave ${currentWave}`;
    const maxArmor = getPlayerMaxArmor(upgrades.armor);

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 selection:bg-cyan-400 selection:text-black">
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 tracking-widest mb-4">SHAPE WARS</h1>
            <div 
                ref={gameAreaRef}
                onMouseMove={gameState === GameState.Playing ? handleMouseMove : undefined}
                onMouseDown={gameState === GameState.Playing ? handleMouseDown : undefined}
                onMouseUp={gameState === GameState.Playing ? handleMouseUp : undefined}
                onMouseLeave={gameState === GameState.Playing ? handleMouseUp : undefined}
                onContextMenu={gameState === GameState.Playing ? handleContextMenu : undefined}
                className="relative bg-black border-4 border-cyan-400 shadow-[0_0_20px_theme(colors.cyan.400)] overflow-hidden cursor-none" 
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
                {renderGameContent()}
            </div>
            {gameState !== GameState.ModeSelection && <Hud score={score} lives={lives} currency={currency} level={hudLevel} armor={armor} maxArmor={maxArmor} />}
        </div>
    );
};

export default App;