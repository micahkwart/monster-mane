# Monster Mane - 3D Fighting Game

A simple 3D fighting game prototype built with Python and the Ursina engine.

## Description

Monster Mane is a local multiplayer 3D fighting game where two players battle in an arena. Each player controls a cube-like character with movement and attack capabilities. The goal is to reduce your opponent's health to zero to win!

## Features

- **Two Players:** Red cube (Player 1) and Blue cube (Player 2)
- **Simple Controls:**
  - **Player 1:** WASD to move, F to attack
  - **Player 2:** Arrow keys to move, M to attack
- **Health System:** Visual health bars above each player
- **Physics:** Basic gravity and ground collision
- **Win Condition:** Game ends when one player's health reaches 0
- **Restart Button:** UI button to restart the game at any time

## Installation

1. Make sure you have Python 3.12+ installed
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## How to Run

### Easy Way (Double-Click to Launch)

**Windows Users:**
- Double-click `launch_game.bat`

**Mac/Linux Users:**
- Double-click `launch_game.sh` (or run `./launch_game.sh` from terminal)

The launcher will automatically install dependencies if needed and start the game.

### Command Line

```bash
python fighting_game.py
```

## How to Play

1. Run the game using the command above
2. A 3D arena will appear with two cube characters (red and blue)
3. **Player 1 (Red):**
   - Move with W/A/S/D keys
   - Attack with F key
4. **Player 2 (Blue):**
   - Move with Arrow keys
   - Attack with M key
5. Get close to your opponent and press the attack key to deal damage
6. First player to reduce opponent's health to 0 wins!
7. Click "Restart Game" button to play again

## Tips

- Stay close to your opponent to land attacks
- Watch your health bar (displayed above your character)
- Move strategically to avoid opponent's attacks
- The arena has boundaries - you can't fall off!

## Requirements

- Python 3.12+
- Ursina 7.0.0
- Panda3D (installed automatically with Ursina)

## License

Open source - feel free to modify and improve!
