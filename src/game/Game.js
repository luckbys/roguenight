import * as THREE from 'three';
import { Input } from './Input.js';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { Projectile } from './Projectile.js';
import { XPOrb } from './XPOrb.js';
import { UpgradeSystem } from './UpgradeSystem.js';
import { UI } from './UI.js';

export class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x050510, 20, 90);
    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 250);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);

    this.input = new Input();
    this.ui = new UI();
    this.upgrades = new UpgradeSystem();

    this.clock = new THREE.Clock();
    this.spawnTimer = 0;
    this.shootTimer = 0;
    this.enemies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.orbs = [];

    this.level = 1;
    this.xp = 0;
    this.nextXp = 40;
    this.time = 0;
    this.over = false;
    this.pausedForUpgrade = false;
    this.fireInterval = 0.35;
    this.multiShot = 1;
    this.regen = 0;

    this.setupScene();
    this.player = new Player(this.scene);

    this.ui.restartBtn.addEventListener('click', () => window.location.reload());
    window.addEventListener('resize', () => this.onResize());
  }

  setupScene() {
    const light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(10, 18, 8);
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0x7f8cb3, 0.45));

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0x0d0e16, wireframe: true })
    );
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);
  }

  spawnEnemy() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 25 + Math.random() * 18;
    const pos = new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    const roll = Math.random();
    const type = roll < 0.62 ? 'runner' : roll < 0.88 ? 'tank' : 'shooter';
    this.enemies.push(new Enemy(this.scene, type, pos));
  }

  findClosestEnemy() {
    let closest = null;
    let best = Infinity;
    for (const e of this.enemies) {
      const d = e.mesh.position.distanceTo(this.player.mesh.position);
      if (d < best) {
        best = d;
        closest = e;
      }
    }
    return { enemy: closest, distance: best };
  }

  startUpgradeChoice() {
    this.pausedForUpgrade = true;
    const options = this.upgrades.pickOptions(3);
    this.ui.showUpgrades(options, (option) => {
      option.apply(option.id === 'speed' || option.id === 'damage' || option.id === 'maxhp' ? this.player : this);
      this.pausedForUpgrade = false;
      this.ui.hideUpgrades();
    });
  }

  gainXP(value) {
    this.xp += value;
    if (this.xp >= this.nextXp) {
      this.xp -= this.nextXp;
      this.level += 1;
      this.nextXp = Math.floor(this.nextXp * 1.3);
      this.startUpgradeChoice();
    }
  }

  spawnPlayerShot(target) {
    const baseFrom = this.player.mesh.position.clone();
    const offsets = this.multiShot === 1 ? [0] : [-0.35, 0.35];
    for (const offset of offsets) {
      const from = baseFrom.clone().add(new THREE.Vector3(offset, 0, 0));
      this.projectiles.push(new Projectile(this.scene, from, target.mesh.position, this.player.damage));
    }
  }

  update(dt) {
    if (this.over || this.pausedForUpgrade) return;

    this.time += dt;
    this.spawnTimer -= dt;
    this.shootTimer -= dt;
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + this.regen * dt);

    if (this.spawnTimer <= 0) {
      this.spawnEnemy();
      this.spawnTimer = Math.max(0.22, 1.0 - this.time * 0.01);
    }

    this.player.update(dt, this.input);

    for (const enemy of this.enemies) {
      enemy.update(dt, this.player);
      const d = enemy.mesh.position.distanceTo(this.player.mesh.position);

      if (enemy.type !== 'shooter' && d < enemy.radius + this.player.radius) {
        this.player.takeDamage(enemy.stats.damage * dt * 0.8);
      }

      if (enemy.canShoot()) {
        this.enemyProjectiles.push(new Projectile(this.scene, enemy.mesh.position, this.player.mesh.position, enemy.stats.damage));
      }
    }

    if (this.shootTimer <= 0) {
      const { enemy, distance } = this.findClosestEnemy();
      if (enemy && distance < 16) this.spawnPlayerShot(enemy);
      this.shootTimer = this.fireInterval;
    }

    for (const p of this.projectiles) p.update(dt);
    for (const p of this.enemyProjectiles) p.update(dt);

    for (const p of this.projectiles) {
      if (!p.alive) continue;
      for (const e of this.enemies) {
        if (p.mesh.position.distanceTo(e.mesh.position) < p.radius + e.radius) {
          p.alive = false;
          if (e.takeDamage(this.player.damage)) {
            this.scene.remove(e.mesh);
            e.dead = true;
            this.orbs.push(new XPOrb(this.scene, e.mesh.position.clone(), e.stats.xp));
          }
          break;
        }
      }
    }

    for (const p of this.enemyProjectiles) {
      if (p.alive && p.mesh.position.distanceTo(this.player.mesh.position) < p.radius + this.player.radius) {
        p.alive = false;
        this.player.takeDamage(p.damage);
      }
    }

    this.enemies = this.enemies.filter((e) => !e.dead);

    for (const orb of this.orbs) {
      if (orb.mesh.position.distanceTo(this.player.mesh.position) < orb.radius + this.player.radius) {
        this.gainXP(orb.value);
        orb.dead = true;
        this.scene.remove(orb.mesh);
      }
    }
    this.orbs = this.orbs.filter((o) => !o.dead);

    for (const p of this.projectiles) if (!p.alive) this.scene.remove(p.mesh);
    this.projectiles = this.projectiles.filter((p) => p.alive);
    for (const p of this.enemyProjectiles) if (!p.alive) this.scene.remove(p.mesh);
    this.enemyProjectiles = this.enemyProjectiles.filter((p) => p.alive);

    if (this.player.hp <= 0) {
      this.over = true;
      this.ui.showGameOver(this.time);
    }

    this.camera.position.set(this.player.mesh.position.x + 0.1, 20, this.player.mesh.position.z + 14);
    this.camera.lookAt(this.player.mesh.position.x, 0, this.player.mesh.position.z);

    this.ui.update({ hp: this.player.hp, maxHp: this.player.maxHp, level: this.level, xp: this.xp, nextXp: this.nextXp, time: this.time });
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  start() {
    this.ui.hideGameOver();
    this.ui.hideUpgrades();
    const loop = () => {
      const dt = Math.min(0.033, this.clock.getDelta());
      this.update(dt);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(loop);
    };
    loop();
  }
}
