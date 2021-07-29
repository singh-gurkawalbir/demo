import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import SinglePanelGridItem from '../../../../components/AFE/Editor/gridItems/SinglePanelGridItem';
import DragHandleGridArea from './DragHandleGridArea';

const useStyles = makeStyles(() => ({
  page: {
    height: '100%',
    display: 'grid',
    gridTemplateAreas: `
       'panel_0 dragBar_v_0 panel_1 dragBar_v_1 panel_3' 
       'panel_0 dragBar_v_0 dragBar_h_2 dragBar_v_1 panel_3'
       'panel_0 dragBar_v_0 panel_2 dragBar_v_1 panel_3'`,
    gridTemplateRows: '1fr auto 1fr',
    gridTemplateColumns: '1fr auto 1fr auto 1fr',
  },
}));

function getGridArea(node) {
  const cssHandleArea = window.getComputedStyle(node).getPropertyValue('grid-area');

  // console.log(cssHandleArea);

  return cssHandleArea.split('/')[0].trim();
}

function findGridColumn(grid, gridArea) {
  const gridAreas = window.getComputedStyle(grid).getPropertyValue('grid-template-areas');

  const colPos = gridAreas.split(' ').findIndex(a => a === gridArea);
  // console.log(gridAreas, gridArea, colPos);

  return colPos;
}

const minGridSize = 150;

export default function ResizeProto() {
  const classes = useStyles();
  const [isDragging, setIsDragging] = useState(false);
  const [dragBarGridArea, setDragBarGridArea] = useState();
  const [dragOrientation, setDragOrientation] = useState();
  const gridRef = useRef();

  function handleDragStart(event) {
    let { target } = event;
    let gridArea;

    while (target) {
      gridArea = getGridArea(target); // dragHandle-vert-0, dragHandle-hor-1
      // console.log(`current gridArea: ${gridArea}`);

      if (gridArea.startsWith('dragBar')) break;
      // If we can't find the dragBar grid area, most likely its because
      // the original mouse event target was captured by a child node of the drag area.
      // We thus need to traverse up the DOM to find the parent which contains the drag area.
      target = target.parentNode;
    }

    // only initiate drag start IFF we have a proper dragBar area.
    if (!gridArea?.startsWith('dragBar')) {
      return;
    }

    const orientation = gridArea.split('_')[1];

    // console.log(`orientation for: ${gridArea} is ${orientation}.`);

    setDragOrientation(orientation);
    setIsDragging(true);
    setDragBarGridArea(gridArea);
  }

  function handleDragEnd() {
    setIsDragging(false);
  }

  function handleDrag(event) {
    if (!isDragging) return;
    if (dragOrientation === 'h') {
      // console.log('Horizontal dragging not yet implemented.');

      return;
    }

    // console.log('Dragging');

    const dX = event.movementX;
    const gridNode = gridRef.current;
    const dragBarCol = findGridColumn(gridNode, dragBarGridArea);

    // console.log(dX, dragBarCol, dragBarGridArea);
    // docs on relevant client browser API:
    // https://stackoverflow.com/questions/35170581/how-to-access-styles-from-react
    const cssGridCols = window.getComputedStyle(gridNode).getPropertyValue('grid-template-columns');
    const colSizes = cssGridCols.split(' ').map(s => Number(s.replace('px', '')));

    // console.log(colSizes);

    // we need to respect min grid size... if the dragging would cause any grid item to be
    // smaller than a predetermined size, we should ignore the event.
    const prevSize = colSizes[dragBarCol - 1];
    const nextSize = colSizes[dragBarCol + 1];

    if ((prevSize + dX) < minGridSize || (nextSize - dX) < minGridSize) {
      return; // setIsDragging(false);
    }

    colSizes[dragBarCol - 1] += dX;
    colSizes[dragBarCol + 1] -= dX;

    const newCssGridCols = colSizes.map(c => `${c}px`).join(' ');

    // console.log(newCssGridCols);
    gridNode.style.gridTemplateColumns = newCssGridCols;
    event.preventDefault();
  }

  return (
    <div className={classes.page} ref={gridRef} onMouseUp={handleDragEnd} onMouseMove={handleDrag}>
      <SinglePanelGridItem area="panel_0" title="Panel 0">Panel0 content</SinglePanelGridItem>
      <SinglePanelGridItem area="panel_1" title="Panel 1">Panel1 content</SinglePanelGridItem>
      <SinglePanelGridItem area="panel_2" title="Panel 2">Panel2 content</SinglePanelGridItem>
      <SinglePanelGridItem area="panel_3" title="Panel 3">Panel3 content</SinglePanelGridItem>

      <DragHandleGridArea area="dragBar_v_0" orientation="vertical" onMouseDown={handleDragStart} />
      <DragHandleGridArea area="dragBar_v_1" orientation="vertical" onMouseDown={handleDragStart} />
      <DragHandleGridArea area="dragBar_h_2" orientation="horizontal" onMouseDown={handleDragStart} />
    </div>
  );
}
