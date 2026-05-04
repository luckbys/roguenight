import * as THREE from 'three';

export class XPOrb {
  constructor(scene, position, value = 10) {
    this.value = value;
    this.radius = 0.4;

    const geo = new THREE.OctahedronGeometry(0.35, 0);
    const mat = new THREE.MeshStandardMaterial({ color: 0xa56cff, emissive: 0x2b1048 });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.copy(position);
    this.mesh.position.y = 0.45;
    scene.add(this.mesh);
  }
}
