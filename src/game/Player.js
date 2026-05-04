import * as THREE from 'three';

export class Player {
  constructor(scene) {
    this.maxHp = 100;
    this.hp = this.maxHp;
    this.speed = 7;
    this.radius = 0.8;
    this.damage = 20;

    const geo = new THREE.CapsuleGeometry(0.6, 1.0, 4, 8);
    const mat = new THREE.MeshStandardMaterial({ color: 0x3cf0ff, emissive: 0x0a3c44 });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(0, 1, 0);
    scene.add(this.mesh);
  }

  update(dt, input) {
    const m = input.movement;
    const dir = new THREE.Vector3(m.x, 0, m.z);
    if (dir.lengthSq() > 0) {
      dir.normalize().multiplyScalar(this.speed * dt);
      this.mesh.position.add(dir);
    }
  }

  takeDamage(v) {
    this.hp = Math.max(0, this.hp - v);
  }
}
