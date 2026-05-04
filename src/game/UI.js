export class UI {
  constructor() {
    this.hpFill = document.getElementById('hpFill');
    this.level = document.getElementById('level');
    this.xp = document.getElementById('xp');
    this.time = document.getElementById('time');
    this.overlay = document.getElementById('overlay');
    this.finalTime = document.getElementById('finalTime');
    this.restartBtn = document.getElementById('restartBtn');
    this.upgradeModal = document.getElementById('upgradeModal');
    this.upgradeOptions = document.getElementById('upgradeOptions');
  }

  update(state) {
    this.hpFill.style.width = `${(state.hp / state.maxHp) * 100}%`;
    this.level.textContent = String(state.level);
    this.xp.textContent = `${Math.floor(state.xp)}/${state.nextXp}`;
    this.time.textContent = this.formatTime(state.time);
  }

  showUpgrades(options, onPick) {
    this.upgradeOptions.innerHTML = '';
    for (const option of options) {
      const btn = document.createElement('button');
      btn.textContent = option.label;
      btn.addEventListener('click', () => onPick(option));
      this.upgradeOptions.appendChild(btn);
    }
    this.upgradeModal.style.display = 'flex';
  }

  hideUpgrades() {
    this.upgradeModal.style.display = 'none';
  }

  showGameOver(time) {
    this.finalTime.textContent = this.formatTime(time);
    this.overlay.style.display = 'flex';
  }

  hideGameOver() {
    this.overlay.style.display = 'none';
  }

  formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}
