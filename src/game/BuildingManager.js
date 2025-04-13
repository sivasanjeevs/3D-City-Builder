import * as THREE from 'three';

export class BuildingManager {
    constructor(scene) {
        this.scene = scene;
        this.buildingTypes = {
            house: this.createHouse,
            skyscraper: this.createSkyscraper
        };
    }

    createHouse() {
        const house = new THREE.Group();

        // Main house body
        const bodyGeometry = new THREE.BoxGeometry(6, 4, 6);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xE0E0E0 }); // Light gray modern color
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 2;
        body.castShadow = true;
        house.add(body);

        // Modern flat roof
        const roofGeometry = new THREE.BoxGeometry(6.2, 0.2, 6.2);
        const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x424242 }); // Dark gray
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 4.1;
        roof.castShadow = true;
        house.add(roof);

        // Modern door
        const doorGeometry = new THREE.PlaneGeometry(1.5, 2.5);
        const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50 }); // Dark blue-gray
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.25, 3.01);
        house.add(door);

        // Windows with modern design
        const createWindow = (x, y, z, rotationY = 0) => {
            const windowGroup = new THREE.Group();
            
            // Window frame (smaller)
            const frameGeometry = new THREE.PlaneGeometry(1.2, 1.2);
            const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            windowGroup.add(frame);
            
            // Window glass (smaller)
            const glassGeometry = new THREE.PlaneGeometry(1.1, 1.1);
            const glassMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x87CEEB,
                transparent: true,
                opacity: 0.8
            });
            const glass = new THREE.Mesh(glassGeometry, glassMaterial);
            glass.position.z = 0.01;
            windowGroup.add(glass);
            
            windowGroup.position.set(x, y, z);
            windowGroup.rotation.y = rotationY;
            house.add(windowGroup);
        };

        // Front windows (arranged in a modern pattern)
        createWindow(-1.8, 2.5, 3.01);
        createWindow(1.8, 2.5, 3.01);
        createWindow(-1.8, 1, 3.01);
        createWindow(1.8, 1, 3.01);

        // Back windows
        createWindow(-1.8, 2.5, -3.01, Math.PI);
        createWindow(1.8, 2.5, -3.01, Math.PI);
        createWindow(-1.8, 1, -3.01, Math.PI);
        createWindow(1.8, 1, -3.01, Math.PI);

        // Side windows
        createWindow(-3.01, 2.5, 0, Math.PI / 2);
        createWindow(3.01, 2.5, 0, -Math.PI / 2);
        createWindow(-3.01, 1, 0, Math.PI / 2);
        createWindow(3.01, 1, 0, -Math.PI / 2);

        return house;
    }

    createSkyscraper(floors = 5) {
        const skyscraper = new THREE.Group();
        const floorHeight = 4;
        const width = 8;
        const depth = 8;
        
        // Modern building colors
        const buildingColors = [
            0xE0E0E0, // Light Gray
            0x90A4AE, // Blue Gray
            0x455A64, // Dark Blue Gray
            0x37474F, // Darker Blue Gray
            0x263238, // Almost Black
            0x546E7A, // Medium Blue Gray
            0x78909C, // Light Blue Gray
            0x607D8B, // Blue Gray
            0x455A64, // Dark Blue Gray
            0x37474F  // Darker Blue Gray
        ];
        
        // Randomly select a color for the building
        const buildingColor = buildingColors[Math.floor(Math.random() * buildingColors.length)];
        
        // Main building body with modern proportions
        const bodyGeometry = new THREE.BoxGeometry(width, floorHeight * floors, depth);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: buildingColor });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = (floorHeight * floors) / 2;
        body.castShadow = true;
        skyscraper.add(body);

        // Add modern window grid
        const windowSize = 0.8;
        const windowSpacing = 1.2;
        const windowMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.8
        });
        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50 });

        // Create window grid for each side
        for (let floor = 0; floor < floors; floor++) {
            for (let i = -3; i <= 3; i += windowSpacing) {
                // Front windows
                const frontWindow = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowSize, windowSize),
                    windowMaterial
                );
                frontWindow.position.set(i, floor * floorHeight + 2, depth/2 + 0.01);
                skyscraper.add(frontWindow);

                // Back windows
                const backWindow = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowSize, windowSize),
                    windowMaterial
                );
                backWindow.position.set(i, floor * floorHeight + 2, -depth/2 - 0.01);
                backWindow.rotation.y = Math.PI;
                skyscraper.add(backWindow);

                // Side windows
                const leftWindow = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowSize, windowSize),
                    windowMaterial
                );
                leftWindow.position.set(-width/2 - 0.01, floor * floorHeight + 2, i);
                leftWindow.rotation.y = -Math.PI/2;
                skyscraper.add(leftWindow);

                const rightWindow = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowSize, windowSize),
                    windowMaterial
                );
                rightWindow.position.set(width/2 + 0.01, floor * floorHeight + 2, i);
                rightWindow.rotation.y = Math.PI/2;
                skyscraper.add(rightWindow);
            }
        }

        // Add modern rooftop
        const roofGeometry = new THREE.BoxGeometry(width + 0.2, 0.5, depth + 0.2);
        const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x424242 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = floorHeight * floors + 0.25;
        skyscraper.add(roof);

        return skyscraper;
    }

    createBuilding(type, options = {}) {
        if (this.buildingTypes[type]) {
            const building = this.buildingTypes[type](options.floors);
            this.scene.add(building);
            return building;
        }
        return null;
    }
} 