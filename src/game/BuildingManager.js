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
        body.receiveShadow = true;
        house.add(body);

        // Modern slanted roof
        const roofGeometry = new THREE.ConeGeometry(4.5, 2, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x424242 }); // Dark gray
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 5;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        roof.receiveShadow = true;
        house.add(roof);

        // Add chimney
        const chimneyGeometry = new THREE.BoxGeometry(0.6, 1.5, 0.6);
        const chimneyMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
        chimney.position.set(1.5, 5.5, 1.5);
        chimney.castShadow = true;
        house.add(chimney);

        // Modern door with frame
        const doorGroup = new THREE.Group();
        const doorFrameGeometry = new THREE.BoxGeometry(1.8, 2.6, 0.2);
        const doorFrameMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50 });
        const doorFrame = new THREE.Mesh(doorFrameGeometry, doorFrameMaterial);
        
        const doorGeometry = new THREE.BoxGeometry(1.5, 2.5, 0.1);
        const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x4A235A });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.z = 0.1;
        
        doorGroup.add(doorFrame);
        doorGroup.add(door);
        doorGroup.position.set(0, 1.3, 3.1);
        house.add(doorGroup);

        // Add steps
        const stepsGroup = new THREE.Group();
        for (let i = 0; i < 3; i++) {
            const stepGeometry = new THREE.BoxGeometry(2, 0.2, 0.5 * (3-i));
            const stepMaterial = new THREE.MeshStandardMaterial({ color: 0x7F8C8D });
            const step = new THREE.Mesh(stepGeometry, stepMaterial);
            step.position.set(0, 0.1 + (i * 0.2), 3 + (i * 0.25));
            step.castShadow = true;
            step.receiveShadow = true;
            stepsGroup.add(step);
        }
        house.add(stepsGroup);

        // Windows with frames and details
        const createDetailedWindow = (x, y, z, rotationY = 0) => {
            const windowGroup = new THREE.Group();
            
            // Window frame
            const frameGeometry = new THREE.BoxGeometry(1.4, 1.4, 0.2);
            const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            windowGroup.add(frame);
            
            // Window glass
            const glassGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.05);
            const glassMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x87CEEB,
                transparent: true,
                opacity: 0.8,
                metalness: 0.8,
                roughness: 0.2
            });
            const glass = new THREE.Mesh(glassGeometry, glassMaterial);
            glass.position.z = 0.05;
            windowGroup.add(glass);
            
            // Window sill
            const sillGeometry = new THREE.BoxGeometry(1.6, 0.2, 0.4);
            const sillMaterial = new THREE.MeshStandardMaterial({ color: 0x7F8C8D });
            const sill = new THREE.Mesh(sillGeometry, sillMaterial);
            sill.position.y = -0.8;
            sill.position.z = 0.1;
            sill.castShadow = true;
            windowGroup.add(sill);
            
            windowGroup.position.set(x, y, z);
            windowGroup.rotation.y = rotationY;
            house.add(windowGroup);
        };

        // Add windows with proper spacing
        createDetailedWindow(-1.8, 2.5, 3.01);
        createDetailedWindow(1.8, 2.5, 3.01);
        createDetailedWindow(-1.8, 2.5, -3.01, Math.PI);
        createDetailedWindow(1.8, 2.5, -3.01, Math.PI);
        createDetailedWindow(-3.01, 2.5, 0, Math.PI / 2);
        createDetailedWindow(3.01, 2.5, 0, -Math.PI / 2);

        return house;
    }

    createSkyscraper(floors = 5) {
        const skyscraper = new THREE.Group();
        const floorHeight = 4;
        const width = 8;
        const depth = 8;
        
        // Expanded color palette for buildings
        const buildingColors = [
            0xE57373, // Light Red
            0x81C784, // Light Green
            0x64B5F6, // Light Blue
            0xFFB74D, // Light Orange
            0xBA68C8, // Light Purple
            0x4DD0E1, // Light Cyan
            0xF06292, // Pink
            0xAED581, // Lime
            0x4FC3F7, // Sky Blue
            0xFFD54F  // Amber
        ];
        
        const buildingColor = buildingColors[Math.floor(Math.random() * buildingColors.length)];
        
        // Main building body
        const bodyGeometry = new THREE.BoxGeometry(width, floorHeight * floors, depth);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: buildingColor,
            metalness: 0.3,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = (floorHeight * floors) / 2;
        body.castShadow = true;
        body.receiveShadow = true;
        skyscraper.add(body);

        // Create detailed window function
        const createDetailedWindow = (x, y, z, rotationY = 0) => {
            const windowGroup = new THREE.Group();
            
            // Outer frame - smaller size
            const outerFrameGeometry = new THREE.BoxGeometry(0.8, 1.6, 0.2);
            const frameMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x2C3E50,
                metalness: 0.6,
                roughness: 0.3
            });
            const outerFrame = new THREE.Mesh(outerFrameGeometry, frameMaterial);
            windowGroup.add(outerFrame);

            // Window divisions (horizontal bars)
            const createBar = (y) => {
                const barGeometry = new THREE.BoxGeometry(0.75, 0.08, 0.1);
                const bar = new THREE.Mesh(barGeometry, frameMaterial);
                bar.position.y = y;
                bar.position.z = 0.05;
                windowGroup.add(bar);
            };
            createBar(0); // Middle bar

            // Window glass panels (2 panels)
            const createGlassPanel = (y) => {
                const glassGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.05);
                const glassMaterial = new THREE.MeshStandardMaterial({ 
                    color: 0x87CEEB,
                    transparent: true,
                    opacity: 0.7,
                    metalness: 0.8,
                    roughness: 0.2
                });
                const glass = new THREE.Mesh(glassGeometry, glassMaterial);
                glass.position.y = y;
                glass.position.z = 0.02;
                windowGroup.add(glass);
            };
            createGlassPanel(0.4);  // Upper panel
            createGlassPanel(-0.4); // Lower panel

            // Window ledge - smaller
            const ledgeGeometry = new THREE.BoxGeometry(0.9, 0.1, 0.3);
            const ledgeMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x95A5A6,
                metalness: 0.4,
                roughness: 0.6
            });
            const ledge = new THREE.Mesh(ledgeGeometry, ledgeMaterial);
            ledge.position.y = -0.85;
            ledge.position.z = 0.15;
            ledge.castShadow = true;
            windowGroup.add(ledge);

            // Decorative top piece - smaller
            const topPieceGeometry = new THREE.BoxGeometry(0.85, 0.15, 0.2);
            const topPiece = new THREE.Mesh(topPieceGeometry, ledgeMaterial);
            topPiece.position.y = 0.85;
            topPiece.position.z = 0.1;
            topPiece.castShadow = true;
            windowGroup.add(topPiece);

            // Side columns - thinner
            const createColumn = (x) => {
                const columnGeometry = new THREE.BoxGeometry(0.1, 1.8, 0.2);
                const column = new THREE.Mesh(columnGeometry, frameMaterial);
                column.position.set(x, 0, 0.1);
                column.castShadow = true;
                windowGroup.add(column);
            };
            createColumn(-0.4);  // Left column
            createColumn(0.4);   // Right column

            windowGroup.position.set(x, y, z);
            windowGroup.rotation.y = rotationY;
            return windowGroup;
        };

        // Add detailed windows to each floor with smaller spacing
        const windowSpacing = 1.2; // Reduced spacing between windows
        for (let floor = 0; floor < floors; floor++) {
            const floorY = floor * floorHeight + 2;
            
            // Front windows - more windows per floor
            for (let x = -3; x <= 3; x += windowSpacing) {
                const frontWindow = createDetailedWindow(x, floorY, depth/2 + 0.01);
                skyscraper.add(frontWindow);
            }
            
            // Back windows - more windows per floor
            for (let x = -3; x <= 3; x += windowSpacing) {
                const backWindow = createDetailedWindow(x, floorY, -depth/2 - 0.01, Math.PI);
                skyscraper.add(backWindow);
            }
            
            // Side windows - more windows per floor
            for (let z = -3; z <= 3; z += windowSpacing) {
                const leftWindow = createDetailedWindow(-width/2 - 0.01, floorY, z, -Math.PI/2);
                skyscraper.add(leftWindow);
                
                const rightWindow = createDetailedWindow(width/2 + 0.01, floorY, z, Math.PI/2);
                skyscraper.add(rightWindow);
            }
        }

        // Simple roof
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

        // Simple rooftop structure
        const rooftopGeometry = new THREE.BoxGeometry(width/2, 2, depth/2);
        const rooftopMaterial = new THREE.MeshStandardMaterial({ 
            color: buildingColor,
            metalness: 0.3,
            roughness: 0.7
        });
        const rooftop = new THREE.Mesh(rooftopGeometry, rooftopMaterial);
        rooftop.position.y = floorHeight * floors + 1.5;
        rooftop.castShadow = true;
        rooftop.receiveShadow = true;
        skyscraper.add(rooftop);

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