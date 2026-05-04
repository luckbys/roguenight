# Neon Outbreak

Protótipo de jogo 3D de sobrevivência em arena aberta, inspirado em survivor-likes.

## Conceito
- **Gênero:** ação/sobrevivência em ondas
- **Câmera:** terceira pessoa ou top-down inclinada
- **Objetivo:** sobreviver por 10, 15 ou 20 minutos
- **Estética:** low-poly neon sci-fi com elementos glitch

## Loop principal
1. Jogador nasce na arena 3D.
2. Inimigos surgem nas bordas e perseguem o jogador.
3. O personagem ataca automaticamente o alvo mais próximo.
4. Inimigos derrotados dropam XP e recursos.
5. Ao subir de nível, jogador escolhe 1 entre 3 upgrades.
6. Dificuldade escala com o tempo.
7. Partida termina com game over ou tempo-alvo alcançado.

## MVP
- Arena 3D plana
- Jogador com vida e movimentação WASD
- Inimigos com perseguição básica
- Colisão simples por distância
- Tiro automático
- XP no chão
- Sistema de level up
- 6 upgrades
- UI mínima (vida, XP, nível, cronômetro)
- Game over + reiniciar

## Estrutura inicial do código
```
src/
  main.js
  game/
    Game.js
    Player.js
    Enemy.js
    Projectile.js
    XPOrb.js
    UpgradeSystem.js
    WaveManager.js
    Input.js
    UI.js
```

## Roadmap sugerido
1. Movimento + câmera + arena
2. Spawn e perseguição de inimigos
3. Vida, dano e colisão
4. Ataque automático
5. XP e level up
6. Sistema de upgrades
7. UI e game over
8. Partículas, áudio e polish
9. Novos tipos de inimigos
10. Bosses e progressão avançada
