import React, { useState, useRef } from 'react';
// Note that the resize detector is 2 major versions behind. The new interface supports hooks and
// thus has an interface more in-line with our codebase. When this feature is moved into the UI
// codebase, we should update to version 6. Here are the docs:
// https://www.npmjs.com/package/react-resize-detector
// I do not want to bump the version as we need to re-test each part of the existing UI which is
// using the now-older version, as the interface may have slightly changed over 2 major releases.
import ReactResizeDetector from 'react-resize-detector';
import makeStyles from '@mui/styles/makeStyles';
import SinglePanelGridItem from '../../../../../components/AFE/Editor/gridItems/SinglePanelGridItem';
import DragHandleGridItem from './DragHandleGridItem';

const minGridSize = 150;

const useStyles = makeStyles(() => ({
  page: {
    height: '100%',
    display: 'grid',
  },
}));

function getDragHandles(gridAreas) {
  // strip all non-word characters and convert to an array.
  const areas = gridAreas.replace(/[\W]+/g, ',').split(',');

  // filter out all areas that are NOT handles
  const handleAreas = areas.filter(a => a.includes('dragBar'));

  // https://medium.com/dailyjs/how-to-remove-array-duplicates-in-es6-5daa8789641c
  const uniqueHandles = [...new Set(handleAreas)];

  return uniqueHandles.map(h => ({
    area: h,
    orientation: h.includes('_h_') ? 'horizontal' : 'vertical',
  }));
}

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

  const rows = gridAreas.split('" "').map(r => r.replace('"', ''));

  for (let i = 0; i < rows.length; i += 1) {
    const colPos = rows[i].split(' ').findIndex(a => a === gridArea);

    if (colPos >= 0) {
      return colPos;
    }
  }

  // This should never happen
  return -1;
}

function findGridRow(grid, gridArea) {
  const gridAreas = window.getComputedStyle(grid).getPropertyValue('grid-template-areas');

  const rows = gridAreas.split('" "').map(r => r.replace('"', ''));
  const rowPos = rows.findIndex(r => r.includes(gridArea));

  // console.log(rowPos);

  return rowPos;
}

export default function ResizeProto({panels, layout}) {
  const classes = useStyles();
  const [isDragging, setIsDragging] = useState(false);
  const [dragBarGridArea, setDragBarGridArea] = useState();
  const [dragOrientation, setDragOrientation] = useState();
  const gridRef = useRef();

  const handles = getDragHandles(layout.gridTemplateAreas);

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
    <div
      className={classes.page}
      style={layout}
      ref={gridRef}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}>

      {panels.map(p =>
        <SinglePanelGridItem key={p} area={p} title={`${p} panel`}>{p} content</SinglePanelGridItem>
      )}

      {handles.map(h => (
        <DragHandleGridItem
          key={h.area}
          area={h.area}
          orientation={h.orientation}
          onMouseDown={handleDragStart}
        />
      )
      )}

      <ReactResizeDetector handleWidth handleHeight skipOnMount onResize={handleResize} />
    </div>
  );
}

