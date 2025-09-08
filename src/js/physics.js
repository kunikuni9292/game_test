import * as CANNON from 'cannon-es';

export class Physics {
    constructor() {
        this.world = new CANNON.World();
        this.setupWorld();
    }
    
    setupWorld() {
        // 重力の設定
        this.world.gravity.set(0, -9.82, 0);
        
        // 物理ワールドの設定
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
        this.world.allowSleep = true;
        
        // 接触マテリアルの設定
        this.setupContactMaterials();
    }
    
    setupContactMaterials() {
        // ボールと地面の接触
        const ballMaterial = new CANNON.Material('ballMaterial');
        const groundMaterial = new CANNON.Material('groundMaterial');
        
        const ballGroundContact = new CANNON.ContactMaterial(
            ballMaterial,
            groundMaterial,
            {
                friction: 0.4,
                restitution: 0.3
            }
        );
        
        this.world.addContactMaterial(ballGroundContact);
        
        // ボールとプラットフォームの接触
        const platformMaterial = new CANNON.Material('platformMaterial');
        
        const ballPlatformContact = new CANNON.ContactMaterial(
            ballMaterial,
            platformMaterial,
            {
                friction: 0.6,
                restitution: 0.4
            }
        );
        
        this.world.addContactMaterial(ballPlatformContact);
    }
    
    reset() {
        // 物理ワールドをリセット
        this.world.bodies.forEach(body => {
            this.world.removeBody(body);
        });
        this.setupWorld();
    }
    
    addBody(body) {
        this.world.addBody(body);
    }
    
    removeBody(body) {
        this.world.removeBody(body);
    }
    
    step(deltaTime) {
        this.world.step(deltaTime);
    }
}
