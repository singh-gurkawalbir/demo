import React, { useEffect, useRef, useCallback, useReducer } from 'react';
import { useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import ReactResizeDetector from 'react-resize-detector';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { selectors } from '../../../reducers';
import PanelGrid from './gridItems/PanelGrid';
import ErrorGridItem from './gridItems/ErrorGridItem';
import WarningGridItem from './gridItems/WarningGridItem';
import ConsoleGridItem from './gridItems/ConsoleGridItem';
import SinglePanelGridItem from './gridItems/SinglePanelGridItem';
import TabbedPanelGridItem from './gridItems/TabbedPanelGridItem';
import ChatBotGridItem from './gridItems/ChatGridItem';
import layouts from './layouts';
import editorMetadata from '../metadata';
import DragHandleGridItem from './panels/DragHandlePanel';
import { resolveValue } from '../../../utils/editor';
import reducer from './stateReducer';

const minGridSize = 200;

function getDragHandles(gridAreas, showErrorDragBar = false) {
  // strip all non-word characters and convert to an array.
  const areas = gridAreas.replace(/[\W]+/g, ',').split(',');

  // filter out all areas that are NOT handles
  const handleAreas = areas.filter(a => a.includes('dragBar'));

  // https://medium.com/dailyjs/how-to-remove-array-duplicates-in-es6-5daa8789641c
  const handles = [...new Set(handleAreas)];

  if (!showErrorDragBar) {
    handles.pop();
  }

  return handles.map(h => ({
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

  // console.log(`prevSize:${prevSize}, nextSize:${nextSize}, dragBarPos: ${dragBarPos}, movement: ${movement}`);

  // do nothing if the previous cell size is too small and is being made smaller
  if ((prevSize + movement) < minGridSize && movement < 0) {
    return; // setIsDragging(false);
  }

  // do nothing if the next cell size is too small and is being made smaller
  if ((nextSize - movement) < minGridSize && movement > 0) {
    return; // setIsDragging(false);
  }

  sizes[dragBarPos - 1] += movement;
  sizes[dragBarPos + 1] -= movement;

  const newCssGridSizes = sizes.map(c => `${c}px`).join(' ');

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

const pxToFr = (pxSizes, resetLastRow) => {
  const sizes = pxSizes.split(' ').map(s => Number(s.replace('px', '')));

  // Note we are making an assumption here that any grid row/col with a size <30px
  // is a dragBar and should NOT have fractional units. Setting to "auto" will
  // force the width/height to match the dragBar within the grid item.
  const fr = sizes.map(c => c < 30 ? 'auto' : `${c}fr`);

  // we make the assumption here that the last row is always the error grid item.
  // we want to force this to 'auto' when an error first appears, or is cleared.
  if (resetLastRow) {
    fr[fr.length - 1] = 'auto';
  }

  return fr.join(' ');
};

const getGridTemplateCSS = (layout, editorContext) => {
  const layoutCSS = layouts[resolveValue(layout, editorContext)];

  if (!editorContext.chatEnabled) {
    return layoutCSS;
  }

  // we need to add 2 new row to the grid for the chatbot.
  // The first row is for the horizontal drag bar, the second row is for the chatbot.
  const cols = layoutCSS.gridTemplateColumns.split(' ');
  const rows = layoutCSS.gridTemplateRows.split(' ');
  const areas = layoutCSS.gridTemplateAreas
    .split('" "')
    .map(r => r.replace('"', ''));
  const colCount = cols.length;
  const errorDragBarIndex = +areas[areas.length - 2].split(' ')[0].slice(-1);

  // add the chatbot row and respective dragBar row to the rows array
  rows.splice(rows.length - 1, 0, '1fr', 'auto');
  const gridRows = rows.join(' ');

  // remove the error row and dragBar row from the areas array
  areas.pop();
  areas.pop();

  // add the chatbot row and respective dragBar row to the areas array
  areas.push(Array(colCount)
    .fill(`dragBar_h_${errorDragBarIndex}`)
    .join(' '));
  areas.push(Array(colCount).fill('chat').join(' '));

  // add the error row and respective dragBar row to the areas array
  areas.push(Array(colCount)
    .fill(`dragBar_h_${errorDragBarIndex + 1}`)
    .join(' '));
  areas.push(Array(colCount).fill('error').join(' '));

  return {
    gridTemplateRows: gridRows,
    gridTemplateColumns: layoutCSS.gridTemplateColumns,
    gridTemplateAreas: `"${areas.join('" "')}"`,
  };
};

export default function Editor({ editorId }) {
  const [enquesnackbar] = useEnqueueSnackbar();
  const [editorState, dispatchLocalAction] = useReducer(reducer,
    {
      isDragging: false,
      requireResize: false,
      dragBarGridArea: '',
      dragOrientation: '',
    });

  const {isDragging, requireResize, dragBarGridArea, dragOrientation } = editorState;
  const gridRef = useRef();

  const showErrorDragBar = useSelector(state => {
    const violations = selectors.editorViolations(state, editorId);
    const { warning, logs } = selectors.editorResult(state, editorId);
    const { errors: chatErrors } = selectors.editorChatState(state, editorId);
    const editor = selectors.editor(state, editorId);

    return !!(violations || editor.error || warning || logs || chatErrors);
  });

  const editorContext = useSelector(state => {
    // we want to remove all volatile fields. If we take the
    // editor state directly, it causes re-renders since its ref changes
    // with any change. Possibly we can create a dedicated selector to
    // return a static editor context object.
    // for now, adding fields as they are used so we understand what part of the
    // editor state is needed to render the editor wire-frame.
    const e = selectors.editor(state, editorId);
    const activeProcessor = selectors.editorActiveProcessor(state, editorId);

    return {
      chatEnabled: !!e.chat?.enabled,
      editorId,
      editorType: e.editorType,
      layout: e.layout,
      activeProcessor,
      autoEvaluate: e.autoEvaluate,
      resultMode: e.resultMode,
      fieldId: e.fieldId,
      formKey: e.formKey,
      supportsDefaultData: e.supportsDefaultData,
      saveError: e.saveMessage,
      resourceType: e.resourceType,
      mappingPreviewType: e.mappingPreviewType,
    };
  }, shallowEqual);

  const handleDragStart = useCallback(event => {
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
    dispatchLocalAction({type: 'dragStart', payload: {orientation, gridArea}});
  }, []);

  const handleDragEnd = useCallback(() => {
    dispatchLocalAction({type: 'dragEnd'});
  }, []);

  const handleVerticalDrag = useCallback(event => {
    const dX = event.movementX;
    const gridNode = gridRef.current;
    const dragBarCol = findGridColumn(gridNode, dragBarGridArea);

    // console.log(dX, dragBarCol, dragBarGridArea);
    // docs on relevant client browser API:
    // https://stackoverflow.com/questions/35170581/how-to-access-styles-from-react
    const cssGridCols = window.getComputedStyle(gridNode).getPropertyValue('grid-template-columns');
    const newCssGridCols = getCssSizeString(cssGridCols, dragBarCol, dX);

    if (!newCssGridCols) return;

    gridNode.style.gridTemplateColumns = newCssGridCols;
  }, [dragBarGridArea]);

  const handleHorizontalDrag = useCallback(event => {
    const dY = event.movementY;
    const gridNode = gridRef.current;
    const dragBarRow = findGridRow(gridNode, dragBarGridArea);

    const cssGridRows = window.getComputedStyle(gridNode).getPropertyValue('grid-template-rows');
    const newCssGridRows = getCssSizeString(cssGridRows, dragBarRow, dY);

    if (!newCssGridRows) return;

    gridNode.style.gridTemplateRows = newCssGridRows;
  }, [dragBarGridArea]);

  const handleDrag = useCallback(event => {
    if (!isDragging) return;

    if (dragOrientation === 'v') {
      handleVerticalDrag(event);
    } else {
      handleHorizontalDrag(event);
    }

    event.preventDefault();
  }, [isDragging, dragOrientation, handleHorizontalDrag, handleVerticalDrag]);

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
  const handleResize = useCallback(() => {
    if (!requireResize) return;

    const gridNode = gridRef.current;

    const cssGridCols = window.getComputedStyle(gridNode).getPropertyValue('grid-template-columns');
    const cssGridRows = window.getComputedStyle(gridNode).getPropertyValue('grid-template-rows');

    gridNode.style.gridTemplateColumns = pxToFr(cssGridCols);
    gridNode.style.gridTemplateRows = pxToFr(cssGridRows);

    // Once the grid areas are converted to fractional units and not pixels,
    // there is no need for repeated processing, as the 'fr' will dynamically
    // change the grid size on it's own.
    dispatchLocalAction({type: 'resize'});
  }, [requireResize]);

  useEffect(() => {
    if (editorContext.saveError) {
      enquesnackbar({ message: editorContext.saveError, variant: 'error' });
    }
  }, [enquesnackbar, editorContext.saveError]);

  const {editorType, layout} = editorContext;

  const gridTemplateCSS = getGridTemplateCSS(layout, editorContext);
  const gridAreas = gridTemplateCSS.gridTemplateAreas;
  const handles = getDragHandles(gridAreas, showErrorDragBar);

  // any time the error panel is shown or hidden AND the gridRows are in px vs fr units,
  // we need to convert the css to fr so that the proper space is allocated for the new
  // grid item.
  useEffect(() => {
    if (!requireResize) return;

    // console.log('Reset error row height');

    const gridNode = gridRef.current;
    const cssGridRows = window.getComputedStyle(gridNode).getPropertyValue('grid-template-rows');

    gridNode.style.gridTemplateRows = pxToFr(cssGridRows, true);
  }, [requireResize, showErrorDragBar]);

  if (!editorType) { return null; }

  const { panels } = editorMetadata[editorType];

  return (
    <>
      <PanelGrid
        style={gridTemplateCSS}
        ref={gridRef}
        onMouseUp={handleDragEnd}
        onMouseMove={handleDrag}
      >
        {resolveValue(panels, editorContext).map(p =>
          !p.group ? (
            <SinglePanelGridItem
              area={p.area}
              key={p.area}
              dragBar={p.dragBar}
              title={resolveValue(p.title, editorContext)}
              helpKey={resolveValue(p.helpKey, editorContext)}
              isLoggable={p?.isLoggable}
            >
              <p.Panel
                editorId={editorId}
                {...resolveValue(p.props, editorContext)}
              />
            </SinglePanelGridItem>
          ) : (
            <TabbedPanelGridItem
              editorId={editorId}
              key={p.area}
              area={p.area}
              panelGroup={p}
            />
          )
        )}
        {handles.map(h => (
          <DragHandleGridItem
            key={h.area}
            editorId={editorId}
            area={h.area}
            orientation={h.orientation}
            onMouseDown={handleDragStart}
          />
        ))}

        <ErrorGridItem editorId={editorId} />
        <WarningGridItem editorId={editorId} />
        <ConsoleGridItem editorId={editorId} />
        {editorContext.chatEnabled && <ChatBotGridItem editorId={editorId} />}
      </PanelGrid>

      <ReactResizeDetector
        handleWidth
        handleHeight
        skipOnMount
        onResize={handleResize}
      />
    </>
  );
}
