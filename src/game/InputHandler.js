import * as THREE from 'three';
import { CityBuilder } from './CityBuilder';

// Building type definitions
const BuildingTypes = {
    HOUSE: 'house',
    SKYSCRAPER: 'skyscraper',
    ROAD: 'road',
    TREE: 'tree'
};

const BuildingStyles = {
    MODERN: 'modern',
    CLASSIC: 'classic',
    FUTURISTIC: 'futuristic'
};

export class InputHandler {
    constructor(camera, scene, buildingManager) {
        this.camera = camera;
        this.scene = scene;
        this.buildingManager = buildingManager;
        this.cityBuilder = new CityBuilder(scene);
        this.isDrawing = false;
        this.startPoint = null;
        this.currentRoad = null;
        this.roads = [];
        this.buildings = [];
        this.selectedBuildingType = BuildingTypes.HOUSE;
        this.selectedBuildingStyle = BuildingStyles.MODERN;
        this.selectedFloors = 5;
        this.isDeleteMode = false;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('mousedown', (event) => this.onMouseDown(event));
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('mouseup', () => this.onMouseUp());
        window.addEventListener('keydown', (event) => this.onKeyDown(event));

        // Building type selection
        document.getElementById('build-house').addEventListener('click', () => {
            this.setBuildingType(BuildingTypes.HOUSE);
        });
        
        document.getElementById('build-road').addEventListener('click', () => {
            this.setBuildingType(BuildingTypes.ROAD);
        });

        document.getElementById('build-skyscraper').addEventListener('click', () => {
            this.setBuildingType(BuildingTypes.SKYSCRAPER);
        });

        document.getElementById('build-tree').addEventListener('click', () => {
            this.setBuildingType(BuildingTypes.TREE);
        });

        document.getElementById('delete-btn').addEventListener('click', () => {
            this.toggleDeleteMode();
        });

        document.getElementById('floors-select').addEventListener('change', (event) => {
            this.selectedFloors = parseInt(event.target.value);
        });

        // Building style selection
        document.getElementById('building-style').addEventListener('change', (event) => {
            this.setBuildingStyle(event.target.value);
        });
    }

    setBuildingType(type) {
        this.selectedBuildingType = type;
        this.isDeleteMode = false;
        
        // Update UI
        document.getElementById('delete-btn').classList.remove('active');
        document.getElementById('build-house').classList.remove('active');
        document.getElementById('build-skyscraper').classList.remove('active');
        document.getElementById('build-road').classList.remove('active');
        document.getElementById('build-tree').classList.remove('active');
        
        // Activate the selected button
        document.getElementById(`build-${type}`).classList.add('active');
    }

    setBuildingStyle(style) {
        if (Object.values(BuildingStyles).includes(style)) {
            this.selectedBuildingStyle = style;
        }
    }

    toggleDeleteMode() {
        this.isDeleteMode = !this.isDeleteMode;
        document.getElementById('delete-btn').classList.toggle('active');
        
        // Deactivate all building type buttons
        document.getElementById('build-house').classList.remove('active');
        document.getElementById('build-skyscraper').classList.remove('active');
        document.getElementById('build-road').classList.remove('active');
        document.getElementById('build-tree').classList.remove('active');
        
        if (this.isDeleteMode) {
            this.selectedBuildingType = null;
        }
    }

    createRoadMarkings(road) {
        const markings = new THREE.Group();
        const roadLength = road.geometry.parameters.width;
        const dashLength = 2;
        const gapLength = 2;
        const totalLength = dashLength + gapLength;
        const numDashes = Math.floor(roadLength / totalLength);
        
        // Create footpaths (sidewalks) with clear boundaries
        const footpathWidth = 1.5;
        const footpathHeight = 0.1;
        const footpathOffset = 1.2; // Distance from road center to footpath
        
        // Left footpath
        const leftFootpathGeometry = new THREE.BoxGeometry(roadLength, footpathHeight, footpathWidth);
        const footpathMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC }); // Light gray color
        const leftFootpath = new THREE.Mesh(leftFootpathGeometry, footpathMaterial);
        leftFootpath.position.set(0, 0.05, -(footpathOffset + footpathWidth/2));
        leftFootpath.castShadow = true;
        leftFootpath.receiveShadow = true;
        markings.add(leftFootpath);
        
        // Right footpath
        const rightFootpathGeometry = new THREE.BoxGeometry(roadLength, footpathHeight, footpathWidth);
        const rightFootpath = new THREE.Mesh(rightFootpathGeometry, footpathMaterial);
        rightFootpath.position.set(0, 0.05, footpathOffset + footpathWidth/2);
        rightFootpath.castShadow = true;
        rightFootpath.receiveShadow = true;
        markings.add(rightFootpath);
        
        // Center line (dotted)
        for (let i = 0; i < numDashes; i++) {
            const dashGeometry = new THREE.BoxGeometry(dashLength, 0.1, 0.2);
            const dashMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Yellow center line
            const dash = new THREE.Mesh(dashGeometry, dashMaterial);
            dash.position.set(
                -roadLength/2 + i * totalLength + dashLength/2,
                0.1,
                0
            );
            dash.castShadow = true;
            dash.receiveShadow = true;
            markings.add(dash);
        }
        
        // Side lines (solid)
        const sideLineGeometry = new THREE.BoxGeometry(roadLength, 0.1, 0.2);
        const sideLineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White side lines
        
        const leftLine = new THREE.Mesh(sideLineGeometry, sideLineMaterial);
        leftLine.position.set(0, 0.1, -0.9);
        leftLine.castShadow = true;
        leftLine.receiveShadow = true;
        markings.add(leftLine);
        
        const rightLine = new THREE.Mesh(sideLineGeometry, sideLineMaterial);
        rightLine.position.set(0, 0.1, 0.9);
        rightLine.castShadow = true;
        rightLine.receiveShadow = true;
        markings.add(rightLine);

        // Add street lights
        const lightSpacing = 10;
        const numLights = Math.floor(roadLength / lightSpacing);
        
        for (let i = 0; i < numLights; i++) {
            const lightGroup = new THREE.Group();
            
            // Light pole
            const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
            const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const pole = new THREE.Mesh(poleGeometry, poleMaterial);
            pole.position.y = 2.5;
            pole.castShadow = true;
            pole.receiveShadow = true;
            lightGroup.add(pole);
            
            // Light head
            const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const headMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xffffcc,
                emissive: 0xffffcc,
                emissiveIntensity: 1
            });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = 5;
            head.castShadow = true;
            lightGroup.add(head);
            
            // Position the light alternating between left and right sides
            const side = i % 2 === 0 ? -1 : 1;
            lightGroup.position.set(
                -roadLength/2 + i * lightSpacing + lightSpacing/2,
                0,
                (1 + footpathWidth) * side
            );
            
            // Add point light with shadow
            const pointLight = new THREE.PointLight(0xffffcc, 1, 10);
            pointLight.position.copy(head.position);
            pointLight.castShadow = true;
            pointLight.shadow.mapSize.width = 512;
            pointLight.shadow.mapSize.height = 512;
            lightGroup.add(pointLight);
            
            markings.add(lightGroup);
        }

        // Add cars with shadows
        const carSpacing = 15;
        const numCars = Math.floor(roadLength / carSpacing);
        
        for (let i = 0; i < numCars; i++) {
            const carGroup = new THREE.Group();
            
            // Car body
            const bodyGeometry = new THREE.BoxGeometry(1.5, 0.5, 0.8);
            const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red car
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 0.25;
            body.castShadow = true;
            body.receiveShadow = true;
            carGroup.add(body);
            
            // Car windows
            const windowGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.8);
            const windowMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x87CEEB,
                transparent: true,
                opacity: 0.8
            });
            const windows = new THREE.Mesh(windowGeometry, windowMaterial);
            windows.position.y = 0.5;
            windows.castShadow = true;
            carGroup.add(windows);
            
            // Wheels with shadows
            const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
            const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
            
            const wheelPositions = [
                [-0.5, 0, -0.4],
                [0.5, 0, -0.4],
                [-0.5, 0, 0.4],
                [0.5, 0, 0.4]
            ];
            
            wheelPositions.forEach(pos => {
                const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
                wheel.position.set(...pos);
                wheel.rotation.x = Math.PI / 2;
                wheel.castShadow = true;
                wheel.receiveShadow = true;
                carGroup.add(wheel);
            });
            
            // Position the car on the right lane
            const lane = i % 2 === 0 ? 0.4 : -0.4; // Alternate between lanes
            carGroup.position.set(
                -roadLength/2 + i * carSpacing,
                0,
                lane
            );
            
            this.scene.add(carGroup);
            this.animateCar(carGroup, roadLength, lane);
            markings.add(carGroup);
        }

        // Add walking people with shadows
        const peopleSpacing = 4;
        const numPeople = Math.floor(roadLength / peopleSpacing) * 2;
        
        for (let i = 0; i < numPeople; i++) {
            const personGroup = new THREE.Group();
            
            // Person body
            const bodyGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
            const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 0.4;
            body.castShadow = true;
            body.receiveShadow = true;
            personGroup.add(body);
            
            // Person head
            const headGeometry = new THREE.SphereGeometry(0.15, 16, 16);
            const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = 0.9;
            head.castShadow = true;
            head.receiveShadow = true;
            personGroup.add(head);
            
            // Position the person on either the left or right footpath
            const side = i % 2 === 0 ? -1 : 1;
            const footpathZ = (footpathOffset + footpathWidth/2) * side;
            
            // Ensure people are within the footpath bounds
            const xPosition = Math.max(-roadLength/2, Math.min(roadLength/2, -roadLength/2 + (i * peopleSpacing)));
            personGroup.position.set(
                xPosition,
                0,
                footpathZ
            );
            
            personGroup.userData = {
                footpathZ: footpathZ,
                minX: -roadLength/2,
                maxX: roadLength/2,
                side: side
            };
            
            this.scene.add(personGroup);
            this.animatePerson(personGroup, roadLength);
            markings.add(personGroup);
        }
        
        return markings;
    }

    animateCar(car, roadLength, lane) {
        const speed = 0.05;
        let direction = lane === 0.4 ? 1 : -1; // Cars in right lane go forward, left lane backward
        
        const animate = () => {
            car.position.x += speed * direction;
            
            // Reset position when car reaches end of road
            if (direction === 1 && car.position.x > roadLength/2) {
                car.position.x = -roadLength/2;
            } else if (direction === -1 && car.position.x < -roadLength/2) {
                car.position.x = roadLength/2;
            }
            
            requestAnimationFrame(animate);
        };
        animate();
    }

    animatePerson(person, roadLength) {
        const speed = 0.02;
        let direction = 1;
        
        const animate = () => {
            // Calculate next position
            const nextX = person.position.x + (speed * direction);
            
            // Check if next position would be within bounds
            if (nextX > person.userData.maxX) {
                direction = -1;
                person.rotation.y = Math.PI;
            } else if (nextX < person.userData.minX) {
                direction = 1;
                person.rotation.y = 0;
            }
            
            // Update position with boundary check
            person.position.x += speed * direction;
            
            // Ensure Z position stays exactly on footpath
            person.position.z = person.userData.footpathZ;
            
            requestAnimationFrame(animate);
        };
        animate();
    }

    createTree(position) {
        const treeGroup = new THREE.Group();
        
        // Tree trunk with shadow
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        treeGroup.add(trunk);
        
        // Tree leaves with shadows
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
            treeGroup.add(leaves);
        }
        
        treeGroup.position.copy(position);
        treeGroup.position.y = 0;
        treeGroup.rotation.y = Math.random() * Math.PI * 2;
        
        const scale = 0.8 + Math.random() * 0.4;
        treeGroup.scale.set(scale, scale, scale);
        
        this.scene.add(treeGroup);
        this.buildings.push(treeGroup);
        
        return treeGroup;
    }
    onMouseDown(event) {
        // Check if the click was on a button
        if (event.target.tagName === 'BUTTON' || event.target.tagName === 'SELECT') {
            return;
        }

        if (this.isDeleteMode) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.scene.children, true);
            
            if (intersects.length > 0) {
                const clickedObject = intersects[0].object;
                let objectToDelete = clickedObject;
                while (objectToDelete.parent && objectToDelete.parent !== this.scene) {
                    objectToDelete = objectToDelete.parent;
                }
                
                // Check if the object is the ground plane
                if (objectToDelete.userData.isGround) {
                    return;
                }
                
                if (objectToDelete !== this.scene.children[0]) {
                    this.scene.remove(objectToDelete);
                    
                    // Remove from buildings or roads arrays
                    const buildingIndex = this.buildings.indexOf(objectToDelete);
                    if (buildingIndex !== -1) {
                        this.buildings.splice(buildingIndex, 1);
                    }
                    
                    const roadIndex = this.roads.indexOf(objectToDelete);
                    if (roadIndex !== -1) {
                        this.roads.splice(roadIndex, 1);
                    }
                }
            }
            return;
        }

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        
        if (intersects.length > 0) {
            const point = intersects[0].point;
            
            if (this.selectedBuildingType === BuildingTypes.HOUSE) {
                const building = this.buildingManager.createBuilding('house', this.selectedBuildingStyle);
                if (building) {
                    this.cityBuilder.placeBuilding(point.x, point.z, building);
                    this.buildings.push(building);
                }
            } else if (this.selectedBuildingType === BuildingTypes.SKYSCRAPER) {
                const building = this.buildingManager.createBuilding('skyscraper', this.selectedBuildingStyle, { floors: this.selectedFloors });
                if (building) {
                    this.cityBuilder.placeBuilding(point.x, point.z, building);
                    this.buildings.push(building);
                }
            } else if (this.selectedBuildingType === BuildingTypes.TREE) {
                const building = this.buildingManager.createBuilding('tree', this.selectedBuildingStyle);
                if (building) {
                    this.cityBuilder.placeBuilding(point.x, point.z, building);
                    this.buildings.push(building);
                }
            } else if (this.selectedBuildingType === BuildingTypes.ROAD) {
                this.startPoint = point;
                this.isDrawing = true;
            }
        }
    }


    onMouseMove(event) {
        if (!this.isDrawing || !this.startPoint) return;
        
        event.preventDefault();
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        
        if (intersects.length > 0) {
            const endPoint = intersects[0].point;
            
            // Ensure the road stays on the ground
            endPoint.y = 0;
            
            if (this.currentRoad) {
                this.scene.remove(this.currentRoad);
            }
            
            const direction = new THREE.Vector3().subVectors(endPoint, this.startPoint);
            const length = direction.length();
            direction.normalize();
            
            const roadGeometry = new THREE.BoxGeometry(length, 0.1, 2); // Reduced height to 0.1
            const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
            this.currentRoad = new THREE.Mesh(roadGeometry, roadMaterial);
            
            this.currentRoad.position.copy(this.startPoint).add(direction.multiplyScalar(length / 2));
            this.currentRoad.lookAt(endPoint);
            this.currentRoad.rotateY(Math.PI / 2);
            
            // Add road markings and street lights
            const markings = this.createRoadMarkings(this.currentRoad);
            this.currentRoad.add(markings);
            
            this.scene.add(this.currentRoad);
        }
    }

    onMouseUp() {
        if (this.isDrawing && this.currentRoad) {
            // Add the road to the scene and roads array
            this.roads.push(this.currentRoad);
            this.currentRoad = null;
            this.startPoint = null;
            this.isDrawing = false;
        }
    }

    checkAndCreateIntersections() {
        // Get the last added road
        const newRoad = this.roads[this.roads.length - 1];
        if (!newRoad) return;

        // Create intersection circles for all existing roads
        for (let i = 0; i < this.roads.length - 1; i++) {
            const existingRoad = this.roads[i];
            if (this.areRoadsIntersecting(newRoad, existingRoad)) {
                this.createIntersectionCircle(newRoad, existingRoad);
            }
        }
    }

    areRoadsIntersecting(road1, road2) {
        // Get the direction vectors of both roads
        const dir1 = new THREE.Vector3();
        road1.getWorldDirection(dir1);
        const dir2 = new THREE.Vector3();
        road2.getWorldDirection(dir2);

        // Calculate the angle between roads
        const angle = dir1.angleTo(dir2);
        
        // If roads are not parallel (angle > 0.1 radians)
        return angle > 0.1;
    }

    createIntersectionCircle(road1, road2) {
        // Create a circle at the intersection point with larger radius
        const radius = 2;
        const circleGeometry = new THREE.CircleGeometry(radius, 32);
        const circleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333, // Same color as the road
            side: THREE.DoubleSide
        });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        
        // Position the circle at the intersection
        const intersectionPoint = this.findIntersectionPoint(road1, road2);
        if (intersectionPoint) {
            circle.position.copy(intersectionPoint);
            circle.position.y = 0.05; // Slightly above ground to prevent z-fighting
            circle.rotation.x = -Math.PI / 2; // Rotate to lie flat on the ground
            
            // Add road connection fillers
            const connectionGroup = new THREE.Group();
            
            // Get road directions
            const dir1 = new THREE.Vector3();
            const dir2 = new THREE.Vector3();
            road1.getWorldDirection(dir1);
            road2.getWorldDirection(dir2);
            
            // Create connection pieces for each road
            const roads = [road1, road2];
            const directions = [dir1, dir2];
            
            roads.forEach((road, index) => {
                const direction = directions[index];
                
                // Create two connection pieces for each road (one on each side of intersection)
                [-1, 1].forEach(side => {
                    const connectionGeometry = new THREE.BoxGeometry(2, 0.1, 2);
                    const connectionMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
                    const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
                    
                    // Position the connection piece
                    connection.position.copy(intersectionPoint);
                    connection.position.y = 0.05;
                    connection.position.add(direction.multiplyScalar(side * radius));
                    
                    // Rotate to match road direction
                    connection.lookAt(intersectionPoint);
                    connection.rotateY(Math.PI / 2);
                    
                    connectionGroup.add(connection);
                });
            });
            
            // Add road markings for the intersection
            const markings = new THREE.Group();
            
            // Outer circle (white line)
            const outerCircleGeometry = new THREE.RingGeometry(radius - 0.1, radius, 32);
            const outerCircleMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xffffff,
                side: THREE.DoubleSide
            });
            const outerCircle = new THREE.Mesh(outerCircleGeometry, outerCircleMaterial);
            outerCircle.rotation.x = -Math.PI / 2;
            outerCircle.position.y = 0.06;
            markings.add(outerCircle);
            
            // Add crosswalk markings
            const crosswalkWidth = 0.3;
            const crosswalkLength = 1.5;
            const numStripes = 4;
            
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2);
                for (let j = 0; j < numStripes; j++) {
                    const stripeGeometry = new THREE.PlaneGeometry(crosswalkWidth, crosswalkLength);
                    const stripeMaterial = new THREE.MeshStandardMaterial({
                        color: 0xffffff,
                        side: THREE.DoubleSide
                    });
                    const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
                    
                    stripe.position.x = Math.cos(angle) * (radius - 0.5);
                    stripe.position.z = Math.sin(angle) * (radius - 0.5);
                    stripe.position.x += Math.cos(angle + Math.PI/2) * (j - numStripes/2 + 0.5) * 0.4;
                    stripe.position.z += Math.sin(angle + Math.PI/2) * (j - numStripes/2 + 0.5) * 0.4;
                    stripe.rotation.y = angle;
                    stripe.rotation.x = -Math.PI / 2;
                    stripe.position.y = 0.06;
                    
                    markings.add(stripe);
                }
            }
            
            circle.add(connectionGroup);
            circle.add(markings);
            this.scene.add(circle);
        }
    }

    findIntersectionPoint(road1, road2) {
        // Get the positions and directions of both roads
        const pos1 = road1.position.clone();
        const pos2 = road2.position.clone();
        const dir1 = new THREE.Vector3();
        const dir2 = new THREE.Vector3();
        road1.getWorldDirection(dir1);
        road2.getWorldDirection(dir2);

        // Calculate the intersection point
        const denominator = dir1.cross(dir2).lengthSq();
        if (denominator < 0.0001) return null; // Roads are parallel

        const t = pos2.clone().sub(pos1).cross(dir2).dot(dir1.cross(dir2)) / denominator;
        const intersection = pos1.clone().add(dir1.multiplyScalar(t));

        return intersection;
    }

    onKeyDown(event) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
            this.toggleDeleteMode();
        }
    }
} 