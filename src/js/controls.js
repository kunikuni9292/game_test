export class Controls {
    constructor(ball, camera) {
        this.ball = ball;
        this.camera = camera;
        this.keys = {};
        this.mouse = { x: 0, y: 0, isDown: false };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // キーボードイベント
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });
        
        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
        
        // マウスイベント
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        document.addEventListener('mousedown', (event) => {
            this.mouse.isDown = true;
        });
        
        document.addEventListener('mouseup', (event) => {
            this.mouse.isDown = false;
        });
        
        // タッチイベント（モバイル対応）
        document.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.mouse.isDown = true;
            if (event.touches.length > 0) {
                this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
            }
        });
        
        document.addEventListener('touchmove', (event) => {
            event.preventDefault();
            if (event.touches.length > 0) {
                this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
            }
        });
        
        document.addEventListener('touchend', (event) => {
            event.preventDefault();
            this.mouse.isDown = false;
        });
    }
    
    update() {
        this.handleKeyboardInput();
        this.handleMouseInput();
    }
    
    handleKeyboardInput() {
        const force = 8;
        const forceVector = { x: 0, y: 0, z: 0 };
        
        // WASDキーまたは矢印キー
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            forceVector.z -= force;
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            forceVector.z += force;
        }
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            forceVector.x -= force;
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            forceVector.x += force;
        }
        
        // スペースキーでジャンプ
        if (this.keys['Space']) {
            forceVector.y += force * 3;
        }
        
        // 力が適用されている場合のみボールに力を加える
        if (forceVector.x !== 0 || forceVector.y !== 0 || forceVector.z !== 0) {
            this.ball.applyForce(forceVector);
        }
    }
    
    handleMouseInput() {
        if (this.mouse.isDown) {
            const force = 5;
            const forceVector = {
                x: this.mouse.x * force,
                y: 0,
                z: -Math.abs(this.mouse.y) * force // マウスのY座標をZ方向の力に変換
            };
            
            this.ball.applyForce(forceVector);
        }
    }
    
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
    
    isMouseDown() {
        return this.mouse.isDown;
    }
}
