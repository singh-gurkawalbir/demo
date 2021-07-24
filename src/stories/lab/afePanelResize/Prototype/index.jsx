import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  page: {
    height: '100%',
    display: 'grid',
    gridTemplateAreas: `
       'rule dragbar0 data dragbar1 notes' 
       'rule dragbar0 result dragbar1 notes'`,
    gridTemplateRows: '1fr 1fr',
    gridTemplateColumns: '1fr 6px 1fr 6px 1fr',
  },
  panel: {
    border: '1px solid black',
  },
  rule: {
    gridArea: 'rule',
  },
  data: {
    gridArea: 'data',
  },
  result: {
    gridArea: 'result',
  },
  notes: {
    gridArea: 'notes',
  },
  dragbar0: {
    backgroundColor: 'black',
    gridArea: 'dragbar0',
    cursor: 'ew-resize',
  },

  dragbar1: {
    backgroundColor: 'black',
    gridArea: 'dragbar1',
    cursor: 'ew-resize',
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

export default function ResizeProto() {
  const classes = useStyles();
  const [isDragging, setIsDragging] = useState(false);
  const [dragbarGridArea, setDragbarGridArea] = useState();

  function handleDragStart(event) {
    setIsDragging(true);
    setDragbarGridArea(getGridArea(event.target));
  }

  function handleDragEnd() {
    setIsDragging(false);
  }

  function handleDrag(event) {
    if (!isDragging) return;
    // console.log('Dragging');

    const dragHandle = event.target;
    const dX = event.movementX;
    const grid = dragHandle.parentNode;
    const dragbarCol = findGridColumn(grid, dragbarGridArea);
    // console.log(dX);
    const cssGridCols = window.getComputedStyle(dragHandle.parentNode).getPropertyValue('grid-template-columns');
    const colSizes = cssGridCols.split(' ').map(s => +s.replace('px', ''));

    // console.log(colSizes);
    colSizes[dragbarCol - 1] += dX;
    colSizes[dragbarCol + 1] -= dX;

    const newCssGridCols = colSizes.map(c => `${c}px`).join(' ');

    // console.log(newCssGridCols);
    dragHandle.parentNode.style.gridTemplateColumns = newCssGridCols;
    event.preventDefault();
  }

  return (
    <div className={classes.page} onMouseUp={handleDragEnd} onMouseMove={handleDrag}>
      <div className={clsx(classes.panel, classes.rule)}>RULE</div>
      <div className={clsx(classes.panel, classes.data)}>DATA</div>
      <div className={clsx(classes.panel, classes.result)}>RESULT</div>
      <div className={clsx(classes.panel, classes.notes)}>NOTES</div>

      <div className={classes.dragbar0} onMouseDown={handleDragStart} />
      <div className={classes.dragbar1} onMouseDown={handleDragStart} />
    </div>
  );
}
