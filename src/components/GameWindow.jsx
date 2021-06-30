import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import '../styles/GameWindow.css'

const { GameEngine, CONSTANTS } = require('@itspladd/battleship-engine')

export default function GameWindow() {
  // This ref will hold the DOM <canvas> element where we render the game.
  const renderCanvas = useRef(null);

  const [engine, setEngine] = useState();
  const [gameState, setGameState] = useState({});
  const [renderer, setRenderer] = useState();
  const [moves, setMoves] = useState();
  let buttonResult = "Click me";

  useEffect(() => {
    const players = [
      { id: 'p1', name: 'Trapezius' },
      { id: 'p2', name: 'Tautrion' }
    ];
    const initEngine = new GameEngine(players)
    setEngine(initEngine);
    setMoves(CONSTANTS.RULES.DEFAULT_RULES.MOVES);
    setGameState(initEngine.gameState)

    // === THREE.JS CODE START ===
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ canvas: renderCanvas.current });
    var controls = new MapControls(camera, renderCanvas.current)
    controls.screenSpacePanning = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    var hex = makeHexTile(1);
    hex.position.set(0, 0, 0)
    console.log(hex)
    scene.add(hex);
    camera.position.z = 20;
    camera.position.y = 0;
    camera.position.x = 0;
    var animate = function () {
      requestAnimationFrame(animate);
      hex.rotation.z += 0.01;
      renderer.render(scene, camera);
    };
    animate();
    setRenderer(renderer);
    // === THREE.JS CODE END ===

  }, [])

  const makeHexTile = (radius) => {
    radius = radius || 1;
    const points = [];
    const angleIncrement = (2 * Math.PI) / 6;
    // Calculate hex points
    for (let i = 1; i <= 6; i++) {
      const angle = angleIncrement * i;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      points.push(new THREE.Vector2(x, y));
    }
    console.log(points)
    const hexShape = new THREE.Shape(points);
    const extrudeSettings = {
      steps: 1,
      depth: 0.5,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 1
    };
    const geometry = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    return new THREE.Mesh(geometry, material);
  }

  const handleClick = () => {
    console.log('handling click')
    const p1Move = {
      moveType: moves.MOVE_SHIP.NAME,
      playerID: 'p1',
      targetPlayerID: 'p1',
      shipID: 'ship0',
      position: [0, 0],
      angle: 180
    }
    engine.inputMove(p1Move)
      .then(results => setGameState(results.gameState))
  }

  return (
    <div className="game-window">
      <p>Game window</p>
      {/* Assign the renderCanvas ref to this canvas element! */}
      <canvas ref={renderCanvas} />
      <p>{gameState && JSON.stringify(gameState)}</p>
      <button onClick={() => makeHexTile()}>{buttonResult}</button>
    </div>
  )
}