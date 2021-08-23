import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
// import { Typography } from '@material-ui/core';

const app = new PIXI.Application({
  // resolution: window.devicePixelRatio,
  // autoDensity: true,
});

// Create a Graphics object, set a fill color, draw a rectangle
const obj = new PIXI.Graphics();

obj.beginFill(0xff0000);
obj.drawRect(0, 0, 200, 100);

// Rotate around the center
obj.pivot.x = 100;
obj.pivot.y = 50;

// Add the obj to the scene we are building.
app.stage.addChild(obj);

// Listen for frame updates
app.ticker.add(() => {
  // Setup the position (note use rendered.screen.width vs renderer.width
  // to support both retina and desktop display.)
  obj.x = app.renderer.screen.width / 2;
  obj.y = app.renderer.screen.height / 2;

  // each frame we spin the obj around a bit
  obj.rotation += 0.01;
});

export default function Proto() {
  const canvasRef = useRef();

  useEffect(() => {
    console.log('init pixi app');

    const canvasNode = canvasRef.current;

    canvasNode.appendChild(app.view);
    app.resizeTo = canvasNode;
    app.start();

    return () => {
      // On unload completely destroy the application and all of it's children
      app.stop();
      // app.destroy(false, true);
    };
  }, []);

  return (
    <div style={{width: '100%', height: '100%'}} ref={canvasRef} />
  );
}
