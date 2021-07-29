import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import SinglePanelGridItem from '../../../../components/AFE/Editor/gridItems/SinglePanelGridItem';
import DragHandleY from './DragHandleY';

const useStyles = makeStyles(() => ({
  page: {
    height: '100%',
    display: 'grid',
    gridTemplateAreas: `
       'panel_0 dragbar_0 panel_1 dragbar_1 panel_3' 
       'panel_0 dragbar_0 panel_2 dragbar_1 panel_3'`,
    gridTemplateRows: '1fr 1fr',
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
  const [dragbarGridArea, setDragbarGridArea] = useState();
  const gridRef = useRef();

  function handleDragStart(event) {
    let { target } = event;
    let gridArea;

    while (target) {
      gridArea = getGridArea(target); // dragHandle-vert-0, dragHandle-hor-1
      // console.log(`current gridArea: ${gridArea}`);

      if (gridArea.startsWith('dragbar')) break;
      // If we can't find the dragbar grid area, most likely its because
      // the original mouse event target was captured by a child node of the drag area.
      // We thus need to traverse up the DOM to find the parent which contains the drag area.
      target = target.parentNode;
    }

    // only initiate drag start IFF we have a proper dragbar area.
    if (!gridArea?.startsWith('dragbar')) {
      return;
    }

    // const direction = geDirection(gridArea);
    // console.log(`drag start for: ${gridArea}`);

    setIsDragging(true);
    setDragbarGridArea(gridArea);
  }

  function handleDragEnd() {
    setIsDragging(false);
  }

  function handleDrag(event) {
    if (!isDragging) return;
    // console.log('Dragging');

    const dX = event.movementX;
    const gridNode = gridRef.current;
    const dragbarCol = findGridColumn(gridNode, dragbarGridArea);

    // console.log(dX, dragbarCol, dragbarGridArea);
    // docs on relevant client browser API:
    // https://stackoverflow.com/questions/35170581/how-to-access-styles-from-react
    const cssGridCols = window.getComputedStyle(gridNode).getPropertyValue('grid-template-columns');
    const colSizes = cssGridCols.split(' ').map(s => Number(s.replace('px', '')));

    // console.log(colSizes);

    // we need to respect min grid size... if the dragging would cause any grid item to be
    // smaller than a predetermined size, we should ignore the event.
    const prevSize = colSizes[dragbarCol - 1];
    const nextSize = colSizes[dragbarCol + 1];

    if ((prevSize + dX) < minGridSize || (nextSize - dX) < minGridSize) {
      return; // setIsDragging(false);
    }

    colSizes[dragbarCol - 1] += dX;
    colSizes[dragbarCol + 1] -= dX;

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

      {/* <DragHandleY orientation="vertical" gridArea="dragbar_0" onMouseDown={handleDragStart} /> */}

      <DragHandleY area="dragbar_0" onMouseDown={handleDragStart} />
      <DragHandleY area="dragbar_1" onMouseDown={handleDragStart} />
    </div>
  );
}
