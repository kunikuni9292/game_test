import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Ball } from './ball.js';
import { Level } from './level.js';
import { Physics } from './physics.js';
import { Controls } from './controls.js';

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), antialias: true });
        this.clock = new THREE.Clock();
        
        this.score = 0;
        this.level = 1;
        this.isGameOver = false;
        
        this.init();
    }
    
    init() {
        // レンダラーの設定
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB); // 空色
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // 物理エンジンの初期化
        this.physics = new Physics();
        
        // ボールの作成
        this.ball = new Ball(this.scene, this.physics.world);
        
        // レベル（ステージ）の作成
        this.levelManager = new Level(this.scene, this.physics.world, this.level);
        
        // カメラの設定
        this.camera.position.set(0, 10, 15);
        this.camera.lookAt(0, 0, 0);
        
        // ライティング
        this.setupLighting();
        
        // コントロールの設定
        this.controls = new Controls(this.ball, this.camera);
        
        // イベントリスナーの設定
        this.setupEventListeners();
        
        // ゲームループ開始
        this.animate();
    }
    
    setupLighting() {
        // 環境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // 指向性ライト（太陽光）
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        this.scene.add(directionalLight);
    }
    
    setupEventListeners() {
        // ウィンドウリサイズ
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // リスタートボタン
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
    }
    
    animate() {
        if (this.isGameOver) return;
        
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        // 物理シミュレーション
        this.physics.world.step(deltaTime);
        
        // コントロールの更新
        this.controls.update();
        
        // ボールの更新
        this.ball.update();
        
        // レベルの更新
        this.levelManager.update();
        
        // カメラの更新（ボールを追従）
        this.updateCamera();
        
        // レベルチェック
        this.checkLevelProgress();
        
        // レンダリング
        this.renderer.render(this.scene, this.camera);
    }
    
    updateCamera() {
        // ボールの位置に基づいてカメラを更新
        const ballPosition = this.ball.mesh.position;
        this.camera.position.x = ballPosition.x;
        this.camera.position.z = ballPosition.z + 15;
        this.camera.lookAt(ballPosition.x, ballPosition.y, ballPosition.z);
    }
    
    checkLevelProgress() {
        // ボールが落ちた場合のゲームオーバー
        if (this.ball.mesh.position.y < -10) {
            this.gameOver();
        }
        
        // ゴールに到達した場合
        if (this.levelManager.checkGoal(this.ball.mesh.position)) {
            this.nextLevel();
        }
    }
    
    nextLevel() {
        this.level++;
        this.score += 1000;
        this.updateUI();
        
        // 新しいレベルを生成
        this.levelManager.generateLevel(this.level);
        
        // ボールをリセット
        this.ball.reset();
    }
    
    gameOver() {
        this.isGameOver = true;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.remove('hidden');
    }
    
    restart() {
        this.isGameOver = false;
        this.score = 0;
        this.level = 1;
        this.updateUI();
        
        // シーンをリセット
        this.scene.clear();
        this.setupLighting();
        
        // 物理ワールドをリセット
        this.physics.reset();
        
        // 新しいレベルとボールを作成
        this.levelManager = new Level(this.scene, this.physics.world, this.level);
        this.ball = new Ball(this.scene, this.physics.world);
        this.controls = new Controls(this.ball, this.camera);
        
        document.getElementById('gameOver').classList.add('hidden');
        this.animate();
    }
    
    updateUI() {
        document.getElementById('score').textContent = `スコア: ${this.score}`;
        document.getElementById('level').textContent = `レベル: ${this.level}`;
    }
}

// ゲーム開始
const game = new Game();
