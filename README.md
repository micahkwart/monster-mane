# Monster Mane – Dragon Chronicles

A Dragon Ball Xenoverse 2-style 3D action RPG playable in any modern browser. No installation required.

## 🎮 How to Play

1. Open `index.html` in a modern web browser (Chrome/Firefox/Edge)
2. Enter your name and click **New Game** (or **Continue** if you have a save)
3. Explore **Conton City** hub world, talk to NPCs, and walk into the **Time Portal** to start missions
4. Complete Parallel Quests to unlock Dragon Ball powers and progress your character

## 🏙️ Conton City Hub

Walk around the hub world to interact with famous Dragon Ball characters:

| NPC | Location | Role |
|-----|----------|------|
| Chronoa | Near portal | Welcome & tips |
| Elder Kai | Near portal | Training advice |
| Bulma | Z-Store | **Opens shop** 🛒 |
| Future Trunks | Central plaza | Combat tips |
| Piccolo, Krillin, Gohan, Yamcha | Around city | Lore/dialogue |

Walk into the glowing **⚡ Time Portal** (center south) to choose a mission.

## 🕹️ Controls

| Key | Action |
|-----|--------|
| **WASD** | Move |
| **← →** | Rotate camera |
| **E** | Interact (NPCs / portal) |
| **1–0** | Use powers |
| **B** | Open Z-Store shop |

## ⚡ 10 Dragon Ball Powers (unlocked by completing levels)

| Key | Power | Unlocked After | Cooldown |
|-----|-------|----------------|----------|
| 1 | Ki Blast | PQ 01 | 0.8 s |
| 2 | Kamehameha | PQ 02 | 2 s |
| 3 | Galick Gun | PQ 03 | 2.5 s |
| 4 | Spirit Bomb (AoE) | PQ 04 | 8 s |
| 5 | Senzu Bean (heal) | PQ 05 | 6 s |
| 6 | Ki Shield (5 s invincible) | PQ 06 | 12 s |
| 7 | Explosive Wave (AoE) | PQ 07 | 4 s |
| 8 | Solar Flare (stun) | PQ 08 | 5 s |
| 9 | Super Saiyan (2× dmg) | PQ 09 | 15 s |
| 0 | Final Flash | PQ 10 | 10 s |

## 📋 10 Parallel Quest Levels

| # | Name | Enemies | Reward |
|---|------|---------|--------|
| 1 | Saiyan Warriors | 5 | Ki Blast |
| 2 | The Android Files | 7 | Kamehameha |
| 3 | Namek Showdown | 8 | Galick Gun |
| 4 | Cell Games | 10 | Spirit Bomb |
| 5 | Buu Saga | 10 | Senzu Bean |
| 6 | Tournament of Power | 12 | Ki Shield |
| 7 | Frieza's Revenge | 12 | Explosive Wave |
| 8 | Golden Age | 15 | Solar Flare |
| 9 | Ultra Instinct Test | 15 | Super Saiyan |
| 10 | Supreme Battle | 20 | Final Flash |

## 🛒 Z-Store Upgrades (talk to Bulma or press B)

| Item | Cost | Effect |
|------|------|--------|
| Senzu Bean | 50 💰 | Restore full health |
| Battle Suit | 100 💰 | +20 max HP (permanent) |
| Super Training | 150 💰 | +10% damage (permanent) |
| Gravity Chamber | 120 💰 | +15% speed (permanent) |
| Time Crystals | 200 💰 | −10% cooldowns (permanent) |

## 💾 Database / Save System

Progress is automatically saved to **IndexedDB** (with localStorage fallback) including:
- Character name & level (1–50)
- XP, coins, max health
- Completed quests
- Unlocked powers
- Purchased stat upgrades

## 📈 Character Progression

- Defeat enemies → earn **XP** and **coins**
- XP fills your character level bar (each level = `level × 150 XP`)
- Level up: **+10 max HP**, **+5% damage multiplier** (automatic)
- Max character level: **50**

## 🚀 Running the Game

Open `index.html` in any modern browser. No server, no build step, no dependencies.

| File | Purpose |
|------|---------|
| `index.html` | Game HTML + CSS layout |
| `game.js` | All game logic (canvas rendering, AI, DB, state machine) |
