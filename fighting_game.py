"""
3D Fighting Game Prototype
A simple local multiplayer 3D fighting game built with Python and Ursina engine.

Controls:
- Player 1: WASD to move, F to attack
- Player 2: Arrow keys to move, M to attack
"""

from ursina import *

class Player(Entity):
    """Player class representing each fighter in the game."""
    
    def __init__(self, position, player_color, controls, player_name):
        super().__init__(
            model='cube',
            color=player_color,
            position=position,
            scale=(1, 2, 1),
            collider='box'
        )
        self.health = 100
        self.max_health = 100
        self.controls = controls
        self.player_name = player_name
        self.velocity_y = 0
        self.is_attacking = False
        self.attack_cooldown = 0
        self.is_on_ground = False
        
        # Create health bar above player
        self.health_bar_bg = Entity(
            model='quad',
            color=color.black50,
            scale=(1.5, 0.2),
            position=self.position + Vec3(0, 2.5, 0),
            billboard=True
        )
        self.health_bar = Entity(
            model='quad',
            color=player_color,
            scale=(1.5, 0.15),
            position=self.position + Vec3(0, 2.5, 0.01),
            billboard=True
        )
        
    def update(self):
        """Update player state every frame."""
        # Apply gravity
        if not self.is_on_ground:
            self.velocity_y -= 0.5 * time.dt
        else:
            self.velocity_y = 0
            
        self.y += self.velocity_y
        
        # Ground collision
        if self.y <= 1:
            self.y = 1
            self.is_on_ground = True
        else:
            self.is_on_ground = False
            
        # Update health bar position
        self.health_bar_bg.position = self.position + Vec3(0, 2.5, 0)
        self.health_bar.position = self.position + Vec3(0, 2.5, 0.01)
        
        # Update health bar scale
        health_percent = self.health / self.max_health
        self.health_bar.scale_x = 1.5 * health_percent
        self.health_bar.x = self.health_bar_bg.x - (1.5 - self.health_bar.scale_x) / 2
        
        # Cooldown for attacks
        if self.attack_cooldown > 0:
            self.attack_cooldown -= time.dt
            
    def move(self, direction):
        """Move the player in a given direction."""
        speed = 5 * time.dt
        self.position += direction * speed
        
        # Keep players in bounds
        self.x = clamp(self.x, -10, 10)
        self.z = clamp(self.z, -10, 10)
        
    def attack(self, other_player):
        """Attack the other player if in range."""
        if self.attack_cooldown <= 0:
            self.is_attacking = True
            self.attack_cooldown = 0.5
            
            # Check if other player is in range
            distance = distance(self.position, other_player.position)
            if distance < 2.5:
                other_player.take_damage(10)
                
            # Visual feedback - scale up briefly
            invoke(self.attack_animation, delay=0.1)
            
    def attack_animation(self):
        """Simple attack animation."""
        self.animate_scale(1.2, duration=0.1)
        invoke(lambda: self.animate_scale(1, duration=0.1), delay=0.1)
        self.is_attacking = False
        
    def take_damage(self, amount):
        """Reduce player health."""
        self.health -= amount
        if self.health < 0:
            self.health = 0
            
    def reset(self, position):
        """Reset player to initial state."""
        self.health = self.max_health
        self.position = position
        self.velocity_y = 0


class Game:
    """Main game class managing game state and logic."""
    
    def __init__(self):
        self.player1 = None
        self.player2 = None
        self.game_over = False
        self.game_over_text = None
        self.reset_button = None
        self.arena = None
        self.title_text = None
        self.instruction_text = None
        
    def setup(self):
        """Initialize the game."""
        # Create arena
        self.arena = Entity(
            model='plane',
            scale=(20, 1, 20),
            texture='white_cube',
            color=color.gray,
            collider='box'
        )
        
        # Create players
        self.player1 = Player(
            position=Vec3(-5, 1, 0),
            player_color=color.red,
            controls={'forward': 'w', 'back': 's', 'left': 'a', 'right': 'd', 'attack': 'f'},
            player_name='Player 1'
        )
        
        self.player2 = Player(
            position=Vec3(5, 1, 0),
            player_color=color.blue,
            controls={'forward': 'up arrow', 'back': 'down arrow', 'left': 'left arrow', 'right': 'right arrow', 'attack': 'm'},
            player_name='Player 2'
        )
        
        # Create UI
        self.title_text = Text(
            text='3D Fighting Game',
            origin=(0, 0),
            position=(-0.5, 0.45),
            scale=2,
            color=color.white
        )
        
        self.instruction_text = Text(
            text='Player 1: WASD + F to attack | Player 2: Arrows + M to attack',
            origin=(0, 0),
            position=(-0.65, 0.4),
            scale=1,
            color=color.light_gray
        )
        
        self.reset_button = Button(
            text='Restart Game',
            color=color.azure,
            scale=(0.15, 0.05),
            position=(0.6, 0.45),
            on_click=self.restart_game
        )
        
        # Set up camera
        camera.position = (0, 15, -20)
        camera.rotation_x = 30
        
        self.game_over = False
        
    def update(self):
        """Update game state every frame."""
        if self.game_over:
            return
            
        # Player 1 controls
        if held_keys[self.player1.controls['forward']]:
            self.player1.move(Vec3(0, 0, 1))
        if held_keys[self.player1.controls['back']]:
            self.player1.move(Vec3(0, 0, -1))
        if held_keys[self.player1.controls['left']]:
            self.player1.move(Vec3(-1, 0, 0))
        if held_keys[self.player1.controls['right']]:
            self.player1.move(Vec3(1, 0, 0))
            
        # Player 2 controls
        if held_keys[self.player2.controls['forward']]:
            self.player2.move(Vec3(0, 0, 1))
        if held_keys[self.player2.controls['back']]:
            self.player2.move(Vec3(0, 0, -1))
        if held_keys[self.player2.controls['left']]:
            self.player2.move(Vec3(-1, 0, 0))
        if held_keys[self.player2.controls['right']]:
            self.player2.move(Vec3(1, 0, 0))
            
        # Check win condition
        if self.player1.health <= 0:
            self.end_game('Player 2 Wins!')
        elif self.player2.health <= 0:
            self.end_game('Player 1 Wins!')
            
    def input(self, key):
        """Handle key press events."""
        if self.game_over:
            return
            
        # Player 1 attack
        if key == self.player1.controls['attack']:
            self.player1.attack(self.player2)
            
        # Player 2 attack
        if key == self.player2.controls['attack']:
            self.player2.attack(self.player1)
            
    def end_game(self, winner):
        """End the game and display winner."""
        self.game_over = True
        self.game_over_text = Text(
            text=f'GAME OVER\n{winner}',
            origin=(0, 0),
            position=(0, 0),
            scale=3,
            color=color.yellow
        )
        
    def restart_game(self):
        """Restart the game."""
        self.game_over = False
        
        # Remove game over text if it exists
        if self.game_over_text:
            destroy(self.game_over_text)
            self.game_over_text = None
            
        # Reset players
        self.player1.reset(Vec3(-5, 1, 0))
        self.player2.reset(Vec3(5, 1, 0))


def main():
    """Main function to start the game."""
    app = Ursina()
    
    # Set window properties
    window.title = 'Monster Mane - 3D Fighting Game'
    window.borderless = False
    window.fullscreen = False
    window.exit_button.visible = True
    window.fps_counter.enabled = True
    
    # Create and setup game
    game = Game()
    game.setup()
    
    # Override default update and input functions
    def update():
        game.update()
    
    def input(key):
        game.input(key)
    
    # Set up lighting
    DirectionalLight(y=2, z=3, shadows=True)
    AmbientLight(color=color.rgba(150, 150, 150, 255))
    
    # Run the game
    app.run()


if __name__ == '__main__':
    main()
