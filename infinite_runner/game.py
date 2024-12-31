import pygame
import random
import time

pygame.init()

WIDTH, HEIGHT = 800, 400
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()

player = pygame.Rect(50, HEIGHT - 70, 50, 50)
obstacles = []
gravity = 1
velocity_y = 0
is_running = True
is_alive = True
start_time = time.time()
is_color_inverted = False

def create_obstacle():
    size = random.randint(20, 50)
    return pygame.Rect(WIDTH, HEIGHT - size, size, size)

def handle_player():
    global velocity_y, is_alive
    velocity_y += gravity
    player.y += velocity_y
    if player.y + player.height >= HEIGHT:
        player.y = HEIGHT - player.height
        velocity_y = 0
    elif player.y <= 0:
        player.y = 0
        velocity_y = 0

    for obstacle in obstacles:
        if player.colliderect(obstacle):
            is_alive = False

def draw():
    global is_color_inverted
    elapsed_time = time.time() - start_time
    if elapsed_time >= 30 and not is_color_inverted:
        is_color_inverted = True

    bg_color = (0, 0, 0) if not is_color_inverted else (255, 255, 255)
    player_color = (255, 255, 255) if not is_color_inverted else (0, 0, 0)
    obstacle_color = (255, 0, 0) if not is_color_inverted else (0, 0, 255)

    screen.fill(bg_color)
    pygame.draw.rect(screen, player_color, player)
    for obstacle in obstacles:
        pygame.draw.polygon(
            screen, obstacle_color,
            [(obstacle.x, obstacle.y + obstacle.height), 
             (obstacle.x + obstacle.width // 2, obstacle.y), 
             (obstacle.x + obstacle.width, obstacle.y + obstacle.height)]
        )
    pygame.display.flip()

while is_running:
    clock.tick(60)
    if is_alive:
        if random.randint(1, 100) < 2:
            obstacles.append(create_obstacle())
        for obstacle in obstacles:
            obstacle.x -= 5
        obstacles = [obstacle for obstacle in obstacles if obstacle.x + obstacle.width > 0]
        handle_player()
    else:
        print("Game Over! Press R to restart.")
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            is_running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE and is_alive:
                velocity_y = -20
            if event.key == pygame.K_r:
                is_alive = True
                obstacles = []
                start_time = time.time()
                player.y = HEIGHT - 70
                is_color_inverted = False
    if is_alive:
        draw()

pygame.quit()
