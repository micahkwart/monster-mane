# Monster Mane - Game Features Documentation

## Overview
Monster Mane is a 3D fighting game prototype built with Python and the Ursina engine. This document outlines all implemented features.

## ✅ Implemented Features

### 1. Two Players
- **Player 1 (Red Cube)**: Positioned on the left side of the arena
- **Player 2 (Blue Cube)**: Positioned on the right side of the arena
- Both players are represented as 3D cube-like characters

### 2. Control System

#### Player 1 Controls:
- **W**: Move forward (positive Z direction)
- **S**: Move backward (negative Z direction)
- **A**: Move left (negative X direction)
- **D**: Move right (positive X direction)
- **F**: Attack

#### Player 2 Controls:
- **Up Arrow**: Move forward
- **Down Arrow**: Move backward
- **Left Arrow**: Move left
- **Right Arrow**: Move right
- **M**: Attack

### 3. Health System
- Each player starts with **100 HP**
- Health bars are displayed above each player's head
  - Background bar (dark) shows maximum health
  - Foreground bar (colored) shows current health
- Getting hit by an attack reduces health by **10 HP**
- Health bars update in real-time

### 4. Combat System
- Attack range: **2.5 units**
- Attack cooldown: **0.5 seconds** (prevents spam)
- Visual feedback: Player scales up briefly when attacking
- Attacks only hit if players are within range

### 5. Physics System
- **Gravity**: Players are affected by gravity (0.5 units/frame²)
- **Ground Collision**: Players cannot fall through the floor
- Players are constrained to the arena boundaries (-10 to 10 on X and Z axes)

### 6. Win Condition
- Game ends when either player's health reaches 0
- **"GAME OVER"** message appears with the winner announced
- Game state freezes to prevent further actions

### 7. User Interface
- **Title**: "3D Fighting Game" displayed at top
- **Instructions**: Control scheme displayed below title
- **Restart Button**: Located in top-right corner
  - Click to reset the game at any time
  - Resets both players' health and positions
- **FPS Counter**: Shows current frame rate

### 8. 3D Environment
- **Arena**: 20x20 unit gray platform
- **Camera**: Positioned at (0, 15, -20) with 30° downward angle
- **Lighting**: 
  - Directional light for shadows and depth
  - Ambient light for overall illumination

## Game Flow

1. **Start**: Game begins with both players at full health
2. **Movement**: Players move around the arena using their controls
3. **Combat**: Players attack when close to each other
4. **Victory**: First player to reduce opponent's health to 0 wins
5. **Restart**: Click "Restart Game" button to play again

## Technical Details

- **Engine**: Ursina 7.0.0 (built on Panda3D)
- **Language**: Python 3.12+
- **Graphics**: Real-time 3D rendering
- **Physics**: Custom gravity and collision implementation

## How to Run

```bash
# Install dependencies
pip install -r requirements.txt

# Run the game
python fighting_game.py
```

## Requirements Met

All requirements from the problem statement have been successfully implemented:

✅ Two cube-like characters (Player 1 and Player 2)  
✅ Player 1 controls: WASD + F  
✅ Player 2 controls: Arrow keys + M  
✅ Health system with visual health bars  
✅ Win condition with Game Over message  
✅ Gravity and ground collision physics  
✅ UI button to restart the game  

---

*Game created as a prototype for local multiplayer 3D combat gameplay.*
