import * as THREE from 'three';

export class Projectile {
  constructor(scene, from, to, damage) {
    this.damage = damage;
    this.speed = 18;
    this.radius = 0.2;
    this.alive = true;

    const geo = new THREE.SphereGeometry(this.radius, 10, 10);
    const mat = new THREE.MeshBasicMaterial({ color: 0x59ffea });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.copy(from);
    this.mesh.position.y = 1;
    scene.add(this.mesh);

    this.dir = new THREE.Vector3().subVectors(to, from).setY(0).normalize();
    this.life = 1.5;
  }

  update(dt) {
    this.life -= dt;
    if (this.life <= 0) this.alive = false;
    this.mesh.position.addScaledVector(this.dir, this.speed * dt);
  }
}
