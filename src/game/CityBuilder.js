import * as THREE from 'three';

export class CityBuilder {
    constructor(scene) {
        this.scene = scene;
        this.gridSize = 10;
        this.grid = new Map();
        this.initializeGrid();
    }

    initializeGrid() {
        // Create a grid system for building placement
        for (let x = -50; x <= 50; x += this.gridSize) {
            for (let z = -50; z <= 50; z += this.gridSize) {
                this.grid.set(`${x},${z}`, null);
            }
        }
    }

    canPlaceBuilding(x, z) {
        const gridX = Math.floor(x / this.gridSize) * this.gridSize;
        const gridZ = Math.floor(z / this.gridSize) * this.gridSize;
        return this.grid.get(`${gridX},${gridZ}`) === null;
    }

    placeBuilding(x, z, building) {
        const gridX = Math.floor(x / this.gridSize) * this.gridSize;
        const gridZ = Math.floor(z / this.gridSize) * this.gridSize;
        
        if (this.canPlaceBuilding(gridX, gridZ)) {
            building.position.set(gridX, 0, gridZ);
            this.scene.add(building);
            this.grid.set(`${gridX},${gridZ}`, building);
            return true;
        }
        return false;
    }

    removeBuilding(x, z) {
        const gridX = Math.floor(x / this.gridSize) * this.gridSize;
        const gridZ = Math.floor(z / this.gridSize) * this.gridSize;
        
        const building = this.grid.get(`${gridX},${gridZ}`);
        if (building) {
            this.scene.remove(building);
            this.grid.set(`${gridX},${gridZ}`, null);
            return true;
        }
        return false;
    }
} 