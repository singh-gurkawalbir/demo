import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import flowSchema from './metadata/flowSchema';

let app;
const pageProcessors = {};
const pageGenerators = {};

function getAppBlock(resource, x, y) {
  const container = new PIXI.Container();

  container.position.set(x, y);

  const block = new PIXI.Graphics();

  container.addChild(block);

  block.lineStyle(2, 0xD6E4ED, 1);
  block.beginFill(0xFFFFFF);
  block.drawRoundedRect(0, 0, 250, 150, 20);
  block.pivot.x = 125;
  block.pivot.y = 75;
  block.position.set(125, 75);

  block.skew.x = 3;
  block.interactive = true;
  block.buttonMode = true;
  block.on('mouseover', () => { block.tint = 0xF0F5F9; });
  block.on('mouseout', () => { block.tint = 0xFFFFFF; });

  // see: https://pixijs.download/v4.7.3/docs/PIXI.TextStyle.html#TextStyle
  // for full spec of font control.
  const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 18,
    fill: 0x333D47, // font color
    // fontWeight: 'bold',
    wordWrap: true,
    wordWrapWidth: 200,
  });

  const title = new PIXI.Text(resource.name, style);

  title.position.set(25, 15);

  container.addChild(title);

  return container;
}

function buildViewportControls() {
  const gr = new PIXI.Graphics();

  gr.beginFill(0x1D76C7);
  gr.lineStyle(1);
  gr.drawCircle(0, 0, 20);
  gr.endFill();

  const texture = app.renderer.generateTexture(gr);

  const controls = new PIXI.Sprite(texture);

  controls.interactive = true;
  controls.buttonMode = true;
  controls.on('mouseover', () => { controls.alpha = 0.5; });
  controls.on('mouseout', () => { controls.alpha = 1; });

  controls.position.set(app.screen.width, 25);
  // controls.anchor.x = 1;

  return controls;
}

function buildFlow(viewport, flowSchema) {
  // PAGE GENERATORS
  for (let i = 0; i < flowSchema.pg.length; i += 1) {
    const pg = flowSchema.pg[i];
    const appBlock = getAppBlock(pg, 25, 25 + i * 200);

    // Add the appBlock to the scene we are building.
    viewport.addChild(appBlock);
    pageGenerators[pg.id] = appBlock;
  }

  // PAGE PROCESSORS
  for (let i = 0; i < flowSchema.pp.length; i += 1) {
    const pp = flowSchema.pp[i];
    const appBlock = getAppBlock(pp, 425 + i * 350, 25);

    // Add the appBlock to the scene we are building.
    viewport.addChild(appBlock);
    pageProcessors[pp.id] = appBlock;
  }
}

const handleWheelEvent = e => { e.preventDefault(); };

function initializeFbCanvas(canvasNode) {
  // PIXI APP INIT
  app = new PIXI.Application({
    resolution: window.devicePixelRatio,
    autoDensity: true,
    backgroundColor: 0xFFFFFF,
  });

  // create viewport
  const viewport = new Viewport({
  // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    interaction: app.renderer.plugins.interaction,
  });

  // activate plugins
  viewport
    .drag()
    .pinch()
    .wheel()
    .decelerate();

  app.stage.addChild(viewport);
  // add all DisplayObjects that should not be part of the viewport.
  // any of these objects should NOT zoom and pan with the flow.
  app.stage.addChild(buildViewportControls());

  // This function adds all DisplayObjects that make-up a flow's current state.
  buildFlow(viewport, flowSchema);

  // Listen for frame updates
  app.ticker.maxFPS = 30;
  // app.ticker.add(handleTick);

  // if we do not disable the 'wheel' event, then the browser will
  // scale on track pad (and touchscreen) pinch.
  window.addEventListener('wheel', handleWheelEvent, {passive: false});

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
}

function dismantleFbCanvas() {
  window.removeEventListener('wheel', handleWheelEvent, { passive: false });

  // On unload completely destroy the application and all of it's children
  app.stop();
  app.destroy(true, true);
}

// React component wrapper over native pixi.js controlled HTML5 canvas.
export default function Proto() {
  const canvasRef = useRef();

  useEffect(() => {
    initializeFbCanvas(canvasRef.current);

    return () => dismantleFbCanvas();
  }, []);

  return (
    <div style={{width: '100%', height: '100%'}} ref={canvasRef} />
  );
}
