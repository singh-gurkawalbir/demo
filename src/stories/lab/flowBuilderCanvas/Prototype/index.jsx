import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import flowSchema from './metadata/flowSchema';

const pageProcessors = {};
const pageGenerators = {};

function getAppBlock(resource, x, y) {
  const container = new PIXI.Container();

  container.position.set(x, y);

  const block = new PIXI.Graphics();

  container.addChild(block);

  block.lineStyle(2, 0xFFFFFF, 1);
  block.beginFill(0xDDDDDD);
  block.drawRoundedRect(0, 0, 250, 150, 20);
  block.pivot.x = 125;
  block.pivot.y = 75;
  block.position.set(125, 75);

  block.skew.x = 3;
  block.interactive = true;
  block.buttonMode = true;
  block.on('mouseover', () => { block.alpha = 0.5; });
  block.on('mouseout', () => { block.alpha = 1; });

  const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 18,
    // fontWeight: 'bold',
    // stroke: '#4a1850',
    strokeThickness: 0.8,
    wordWrap: true,
    wordWrapWidth: 200,
    // lineJoin: 'round',
  });

  const title = new PIXI.Text(resource.name, style);

  title.position.set(25, 15);

  container.addChild(title);

  return container;
}

// PIXI APP INIT
const app = new PIXI.Application({
  resolution: window.devicePixelRatio,
  autoDensity: true,
});

// create viewport
const viewport = new Viewport({
  // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  interaction: app.renderer.plugins.interaction,
});

app.stage.addChild(viewport);

// activate plugins
viewport
  .drag()
  .pinch()
  .wheel()
  .decelerate();

// PAGE GENERATORS
for (let i = 0; i < flowSchema.pg.length; i += 1) {
  const pg = flowSchema.pg[i];
  const appBlock = getAppBlock(pg, 25, 25 + i * 175);

  // Add the appBlock to the scene we are building.
  viewport.addChild(appBlock);
  pageGenerators[pg.id] = appBlock;
}

// PAGE PROCESSORS
for (let i = 0; i < flowSchema.pp.length; i += 1) {
  const pp = flowSchema.pp[i];
  const appBlock = getAppBlock(pp, 425 + i * 300, 25);

  // Add the appBlock to the scene we are building.
  viewport.addChild(appBlock);
  pageProcessors[pp.id] = appBlock;
}

// Listen for frame updates
app.ticker.maxFPS = 30;
// app.ticker.add(handleTick);

const handleWheelEvent = e => { e.preventDefault(); };

export default function Proto() {
  const canvasRef = useRef();

  useEffect(() => {
    // if we do not disable the 'wheel' event, then the browser will
    // scale on track pad (and touchscreen) pinch.
    window.addEventListener('wheel', handleWheelEvent, {passive: false});

    const canvasNode = canvasRef.current;
    const {height: worldHeight, width: worldWidth} = viewport.parent;

    // The bounce feature of the viewport will prevent panning of the canvas
    // past the "world" boundaries...
    const bouncePadding = 50;

    viewport.screenWidth = canvasNode.offsetWidth;
    viewport.screenHeight = canvasNode.offsetHeight;
    viewport.worldWidth = Math.ceil(worldWidth) + bouncePadding;
    viewport.worldHeight = Math.ceil(worldHeight) + bouncePadding;
    viewport.bounce();

    canvasNode.appendChild(app.view);
    // the resizeTo helper prop lets us tell Pixi to track the size of a DOM node and
    // set its canvas sie to match. This facilitates the use-case where a user resizes
    // the browser, or expands/collapses the Celigo Menu.
    app.resizeTo = canvasNode;
    app.start();

    return () => {
      window.removeEventListener('wheel', handleWheelEvent, { passive: false });

      // On unload completely destroy the application and all of it's children
      app.stop();
      // app.destroy(false, true);
    };
  }, []);

  return (
    <div style={{width: '100%', height: '100%'}} ref={canvasRef} />
  );
}
