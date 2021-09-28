import React, { useState, useRef } from 'react';
// Note that the resize detector is 2 major versions behind. The new interface supports hooks and
// thus has an interface more in-line with our codebase. When this feature is moved into the UI
// codebase, we should update to version 6. Here are the docs:
// https://www.npmjs.com/package/react-resize-detector
// I do not want to bump the version as we need to re-test each part of the existing UI which is
// using the now-older version, as the interface may have slightly changed over 2 major releases.
import ReactResizeDetector from 'react-resize-detector';
import { makeStyles } from '@material-ui/core';
import SinglePanelGridItem from '../../../../components/AFE/Editor/gridItems/SinglePanelGridItem';
import DragHandleGridItem from './DragHandleGridItem';

const minGridSize = 150;

const useStyles = makeStyles(() => ({
  page: {
    height: '100%',
    display: 'grid',
    gridTemplateAreas: `
       'panel_0 dragBar_v_0 panel_1 dragBar_v_1 panel_3' 
       'panel_0 dragBar_v_0 dragBar_h_0 dragBar_v_1 panel_3'
       'panel_0 dragBar_v_0 panel_2 dragBar_v_1 panel_3'
       'dragBar_h_1 dragBar_h_1 dragBar_h_1 dragBar_h_1 dragBar_h_1'
       'panel_4 panel_4 panel_4 panel_4 panel_4'`,
    gridTemplateRows: `2fr auto 2fr auto ${minGridSize}px`,
    gridTemplateColumns: '1fr auto 1fr auto 1fr',
  },
}));

function getGridArea(node) {
  const cssHandleArea = window.getComputedStyle(node).getPropertyValue('grid-area');

  // console.log(cssHandleArea);

  return cssHandleArea.split('/')[0].trim();
}

function getCssSizeString(cssGridSizes, dragBarPos, movement) {
  const sizes = cssGridSizes.split(' ').map(s => Number(s.replace('px', '')));

  // we need to respect min grid size... if the dragging would cause any grid item to be
  // smaller than a predetermined size, we should ignore the event.
  const prevSize = sizes[dragBarPos - 1];
  const nextSize = sizes[dragBarPos + 1];

  // console.log(prevSize, nextSize, dragBarPos, movement);

  if ((prevSize + movement) < minGridSize || (nextSize - movement) < minGridSize) {
    return; // setIsDragging(false);
  }

  sizes[dragBarPos - 1] += movement;
  sizes[dragBarPos + 1] -= movement;

  const newCssGridSizes = sizes.map(c => `${c}px`).join(' ');

  // console.log(cssGridSizes, newCssGridSizes);

  return newCssGridSizes;
}

function findGridColumn(grid, gridArea) {
  const gridAreas = window.getComputedStyle(grid).getPropertyValue('grid-template-areas');

  const colPos = gridAreas.split(' ').findIndex(a => a === gridArea);

  // console.log(gridAreas, gridArea, colPos);

  return colPos;
}

function findGridRow(grid, gridArea) {
  const gridAreas = window.getComputedStyle(grid).getPropertyValue('grid-template-areas');

  const rows = gridAreas.split('" "').map(r => r.replace('"', ''));
  const rowPos = rows.findIndex(r => r.includes(gridArea));

  // console.log(rowPos);

  return rowPos;
}

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

  function handleVerticalDrag(event) {
    const dX = event.movementX;
    const gridNode = gridRef.current;
    const dragBarCol = findGridColumn(gridNode, dragBarGridArea);

    // console.log(dX, dragBarCol, dragBarGridArea);
    // docs on relevant client browser API:
    // https://stackoverflow.com/questions/35170581/how-to-access-styles-from-react
    const cssGridCols = window.getComputedStyle(gridNode).getPropertyValue('grid-template-columns');
    const newCssGridCols = getCssSizeString(cssGridCols, dragBarCol, dX);

    if (!newCssGridCols) return;

    // console.log(cssGridCols, newCssGridCols);
    gridNode.style.gridTemplateColumns = newCssGridCols;
  }

  function handleHorizontalDrag(event) {
    const dY = event.movementY;
    const gridNode = gridRef.current;
    const dragBarRow = findGridRow(gridNode, dragBarGridArea);

    const cssGridRows = window.getComputedStyle(gridNode).getPropertyValue('grid-template-rows');
    const newCssGridRows = getCssSizeString(cssGridRows, dragBarRow, dY);

    if (!newCssGridRows) return;

    gridNode.style.gridTemplateRows = newCssGridRows;
  }

  function handleDrag(event) {
    if (!isDragging) return;

    if (dragOrientation === 'v') {
      handleVerticalDrag(event);
    } else {
      handleHorizontalDrag(event);
    }

    event.preventDefault();
  }

  // I can not think of a better way to handle container resize issues.
  // The resize panel mechanism relies on pixel math for dragging the handles.
  // In the rare case a user ALSO changes their browser size, then the panels
  // will not resize properly as their rows and cols are now set to fixed px dimensions.
  // The solution I use here is to convert the pixel sizes to fractional units to
  // restore the resizing... further optimizations can be made as this handler
  // ONLY needs to fire IFF a panel drag event resized a panel. Also once this
  // handler executes, it doesn't need to run again until AFTER a drag event occurs.
  // This implementation is a POC and should be reviewed/refined when the UI task
  // makes it to the UI codebase.
  const handleResize = () => {
    const gridNode = gridRef.current;

    const pxToFr = pxSizes => {
      const sizes = pxSizes.split(' ').map(s => Number(s.replace('px', '')));
      // Note we are making an assumption here that any grid row/col with a size <30px
      // is a dragBar and should NOT have fractional units. Setting to "auto" will
      // force the width/height to match the dragBar within the grid item.
      const fr = sizes.map(c => c < 30 ? 'auto' : `${c}fr`).join(' ');

      // console.log(pxSizes, 'converted to: ', fr);

      return fr;
    };

    const cssGridCols = window.getComputedStyle(gridNode).getPropertyValue('grid-template-columns');
    const cssGridRows = window.getComputedStyle(gridNode).getPropertyValue('grid-template-rows');

    gridNode.style.gridTemplateColumns = pxToFr(cssGridCols);
    gridNode.style.gridTemplateRows = pxToFr(cssGridRows);
  };

  return (
    <div className={classes.page} ref={gridRef} onMouseUp={handleDragEnd} onMouseMove={handleDrag}>
      <SinglePanelGridItem area="panel_0" title="Panel 0">Panel0 content</SinglePanelGridItem>
      <SinglePanelGridItem area="panel_1" title="Panel 1">Panel1 content</SinglePanelGridItem>
      <SinglePanelGridItem area="panel_2" title="Panel 2">Panel2 content</SinglePanelGridItem>
      <SinglePanelGridItem area="panel_3" title="Panel 3">Panel3 content</SinglePanelGridItem>
      <SinglePanelGridItem area="panel_4" title="Panel 4">Panel4 content</SinglePanelGridItem>

      <DragHandleGridItem area="dragBar_v_0" orientation="vertical" onMouseDown={handleDragStart} />
      <DragHandleGridItem area="dragBar_v_1" orientation="vertical" onMouseDown={handleDragStart} />
      <DragHandleGridItem area="dragBar_h_0" orientation="horizontal" onMouseDown={handleDragStart} />
      <DragHandleGridItem area="dragBar_h_1" orientation="horizontal" onMouseDown={handleDragStart} />

      <ReactResizeDetector handleWidth handleHeight skipOnMount onResize={handleResize} />
    </div>
  );
}
