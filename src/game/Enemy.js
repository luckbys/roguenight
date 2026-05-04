import * as THREE from 'three';

const ENEMY_PRESETS = {
  runner: { hp: 25, speed: 4.7, damage: 10, color: 0xff4d6d, size: 0.65, xp: 8 },
  tank: { hp: 70, speed: 2.2, damage: 18, color: 0xffaf40, size: 1.0, xp: 16 },
  shooter: { hp: 38, speed: 2.9, damage: 12, color: 0x7f72ff, size: 0.75, xp: 12 }
};

export class Enemy {
  constructor(scene, type, position) {
    this.type = type;
    this.stats = { ...ENEMY_PRESETS[type] };
    this.hp = this.stats.hp;
    this.radius = this.stats.size;
    this.attackCooldown = 1.2;

    const geo = new THREE.BoxGeometry(this.stats.size * 1.4, this.stats.size * 1.4, this.stats.size * 1.4);
    const mat = new THREE.MeshStandardMaterial({ color: this.stats.color, emissive: 0x301010 });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.copy(position);
    this.mesh.position.y = this.stats.size;
    scene.add(this.mesh);
  }

  update(dt, target) {
    const delta = new THREE.Vector3().subVectors(target.mesh.position, this.mesh.position);
    delta.y = 0;
    const len = delta.length();

    if (this.type === 'shooter') {
      if (len > 10) {
        delta.normalize();
        this.mesh.position.addScaledVector(delta, this.stats.speed * dt);
      }
      this.attackCooldown -= dt;
      return;
    }

    if (len > 0.01) {
      delta.multiplyScalar(1 / len);
      this.mesh.position.addScaledVector(delta, this.stats.speed * dt);
    }
  }

  canShoot() {
    if (this.type !== 'shooter') return false;
    if (this.attackCooldown <= 0) {
      this.attackCooldown = 1.25;
      return true;
    }
    return false;
  }

  takeDamage(v) {
    this.hp -= v;
    return this.hp <= 0;
  }
}
