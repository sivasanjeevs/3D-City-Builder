export class CityBuilder {
    constructor(scene) {
        this.scene = scene;
        this.placedBuildings = []; // Track all placed buildings
    }

    placeBuilding(x, z, building) {
        // Position the building exactly where clicked
        building.position.set(x, 0, z);
        
        // Add to scene and tracking
        this.scene.add(building);
        this.placedBuildings.push(building);
        
        return true;
    }

    removeBuilding(x, z) {
        // Find building at exact position (or nearby if needed)
        const building = this.placedBuildings.find(b => 
            Math.abs(b.position.x - x) < 0.1 && 
            Math.abs(b.position.z - z) < 0.1
        );
        
        if (building) {
            this.scene.remove(building);
            this.placedBuildings = this.placedBuildings.filter(b => b !== building);
            return true;
        }
        return false;
    }

    getBuildingAt(x, z) {
        return this.placedBuildings.find(b => 
            Math.abs(b.position.x - x) < 0.1 && 
            Math.abs(b.position.z - z) < 0.1
        );
    }
}