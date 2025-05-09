import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CityBuilder } from './game/CityBuilder';
import { BuildingManager } from './game/BuildingManager';
import { InputHandler } from './game/InputHandler';

class Game {
    constructor() {
        try {
            console.log('Initializing game...');
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            
            // Add fog to the scene
            const fogColor = 0x87CEEB; // Match sky color
            this.scene.fog = new THREE.FogExp2(fogColor, 0.015); // Exponential fog
            
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setClearColor(fogColor); // Sky blue background matching fog
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
            
            console.log('Starting animation loop...');
            this.animate();
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
}

try {
    console.log('Starting game...');
    const game = new Game();
} catch (error) {
    console.error('Error creating game instance:', error);
} 
