import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import flowSchema from './metadata/flowSchema';
import {path as zoomResetIconPath} from '../../../../components/icons/FullScreenCloseIcon';
import {path as zoomUpIconPath} from '../../../../components/icons/AddIcon';
import {path as zoomDownIconPath} from '../../../../components/icons/SubtractIcon';

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

function makeSvgTexture(path) {
  // This solution found here:
  // https://www.html5gamedevs.com/topic/42416-generate-texture-from-svg-content-instead-of-svg-path/
  const svgObject = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
    <path d="${path}"/>
  </svg>`;

  const blob = new Blob([svgObject], {type: 'image/svg+xml'});
  const url = URL.createObjectURL(blob);
  const texture = PIXI.Texture.from(url);

  return texture;
}

function makeIconButton(svgPath, onClick) {
  const texture = makeSvgTexture(svgPath);

  const btnContainer = new PIXI.Container();
  const btn = new PIXI.Sprite(texture);

  btn.interactive = true;
  btn.buttonMode = true;
  btn.on('mouseover', () => { btn.alpha = 0.5; });
  btn.on('mouseout', () => { btn.alpha = 1; });
  btn.on('click', onClick);

  const hitBox = new PIXI.Graphics();

  // hitBox.lineStyle(1);
  hitBox.beginFill(0xFFFFFF);
  hitBox.drawCircle(12, 12, 16);
  hitBox.alpha = 0.7;

  btnContainer.addChild(hitBox);
  btnContainer.addChild(btn);

  return btnContainer;
}

function buildViewportControls(viewport) {
  const buttonSpacing = 40;
  const handleZoomUp = () => viewport.zoomPercent(0.1);
  const handleZoomDown = () => viewport.zoomPercent(-0.1);
  const handleZoomReset = () => viewport.setZoom(1);

  const container = new PIXI.Container();

  container.position.set(app.screen.width + 50, 25);
  // controls.anchor.x = 1;

  const zoomResetButton = makeIconButton(zoomResetIconPath, handleZoomReset);
  const zoomUpButton = makeIconButton(zoomUpIconPath, handleZoomUp);
  const zoomDownButton = makeIconButton(zoomDownIconPath, handleZoomDown);

  zoomDownButton.x = buttonSpacing;
  zoomResetButton.x = buttonSpacing * 2;

  container.addChild(zoomUpButton);
  container.addChild(zoomDownButton);
  container.addChild(zoomResetButton);

  return container;
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
  app.stage.addChild(buildViewportControls(viewport));

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
