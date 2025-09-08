import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Level {
    constructor(scene, world, levelNumber) {
        this.scene = scene;
        this.world = world;
        this.levelNumber = levelNumber;
        this.platforms = [];
        this.goal = null;
        
        this.generateLevel(levelNumber);
    }
    
    generateLevel(levelNumber) {
        // 既存のプラットフォームをクリア
        this.clearLevel();
        
        // 基本の地面
        this.createGround();
        
        // レベルに応じてプラットフォームを生成
        this.generatePlatforms(levelNumber);
        
        // ゴールを作成
        this.createGoal();
        
        // 障害物を追加
        this.addObstacles(levelNumber);
    }
    
    clearLevel() {
        // 既存のプラットフォームを削除
        this.platforms.forEach(platform => {
            this.scene.remove(platform.mesh);
            this.world.removeBody(platform.body);
        });
        this.platforms = [];
        
        // ゴールを削除
        if (this.goal) {
            this.scene.remove(this.goal.mesh);
            this.world.removeBody(this.goal.body);
        }
    }
    
    createGround() {
        // 地面のメッシュ
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);
        
        // 地面の物理ボディ
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(groundBody);
    }
    
    generatePlatforms(levelNumber) {
        const platformCount = Math.min(3 + levelNumber, 8);
        
        for (let i = 0; i < platformCount; i++) {
            const x = (Math.random() - 0.5) * 20;
            const z = i * 8 + Math.random() * 4;
            const y = Math.random() * 3 + 1;
            
            this.createPlatform(x, y, z, 3, 0.5, 3);
        }
    }
    
    createPlatform(x, y, z, width, height, depth) {
        // プラットフォームのメッシュ
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        
        // プラットフォームの物理ボディ
        const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
        const body = new CANNON.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(x, y, z);
        this.world.addBody(body);
        
        this.platforms.push({ mesh, body });
    }
    
    createGoal() {
        const goalX = 0;
        const goalY = 1;
        const goalZ = this.levelNumber * 10 + 15;
        
        // ゴールのメッシュ（光る円柱）
        const geometry = new THREE.CylinderGeometry(1, 1, 2, 16);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00ff00,
            emissive: 0x004400,
            transparent: true,
            opacity: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(goalX, goalY, goalZ);
        this.scene.add(mesh);
        
        // ゴールの物理ボディ（トリガー）
        const shape = new CANNON.Cylinder(1, 1, 2, 8);
        const body = new CANNON.Body({ mass: 0, isTrigger: true });
        body.addShape(shape);
        body.position.set(goalX, goalY, goalZ);
        this.world.addBody(body);
        
        this.goal = { mesh, body, position: { x: goalX, y: goalY, z: goalZ } };
    }
    
    addObstacles(levelNumber) {
        // レベルに応じて障害物を追加
        if (levelNumber > 2) {
            this.addMovingObstacles();
        }
        
        if (levelNumber > 4) {
            this.addRotatingPlatforms();
        }
    }
    
    addMovingObstacles() {
        // 動く障害物（簡単な例）
        for (let i = 0; i < 2; i++) {
            const x = (Math.random() - 0.5) * 15;
            const z = 5 + i * 8;
            const y = 2;
            
            this.createMovingObstacle(x, y, z);
        }
    }
    
    createMovingObstacle(x, y, z) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        this.scene.add(mesh);
        
        const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        const body = new CANNON.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(x, y, z);
        this.world.addBody(body);
        
        // アニメーション用のプロパティ
        mesh.userData = { 
            originalX: x, 
            direction: 1, 
            speed: 0.02,
            body: body
        };
        
        this.platforms.push({ mesh, body, isMoving: true });
    }
    
    addRotatingPlatforms() {
        // 回転するプラットフォーム
        for (let i = 0; i < 2; i++) {
            const x = (Math.random() - 0.5) * 10;
            const z = 8 + i * 6;
            const y = 3;
            
            this.createRotatingPlatform(x, y, z);
        }
    }
    
    createRotatingPlatform(x, y, z) {
        const geometry = new THREE.BoxGeometry(4, 0.5, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x4169E1 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        
        const shape = new CANNON.Box(new CANNON.Vec3(2, 0.25, 0.5));
        const body = new CANNON.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(x, y, z);
        this.world.addBody(body);
        
        mesh.userData = { 
            rotationSpeed: 0.02,
            body: body
        };
        
        this.platforms.push({ mesh, body, isRotating: true });
    }
    
    update() {
        // 動く障害物の更新
        this.platforms.forEach(platform => {
            if (platform.isMoving) {
                const mesh = platform.mesh;
                const body = platform.body;
                const userData = mesh.userData;
                
                // 左右に移動
                mesh.position.x += userData.direction * userData.speed;
                body.position.x = mesh.position.x;
                
                // 方向転換
                if (Math.abs(mesh.position.x - userData.originalX) > 5) {
                    userData.direction *= -1;
                }
            }
            
            if (platform.isRotating) {
                const mesh = platform.mesh;
                const body = platform.body;
                const userData = mesh.userData;
                
                // 回転
                mesh.rotation.y += userData.rotationSpeed;
                body.quaternion.copy(mesh.quaternion);
            }
        });
    }
    
    checkGoal(ballPosition) {
        if (!this.goal) return false;
        
        const distance = ballPosition.distanceTo(
            new THREE.Vector3(this.goal.position.x, this.goal.position.y, this.goal.position.z)
        );
        
        return distance < 2; // ゴールの半径内
    }
}
