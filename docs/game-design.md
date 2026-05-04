# Game Design Document (MVP)

## Identidade
**Nome provisório:** Neon Outbreak

A fantasia do jogo é sobreviver dentro de uma simulação corrompida. Inimigos são “processos infectados”, enquanto upgrades são “patches” aplicados em runtime.

## Controles (desktop)
- WASD: mover
- Mouse: mirar (quando houver mira manual)
- Clique esquerdo: disparo manual (opcional)
- Shift: dash
- Espaço: habilidade especial

> Para o MVP, manter ataque automático como padrão.

## Tipos de inimigos iniciais
1. **Runner**
   - Rápido
   - Pouca vida
   - Persegue diretamente
2. **Tank**
   - Lento
   - Muita vida
   - Pressiona posicionamento
3. **Shooter**
   - Mantém distância
   - Atira projéteis periódicos

## Upgrades básicos
- Velocidade +
- Dano +
- Cadência +
- Tiro duplo
- Regeneração lenta
- Cooldown de dash -

## Escala de dificuldade (exemplo)
- **0-2 min:** baixa densidade, inimigos lentos
- **2-5 min:** aumento de runners
- **5 min:** mini-boss
- **5-10 min:** entrada de tanks e shooters
- **10 min:** hazards dinâmicos (zonas perigosas / arena comprimida)
- **15 min:** boss final

## Regras técnicas simplificadas
- Colisão por raio usando distância euclidiana.
- Spawn em anel externo da arena para evitar spawn em cima do jogador.
- Auto-aim selecionando inimigo mais próximo no range.
- UI desacoplando estado de jogo e renderização.

## Critérios de “primeira build jogável”
- Cena 3D funcional com arena e iluminação básica
- Jogador controlável
- Inimigos spawnando e perseguindo
- Dano e morte
- XP coletável
- Level up com escolha de upgrade
- Game over com reinício
