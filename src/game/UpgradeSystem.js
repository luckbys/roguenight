const UPGRADE_POOL = [
  { id: 'speed', label: 'Velocidade +15%', apply: (p) => (p.speed *= 1.15) },
  { id: 'damage', label: 'Dano +20%', apply: (p) => (p.damage *= 1.2) },
  { id: 'firerate', label: 'Cadência +18%', apply: (g) => (g.fireInterval *= 0.82) },
  { id: 'regen', label: 'Regeneração +', apply: (g) => (g.regen += 1.5) },
  { id: 'maxhp', label: 'Vida máxima +25', apply: (p) => { p.maxHp += 25; p.hp += 25; } },
  { id: 'multishot', label: 'Tiro duplo', apply: (g) => (g.multiShot = Math.min(2, g.multiShot + 1)) }
];

export class UpgradeSystem {
  pickOptions(count = 3) {
    return [...UPGRADE_POOL].sort(() => Math.random() - 0.5).slice(0, count);
  }
}
