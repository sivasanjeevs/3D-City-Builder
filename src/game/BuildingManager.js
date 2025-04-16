import * as THREE from 'three';

export class BuildingManager {
    constructor(scene) {
        this.scene = scene;
        this.buildingTypes = {
            house: {
                modern: this.createModernHouse,
                classic: this.createClassicHouse,
                futuristic: this.createFuturisticHouse
            },
            skyscraper: {
                modern: this.createModernSkyscraper,
                classic: this.createClassicSkyscraper,
                futuristic: this.createFuturisticSkyscraper
            },
            tree: {
                modern: this.createTree,
                classic: this.createTree,
                futuristic: this.createTree
            }
        };
        this.placedBuildings = [];
    }


    createModernHouse() {
        const house = new THREE.Group();

        // Modern house body with clean lines
        const bodyGeometry = new THREE.BoxGeometry(6, 4, 6);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xE0E0E0,
            metalness: 0.2,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 2;
        body.castShadow = true;
        body.receiveShadow = true;
        house.add(body);

        // Modern flat roof
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

        // Large modern windows
        const createModernWindow = (x, y, z) => {
            const windowGroup = new THREE.Group();
            
            // Window frame
            const frameGeometry = new THREE.BoxGeometry(2, 2, 0.2);
            const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            windowGroup.add(frame);
            
            // Window glass
            const glassGeometry = new THREE.BoxGeometry(1.8, 1.8, 0.1);
            const glassMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x87CEEB,
                transparent: true,
                opacity: 0.8,
                metalness: 0.8,
                roughness: 0.2
            });
            const glass = new THREE.Mesh(glassGeometry, glassMaterial);
            glass.position.z = 0.15;
            windowGroup.add(glass);
            
            windowGroup.position.set(x, y, z);
            house.add(windowGroup);
        };

        // Add windows
        createModernWindow(-1.8, 2.5, 3.01);
        createModernWindow(1.8, 2.5, 3.01);
        createModernWindow(-1.8, 2.5, -3.01);
        createModernWindow(1.8, 2.5, -3.01);

        // Modern door
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

    createClassicHouse() {
        const house = new THREE.Group();

        // Classic house body with pitched roof
        const bodyGeometry = new THREE.BoxGeometry(6, 4, 6);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            metalness: 0.1,
            roughness: 0.9
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 2;
        body.castShadow = true;
        body.receiveShadow = true;
        house.add(body);

        // Classic pitched roof
        const roofGeometry = new THREE.ConeGeometry(4.5, 2, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B0000,
            metalness: 0.1,
            roughness: 0.9
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 5;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        roof.receiveShadow = true;
        house.add(roof);

        // Classic windows
        const createClassicWindow = (x, y, z) => {
            const windowGroup = new THREE.Group();
            
            // Window frame
            const frameGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.2);
            const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            windowGroup.add(frame);
            
            // Window panes
            const paneGeometry = new THREE.BoxGeometry(1.1, 0.7, 0.1);
            const paneMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x87CEEB,
                transparent: true,
                opacity: 0.8
            });
            
            // Add two panes
            const pane1 = new THREE.Mesh(paneGeometry, paneMaterial);
            pane1.position.set(0, 0.2, 0.15);
            windowGroup.add(pane1);
            
            const pane2 = new THREE.Mesh(paneGeometry, paneMaterial);
            pane2.position.set(0, -0.2, 0.15);
            windowGroup.add(pane2);
            
            windowGroup.position.set(x, y, z);
            house.add(windowGroup);
        };

        // Add windows
        createClassicWindow(-1.8, 2.5, 3.01);
        createClassicWindow(1.8, 2.5, 3.01);
        createClassicWindow(-1.8, 2.5, -3.01);
        createClassicWindow(1.8, 2.5, -3.01);

        // Classic door
        const doorGeometry = new THREE.BoxGeometry(1.2, 2.2, 0.2);
        const doorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4A235A,
            metalness: 0.1,
            roughness: 0.9
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.1, 3.1);
        house.add(door);

        return house;
    }

    createFuturisticHouse() {
        const house = new THREE.Group();

        // Futuristic house body with geometric shapes
        const bodyGeometry = new THREE.BoxGeometry(6, 4, 6);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF,
            metalness: 0.8,
            roughness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 2;
        body.castShadow = true;
        body.receiveShadow = true;
        house.add(body);

        // Futuristic roof with solar panels
        const roofGeometry = new THREE.BoxGeometry(7, 0.3, 7);
        const roofMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1A1A1A,
            metalness: 0.9,
            roughness: 0.1
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 4.15;
        roof.castShadow = true;
        roof.receiveShadow = true;
        house.add(roof);

        // Solar panels
        const solarPanelGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const solarPanelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            metalness: 0.9,
            roughness: 0.1
        });
        
        for (let i = -2; i <= 2; i += 1) {
            for (let j = -2; j <= 2; j += 1) {
                const solarPanel = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
                solarPanel.position.set(i, 4.3, j);
                house.add(solarPanel);
            }
        }

        // Futuristic windows
        const createFuturisticWindow = (x, y, z) => {
            const windowGroup = new THREE.Group();
            
            // Window frame
            const frameGeometry = new THREE.BoxGeometry(2, 2, 0.2);
            const frameMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x1A1A1A,
                metalness: 0.9,
                roughness: 0.1
            });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            windowGroup.add(frame);
            
            // Window glass with futuristic pattern
            const glassGeometry = new THREE.BoxGeometry(1.9, 1.9, 0.1);
            const glassMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x00FFFF,
                transparent: true,
                opacity: 0.7,
                metalness: 0.9,
                roughness: 0.1
            });
            const glass = new THREE.Mesh(glassGeometry, glassMaterial);
            glass.position.z = 0.15;
            windowGroup.add(glass);
            
            windowGroup.position.set(x, y, z);
            house.add(windowGroup);
        };

        // Add windows
        createFuturisticWindow(-1.8, 2.5, 3.01);
        createFuturisticWindow(1.8, 2.5, 3.01);
        createFuturisticWindow(-1.8, 2.5, -3.01);
        createFuturisticWindow(1.8, 2.5, -3.01);

        // Futuristic door
        const doorGeometry = new THREE.BoxGeometry(1.5, 2.5, 0.2);
        const doorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1A1A1A,
            metalness: 0.9,
            roughness: 0.1
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.25, 3.1);
        house.add(door);

        return house;
    }

    createModernSkyscraper(floors = 5) {
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

    createClassicSkyscraper(floors = 5) {
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

    createFuturisticSkyscraper(floors = 5) {
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

    createTree() {
        const tree = new THREE.Group();

        // Create tree trunk
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

        // Create tree leaves with multiple layers
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
        if (!this.buildingTypes[type] || !this.buildingTypes[type][style]) {
            console.error(`Invalid building type or style: ${type}, ${style}`);
            return null;
        }

        const building = this.buildingTypes[type][style](options.floors);
        
        // Add basic user data
        building.userData = {
            type: type,
            style: style,
            floors: options.floors || 1
        };

        return building;
    }

    placeBuilding(x, z, building) {
        // Directly position the building without any constraints
        building.position.set(x, 0, z);
        
        // Add to scene and tracking
        this.scene.add(building);
        this.placedBuildings.push(building);
        
        return true;
    }

    removeBuilding(x, z) {
        // Find building at exact position (or nearby)
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
