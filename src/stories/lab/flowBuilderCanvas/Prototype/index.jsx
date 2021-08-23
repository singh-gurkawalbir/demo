import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import flowSchema from './metadata/flowSchema';

const pageProcessors = {};
const pageGenerators = {};
// const delta = 0;

function getAppBlock(x, y) {
  const block = new PIXI.Graphics();

  block.beginFill(0xff0000);
  block.drawRect(0, 0, 200, 100);
  block.x = x;
  block.y = y;
  block.interactive = true;
  block.buttonMode = true;
  block.on('mouseover', () => { block.alpha = 0.5; });
  block.on('mouseout', () => { block.alpha = 1; });

  return block;
}

const app = new PIXI.Application({
  resolution: window.devicePixelRatio,
  autoDensity: true,
});

// PAGE GENERATORS
for (let i = 0; i < flowSchema.pg.length; i += 1) {
  const pg = flowSchema.pg[i];
  const appBlock = getAppBlock(25, 25 + i * 125);

  // Add the appBlock to the scene we are building.
  app.stage.addChild(appBlock);
  pageGenerators[pg.id] = appBlock;
}

// PAGE PROCESSORS
for (let i = 0; i < flowSchema.pp.length; i += 1) {
  const pp = flowSchema.pp[i];
  const appBlock = getAppBlock(325 + i * 225, 25);

  // Add the appBlock to the scene we are building.
  app.stage.addChild(appBlock);
  pageProcessors[pp.id] = appBlock;
}

// Listen for frame updates
// app.ticker.add(handleTick);

export default function Proto() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvasNode = canvasRef.current;

    canvasNode.appendChild(app.view);
    // the resizeTo helper prop lets us tell Pixi to track the size of a DOM node and
    // set its canvas sie to match. This facilitates the use-case where a user resizes
    // the browser, or expands/collapses the Celigo Menu.
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
