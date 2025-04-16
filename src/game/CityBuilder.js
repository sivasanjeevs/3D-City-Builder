import * as THREE from 'three';

export class CityBuilder {
    constructor(scene) {
        this.scene = scene;
        this.gridSize = 10;
        this.grid = new Map();
        this.placedBuildings = []; // Track all placed buildings
        this.initializeGrid();
    }

    initializeGrid() {
        // Create a grid system for building placement
        for (let x = -50; x <= 200; x += this.gridSize) {
            for (let z = -50; z <= 200; z += this.gridSize) {
                this.grid.set(`${x},${z}`, null);
            }
        }
    }

    getBufferSize(building) {
        // Return different buffer sizes based on building type
        if (building.userData.type === 'skyscraper') {
            return 1; // Smaller buffer for skyscrapers
        } else if (building.userData.type === 'house') {
            // For classic houses, use a smaller buffer since they have pitched roofs
            return 2; // Medium buffer for other house styles
        } else if (building.userData.type === 'tree') {
            return 0.5; // Small buffer for trees
        }
        return 1; // Default buffer
    }

    canPlaceBuilding(x, z, building) {
        // Get the grid position
        const gridX = Math.floor(x / this.gridSize) * this.gridSize;
        const gridZ = Math.floor(z / this.gridSize) * this.gridSize;
        
        // Check if the grid cell is already occupied
        if (this.grid.get(`${gridX},${gridZ}`) !== null) {
            return false;
        }

        // Create a bounding box for the new building
        const newBox = new THREE.Box3().setFromObject(building);
        
        // For classic houses, adjust the bounding box to account for the pitched roof
        if (building.userData.type === 'house' && building.userData.style === 'classic') {
            // The pitched roof extends diagonally, so we need to adjust the box size
            newBox.max.y += 2; // Add extra height for the roof
            newBox.min.y -= 0.5; // Add a small buffer below
        }
        
        newBox.translate(new THREE.Vector3(gridX, 0, gridZ));

        // Get appropriate buffer size for this building type
        const buffer = this.getBufferSize(building);

        // Check collision with all existing buildings
        for (const existingBuilding of this.placedBuildings) {
            const existingBox = new THREE.Box3().setFromObject(existingBuilding);
            
            // For classic houses, adjust the existing building's bounding box too
            if (existingBuilding.userData.type === 'house' && existingBuilding.userData.style === 'classic') {
                existingBox.max.y += 2;
                existingBox.min.y -= 0.5;
            }
            
            // Add buffer zone around buildings
            existingBox.expandByScalar(buffer);
            
            if (newBox.intersectsBox(existingBox)) {
                return false;
            }
        }

        return true;
    }

    placeBuilding(x, z, building) {
        const gridX = Math.floor(x / this.gridSize) * this.gridSize;
        const gridZ = Math.floor(z / this.gridSize) * this.gridSize;
        
        // Check if we can place the building
        if (this.canPlaceBuilding(gridX, gridZ, building)) {
            // Position the building
            building.position.set(gridX, 0, gridZ);
            
            // Add to scene and tracking
            this.scene.add(building);
            this.grid.set(`${gridX},${gridZ}`, building);
            this.placedBuildings.push(building);
            
            // Add visual feedback for placement
            this.showPlacementFeedback(gridX, gridZ, true);
            return true;
        } else {
            // Show visual feedback for invalid placement
            this.showPlacementFeedback(gridX, gridZ, false);
            return false;
        }
    }

    showPlacementFeedback(x, z, isValid) {
        // Remove any existing feedback
        const existingFeedback = this.scene.getObjectByName('placementFeedback');
        if (existingFeedback) {
            this.scene.remove(existingFeedback);
        }

        // Create feedback geometry
        const geometry = new THREE.BoxGeometry(this.gridSize, 0.1, this.gridSize);
        const material = new THREE.MeshBasicMaterial({
            color: isValid ? 0x00ff00 : 0xff0000,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });

        const feedback = new THREE.Mesh(geometry, material);
        feedback.position.set(x, 0.05, z);
        feedback.name = 'placementFeedback';
        this.scene.add(feedback);

        // Remove feedback after a short delay
        setTimeout(() => {
            if (feedback.parent) {
                this.scene.remove(feedback);
            }
        }, 500);
    }

    removeBuilding(x, z) {
        const gridX = Math.floor(x / this.gridSize) * this.gridSize;
        const gridZ = Math.floor(z / this.gridSize) * this.gridSize;
        
        const building = this.grid.get(`${gridX},${gridZ}`);
        if (building) {
            this.scene.remove(building);
            this.grid.set(`${gridX},${gridZ}`, null);
            
            // Remove from placed buildings list
            const index = this.placedBuildings.indexOf(building);
            if (index !== -1) {
                this.placedBuildings.splice(index, 1);
            }
            return true;
        }
        return false;
    }

    getBuildingAt(x, z) {
        const gridX = Math.floor(x / this.gridSize) * this.gridSize;
        const gridZ = Math.floor(z / this.gridSize) * this.gridSize;
        return this.grid.get(`${gridX},${gridZ}`);
    }
} 