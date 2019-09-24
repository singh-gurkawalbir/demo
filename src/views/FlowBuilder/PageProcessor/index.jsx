import { useRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import clsx from 'clsx';
import * as selectors from '../../../reducers';
// import actions from '../../../actions';
import itemTypes from '../itemTypes';
import HookIcon from '../../../components/icons/HookIcon';
import ToolsIcon from '../../../components/icons/ToolsIcon';

const useStyles = makeStyles(theme => ({
  ppContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  ppBox: {
    width: 150,
    height: 150,
    border: 'solid 1px lightblue',
    borderRadius: 24,
    padding: theme.spacing(1),
    margin: theme.spacing(3, 0),
    cursor: 'move',
  },
  processorActions: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing(0, 1),
  },
  lineRight: {
    top: -theme.spacing(3),
    // none yet
  },
  lineLeft: {
    minWidth: 50,
  },
  dottedLine: {
    position: 'relative',
    borderBottom: `3px dotted ${theme.palette.divider}`,
  },
}));
const PageProcessor = ({ index, onMove, isLast, ...pp }) => {
  const resourceType = pp.type === 'export' ? 'exports' : 'imports';
  const resourceId = pp.type === 'export' ? pp._exportId : pp._importId;
  const { merged: resource = {} } = useSelector(state =>
    selectors.resourceData(state, resourceType, resourceId)
  );
  const ref = useRef(null);
  const classes = useStyles();
  const [, drop] = useDrop({
    accept: itemTypes.PAGE_PROCESSOR,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the right
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the items width
      // When dragging right, only move when the cursor is below 50%
      // When dragging left, only move when the cursor is above 50%
      // Dragging right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging left
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: itemTypes.PAGE_PROCESSOR, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.2 : 1;

  drag(drop(ref));

  return (
    <Fragment>
      <div className={classes.ppContainer}>
        {index === 0 && (
          <div className={clsx(classes.dottedLine, classes.lineLeft)} />
        )}
        <div ref={ref} className={classes.ppBox} style={{ opacity }}>
          <Typography variant="h2">{resource.name || resource.id}</Typography>
        </div>
        {!isLast && (
          <div>
            <div className={classes.processorActions}>
              <IconButton>
                <ToolsIcon />
              </IconButton>

              <IconButton>
                <HookIcon />
              </IconButton>
            </div>
            <div className={clsx(classes.dottedLine, classes.lineRight)} />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default PageProcessor;
