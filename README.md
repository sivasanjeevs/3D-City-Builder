# 3D City Builder Game

A simple 3D city building game built with Three.js where you can place houses and roads in a 3D environment.

## Features

- 3D environment with ground plane
- Camera controls for navigation
- Building placement system
- Different building types (houses and roads)
- Grid-based placement system

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:5173`

## Controls

- Left-click: Place selected building type
- Mouse drag: Rotate camera
- Mouse wheel: Zoom in/out

## Building Types

- House: A simple house building
- Road: A road segment

## Project Structure

```
src/
  ├── main.js              # Main game initialization
  └── game/
      ├── CityBuilder.js   # Manages city layout and building placement
      ├── BuildingManager.js # Handles building creation and types
      └── InputHandler.js  # Manages user input and interactions
```

## Dependencies

- Three.js: 3D graphics library
- Vite: Development server and build tool 