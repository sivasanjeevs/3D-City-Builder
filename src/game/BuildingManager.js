import * as THREE from 'three';

export class BuildingManager {
    constructor(scene) {
        this.scene = scene;
        this.buildingTypes = {
            house: this.createHouse,
            skyscraper: this.createSkyscraper,
            tree: this.createTree
        };
        this.placedBuildings = [];
        this.houseColors = [
            0xFFE4B5, // Light peach
            0xFFB6C1, // Light pink
            0xE0FFFF, // Light cyan
            0xF0FFF0, // Honeydew
            0xFFF0F5, // Lavender blush
            0xF0F8FF, // Alice blue
            0xFFFACD, // Lemon chiffon
            0xE6E6FA, // Lavender
            0xFFF5EE, // Seashell
            0xF5F5F5, // White smoke
            0xFFDAB9, // Peach puff
            0xFFE4E1, // Misty rose
            0xE6E6FA, // Lavender
            0xFFF8DC, // Cornsilk
            0xFAFAD2, // Light goldenrod
            0xF0E68C, // Khaki
            0xFFE4C4, // Bisque
            0xFFDEAD, // Navajo white
            0xF5DEB3, // Wheat
            0xD2B48C  // Tan
        ];
        this.skyscraperColors = [
            0xE6E6FA, // Lavender
            0xE0FFFF, // Light cyan
            0xF0F8FF, // Alice blue
            0xFFF0F5, // Lavender blush
            0xF0FFF0, // Honeydew
            0xFFFACD, // Lemon chiffon
            0xFFE4B5, // Light peach
            0xFFB6C1, // Light pink
            0xFFF5EE, // Seashell
            0xF5F5F5, // White smoke
            0x87CEEB, // Sky blue
            0x98FB98, // Pale green
            0xAFEEEE, // Pale turquoise
            0xB0E0E6, // Powder blue
            0xE0FFFF, // Light cyan
            0xF0FFF0, // Honeydew
            0xF5FFFA, // Mint cream
            0xF0FFFF, // Azure
            0xF0F8FF, // Alice blue
            0xF8F8FF  // Ghost white
        ];
    }

    getRandomColor(colors) {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createHouse() {
        const house = new THREE.Group();
        const houseColor = this.getRandomColor(this.houseColors);

        // House body with clean lines
        const bodyGeometry = new THREE.BoxGeometry(6, 4, 6);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: houseColor,
            metalness: 0.2,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 2;
        body.castShadow = true;
        body.receiveShadow = true;
        house.add(body);

        // Flat roof
        const roofGeometry = new THREE.BoxGeometry(7, 0.5, 7);
        const roofMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x424242,
            metalness: 0.3,
            roughness: 0.8
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 4.25;
        roof.castShadow = true;
        roof.receiveShadow = true;
        house.add(roof);

        // Add chimney
        const chimneyGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.8);
        const chimneyMaterial = new THREE.MeshStandardMaterial({
            color: 0x424242,
            metalness: 0.4,
            roughness: 0.8
        });
        const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
        chimney.position.set(2.5, 5, 2.5);
        chimney.castShadow = true;
        chimney.receiveShadow = true;
        house.add(chimney);

        // Chimney cap
        const capGeometry = new THREE.BoxGeometry(1, 0.2, 1);
        const capMaterial = new THREE.MeshStandardMaterial({
            color: 0x2C3E50,
            metalness: 0.5,
            roughness: 0.7
        });
        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.set(2.5, 5.85, 2.5);
        cap.castShadow = true;
        cap.receiveShadow = true;
        house.add(cap);

        // Windows
        const createWindow = (x, y, z) => {
            const windowGroup = new THREE.Group();
            
            // Main window frame - reduced size
            const frameGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.2);
            const frameMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x2C3E50,
                metalness: 0.6,
                roughness: 0.3
            });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            windowGroup.add(frame);
            
            // Window dividers (cross pattern) - adjusted for new size
            const dividerGeometry = new THREE.BoxGeometry(0.1, 1.2, 0.2);
            const dividerMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x2C3E50,
                metalness: 0.6,
                roughness: 0.3
            });
            
            // Vertical divider
            const verticalDivider = new THREE.Mesh(dividerGeometry, dividerMaterial);
            windowGroup.add(verticalDivider);
            
            // Horizontal divider
            const horizontalDivider = new THREE.Mesh(dividerGeometry, dividerMaterial);
            horizontalDivider.rotation.z = Math.PI / 2;
            windowGroup.add(horizontalDivider);
            
            // Window panes (4 sections) - adjusted for new size
            const paneGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
            const paneMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x87CEEB,
                transparent: true,
                opacity: 0.8,
                metalness: 0.8,
                roughness: 0.2
            });
            
            // Create 4 panes - adjusted positions for new size
            const panePositions = [
                [-0.3, 0.3, 0.15],
                [0.3, 0.3, 0.15],
                [-0.3, -0.3, 0.15],
                [0.3, -0.3, 0.15]
            ];
            
            panePositions.forEach(pos => {
                const pane = new THREE.Mesh(paneGeometry, paneMaterial);
                pane.position.set(...pos);
                windowGroup.add(pane);
            });
            
            // Window sill - adjusted for new size
            const sillGeometry = new THREE.BoxGeometry(1.4, 0.1, 0.3);
            const sillMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x2C3E50,
                metalness: 0.4,
                roughness: 0.6
            });
            const sill = new THREE.Mesh(sillGeometry, sillMaterial);
            sill.position.y = -0.65;
            sill.position.z = 0.15;
            windowGroup.add(sill);
            
            windowGroup.position.set(x, y, z);
            house.add(windowGroup);
        };

        // Add windows - adjusted positions for new size
        createWindow(-1.2, 2.5, 3.01);
        createWindow(1.2, 2.5, 3.01);
        createWindow(-1.2, 2.5, -3.01);
        createWindow(1.2, 2.5, -3.01);

        // Door
        const doorGeometry = new THREE.BoxGeometry(1.5, 2.5, 0.2);
        const doorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2C3E50,
            metalness: 0.5,
            roughness: 0.5
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.25, 3.1);
        house.add(door);

        return house;
    }

    createSkyscraper(floors = 5) {
        const skyscraper = new THREE.Group();
        const floorHeight = 4;
        const width = 8;
        const depth = 8;
        const skyscraperColor = this.getRandomColor(this.skyscraperColors);
        
        // Main building body
        const bodyGeometry = new THREE.BoxGeometry(width, floorHeight * floors, depth);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: skyscraperColor,
            metalness: 0.3,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = (floorHeight * floors) / 2;
        body.castShadow = true;
        body.receiveShadow = true;
        skyscraper.add(body);

        // Create window function for skyscraper
        const createWindow = (x, y, z, rotationY = 0) => {
            const windowGroup = new THREE.Group();
            
            // Main window frame - modern slim design
            const frameGeometry = new THREE.BoxGeometry(0.8, 1.6, 0.1);
            const frameMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x1A1A1A, // Dark gray for modern look
                metalness: 0.8,
                roughness: 0.2
            });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            windowGroup.add(frame);
            
            // Modern window grid pattern
            const gridMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x1A1A1A,
                    metalness: 0.8,
                    roughness: 0.2
            });
            
            // Vertical grid lines
            for (let i = -0.3; i <= 0.3; i += 0.3) {
                const gridLineGeometry = new THREE.BoxGeometry(0.02, 1.6, 0.1);
                const gridLine = new THREE.Mesh(gridLineGeometry, gridMaterial);
                gridLine.position.x = i;
                windowGroup.add(gridLine);
            }
            
            // Horizontal grid lines
            for (let i = -0.6; i <= 0.6; i += 0.4) {
                const gridLineGeometry = new THREE.BoxGeometry(0.8, 0.02, 0.1);
                const gridLine = new THREE.Mesh(gridLineGeometry, gridMaterial);
                gridLine.position.y = i;
                windowGroup.add(gridLine);
            }
            
            // Modern glass panels
            const glassGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.05);
                const glassMaterial = new THREE.MeshStandardMaterial({ 
                    color: 0x87CEEB,
                    transparent: true,
                opacity: 0.6,
                metalness: 0.9,
                roughness: 0.1
            });
            
            // Create glass panels in a grid pattern
            const glassPositions = [
                [-0.3, 0.6, 0.02], [0, 0.6, 0.02], [0.3, 0.6, 0.02],
                [-0.3, 0.2, 0.02], [0, 0.2, 0.02], [0.3, 0.2, 0.02],
                [-0.3, -0.2, 0.02], [0, -0.2, 0.02], [0.3, -0.2, 0.02],
                [-0.3, -0.6, 0.02], [0, -0.6, 0.02], [0.3, -0.6, 0.02]
            ];
            
            glassPositions.forEach(pos => {
                const glass = new THREE.Mesh(glassGeometry, glassMaterial);
                glass.position.set(...pos);
                windowGroup.add(glass);
            });

            // Modern window ledge
            const ledgeGeometry = new THREE.BoxGeometry(0.9, 0.05, 0.2);
            const ledgeMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x1A1A1A,
                metalness: 0.8,
                roughness: 0.2
            });
            const ledge = new THREE.Mesh(ledgeGeometry, ledgeMaterial);
            ledge.position.y = -0.85;
            ledge.position.z = 0.05;
            windowGroup.add(ledge);

            // Add reflective highlights
            const highlightGeometry = new THREE.BoxGeometry(0.8, 1.6, 0.01);
            const highlightMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.2,
                metalness: 1.0,
                roughness: 0.1
            });
            const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
            highlight.position.z = 0.05;
            windowGroup.add(highlight);

            windowGroup.position.set(x, y, z);
            windowGroup.rotation.y = rotationY;
            return windowGroup;
        };

        // Add windows to each floor
        const windowSpacing = 1.2;
        for (let floor = 0; floor < floors; floor++) {
            const floorY = floor * floorHeight + 2;
            
            // Front windows
            for (let x = -3; x <= 3; x += windowSpacing) {
                skyscraper.add(createWindow(x, floorY, depth/2 + 0.01));
            }
            
            // Back windows
            for (let x = -3; x <= 3; x += windowSpacing) {
                skyscraper.add(createWindow(x, floorY, -depth/2 - 0.01, Math.PI));
            }
            
            // Side windows
            for (let z = -3; z <= 3; z += windowSpacing) {
                skyscraper.add(createWindow(-width/2 - 0.01, floorY, z, -Math.PI/2));
                skyscraper.add(createWindow(width/2 + 0.01, floorY, z, Math.PI/2));
            }
        }

        // Roof
        const roofGeometry = new THREE.BoxGeometry(width + 0.2, 0.5, depth + 0.2);
        const roofMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x424242,
            metalness: 0.5,
            roughness: 0.5
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = floorHeight * floors + 0.25;
        roof.castShadow = true;
        roof.receiveShadow = true;
        skyscraper.add(roof);

        return skyscraper;
    }

    createTree() {
        const tree = new THREE.Group();

        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            metalness: 0.1,
            roughness: 0.9
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        tree.add(trunk);

        // Tree leaves with multiple layers
        const leafColors = [0x228B22, 0x2E8B57, 0x3CB371];
        const leafSizes = [2, 1.5, 1];
        
        for (let i = 0; i < 3; i++) {
            const leafGeometry = new THREE.ConeGeometry(leafSizes[i], 2, 8);
            const leafMaterial = new THREE.MeshStandardMaterial({ 
                color: leafColors[i],
                flatShading: true
            });
            const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
            leaves.position.y = 2 + i * 1.5;
            leaves.castShadow = true;
            leaves.receiveShadow = true;
            tree.add(leaves);
        }

        // Random rotation and slight scale variation
        tree.rotation.y = Math.random() * Math.PI * 2;
        const scale = 0.8 + Math.random() * 0.4;
        tree.scale.set(scale, scale, scale);

        return tree;
    }

    createBuilding(type, style = 'modern', options = {}) {
        if (!this.buildingTypes[type]) {
            console.error(`Invalid building type: ${type}`);
            return null;
        }

        const building = this.buildingTypes[type].call(this, options.floors);
        
        building.userData = {
            type: type,
            floors: options.floors || 1
        };

        return building;
    }

    placeBuilding(x, z, building) {
        building.position.set(x, 0, z);
        this.scene.add(building);
        this.placedBuildings.push(building);
        return true;
    }

    removeBuilding(x, z) {
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
