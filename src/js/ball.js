import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Ball {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.radius = 0.5;
        this.mass = 1;
        
        this.createMesh();
        this.createBody();
        this.setupConstraints();
    }
    
    createMesh() {
        // ボールのジオメトリ
        const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        
        // マテリアル（金属的な質感）
        const material = new THREE.MeshPhongMaterial({
            color: 0xff6b6b,
            shininess: 100,
            specular: 0x222222
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        this.scene.add(this.mesh);
    }
    
    createBody() {
        // 物理ボディの作成
        const shape = new CANNON.Sphere(this.radius);
        this.body = new CANNON.Body({ mass: this.mass });
        this.body.addShape(shape);
        this.body.position.set(0, 5, 0);
        this.body.material = new CANNON.Material('ballMaterial');
        
        // ボールの物理特性
        this.body.material.friction = 0.3;
        this.body.material.restitution = 0.7; // 跳ね返り係数
        
        this.world.addBody(this.body);
    }
    
    setupConstraints() {
        // ボールの回転制限（転がるように）
        this.body.angularDamping = 0.4;
        this.body.linearDamping = 0.1;
    }
    
    update() {
        // 物理ボディの位置をメッシュに反映
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
    
    applyForce(force) {
        this.body.applyForce(new CANNON.Vec3(force.x, force.y, force.z), this.body.position);
    }
    
    reset() {
        this.body.position.set(0, 5, 0);
        this.body.velocity.set(0, 0, 0);
        this.body.angularVelocity.set(0, 0, 0);
    }
    
    getPosition() {
        return this.mesh.position;
    }
    
    getVelocity() {
        return this.body.velocity;
    }
}
