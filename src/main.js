import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CityBuilder } from './game/CityBuilder';
import { BuildingManager } from './game/BuildingManager';
import { InputHandler } from './game/InputHandler';

class WelcomeScreen {
    
    constructor() {
        this.element = document.createElement('div');
        this.element.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 1000;
            transition: opacity 0.5s ease;
        `;

        const title = document.createElement('h1');
        title.textContent = 'Welcome to 3D City Platform Building Game';
        title.style.cssText = `
            font-size: 3em;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        `;

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.style.cssText = `
            padding: 15px 30px;
            width: 200px;
            height: 60px;
            font-size: 1.5em;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease;
        `;
        startButton.onmouseover = () => startButton.style.background = '#45a049';
        startButton.onmouseout = () => startButton.style.background = '#4CAF50';

        this.element.appendChild(title);
        this.element.appendChild(startButton);
        document.body.appendChild(this.element);
        const subtitle = document.createElement('p');
        subtitle.textContent = 'Made by Pavan Kumar S G (22pt22) and Sivasanjeev S (22pt32)';
        subtitle.style.cssText = `
            font-size: 1.2em;
            margin-top: 20px;
            opacity: 0.8;
            text-align: center;
        `;
        this.element.appendChild(subtitle);
        this.startButton = startButton;
    }

    show() {
        this.element.style.display = 'flex';
        this.element.style.opacity = '1';
    }

    hide() {
        this.element.style.opacity = '0';
        setTimeout(() => {
            this.element.style.display = 'none';
        }, 500);
    }
}

class Game {
    constructor() {
        try {
            console.log('Initializing game...');
            this.welcomeScreen = new WelcomeScreen();
            this.welcomeScreen.show();
            
            // Initialize game state
            this.isGameStarted = false;
            
            // Set up event listener for start button
            this.welcomeScreen.startButton.onclick = () => {
                this.welcomeScreen.hide();
                this.initializeGame();
                this.startGame();
            };
        } catch (error) {
            console.error('Error initializing game:', error);
        }
    }

    initializeGame() {
        try {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setClearColor(0x87CEEB); // Sky blue background
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            
            console.log('Setting up scene...');
            this.init();
            this.setupLights();
            this.createGround();
            
            console.log('Creating managers...');
            this.cityBuilder = new CityBuilder(this.scene);
            this.buildingManager = new BuildingManager(this.scene);
            this.inputHandler = new InputHandler(this.camera, this.scene, this.buildingManager);
            
            this.isGameStarted = true;
        } catch (error) {
            console.error('Error initializing game:', error);
        }
    }

    init() {
        try {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);
            
            this.camera.position.set(20, 20, 20);
            this.camera.lookAt(0, 0, 0);
            
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            
            window.addEventListener('resize', () => this.onWindowResize());
            console.log('Initialization complete');
        } catch (error) {
            console.error('Error in init:', error);
        }
    }

    setupLights() {
        try {
            // Ambient light for general illumination
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            this.scene.add(ambientLight);
            
            // Main directional light (sun)
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(50, 50, 0);
            directionalLight.castShadow = true;
            
            // Configure shadow properties
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            directionalLight.shadow.camera.near = 0.5;
            directionalLight.shadow.camera.far = 500;
            directionalLight.shadow.camera.left = -100;
            directionalLight.shadow.camera.right = 100;
            directionalLight.shadow.camera.top = 100;
            directionalLight.shadow.camera.bottom = -100;
            
            this.scene.add(directionalLight);
            console.log('Lights setup complete');
        } catch (error) {
            console.error('Error in setupLights:', error);
        }
    }

    createGround() {
        try {
            const groundGeometry = new THREE.PlaneGeometry(100, 100);
            const groundMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x2e8b57, // Changed to grass green color
                side: THREE.DoubleSide
            });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = -Math.PI / 2;
            ground.receiveShadow = true;
            ground.userData.isGround = true; // Mark this as the ground plane
            this.scene.add(ground);
            console.log('Ground created');
        } catch (error) {
            console.error('Error in createGround:', error);
        }
    }

    onWindowResize() {
        try {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        } catch (error) {
            console.error('Error in onWindowResize:', error);
        }
    }

    animate() {
        try {
            requestAnimationFrame(() => this.animate());
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        } catch (error) {
            console.error('Error in animate:', error);
        }
    }

    startGame() {
        console.log('Starting animation loop...');
        this.animate();
    }
}

try {
    console.log('Starting game...');
    const game = new Game();
} catch (error) {
    console.error('Error creating game instance:', error);
} 