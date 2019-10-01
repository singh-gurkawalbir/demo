import { useRef, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd-cjs';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import clsx from 'clsx';
// import actions from '../../../actions';
import itemTypes from '../itemTypes';
import HookIcon from '../../../components/icons/HookIcon';
import FilterIcon from '../../../components/icons/FilterIcon';
import MapDataIcon from '../../../components/icons/MapDataIcon';
import TransformIcon from '../../../components/icons/TransformIcon';
import AppBlock from '../AppBlock';
import LeftActions from '../AppBlock/LeftActions';
import RightActions from '../AppBlock/RightActions';
import BottomActions from '../AppBlock/BottomActions';

const useStyles = makeStyles(theme => ({
  ppContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  lineRight: {
    minWidth: 50,
  },
  lineLeft: {
    minWidth: 50,
  },
  dottedLine: {
    alignSelf: 'start',
    marginTop: 80,
    position: 'relative',
    borderBottom: `3px dotted ${theme.palette.divider}`,
  },
}));
const PageProcessor = ({
  match,
  location,
  history,
  index,
  onMove,
  isLast,
  ...pp
}) => {
  const resourceType = pp.type === 'export' ? 'exports' : 'imports';
  const resourceId = pp.type === 'export' ? pp._exportId : pp._importId;
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
          /* Initial left line connecting Source Apps */
          <div className={clsx(classes.dottedLine, classes.lineLeft)} />
        )}
        <AppBlock
          match={match}
          history={history}
          ref={ref}
          opacity={opacity}
          resourceType={resourceType}
          resourceId={resourceId}>
          <RightActions>
            {!isLast && (
              <Fragment>
                <IconButton>
                  <MapDataIcon />
                </IconButton>
                <IconButton>
                  <FilterIcon />
                </IconButton>
              </Fragment>
            )}
          </RightActions>

          <BottomActions>
            <IconButton>
              <MapDataIcon />
            </IconButton>

            <IconButton>
              <TransformIcon />
            </IconButton>

            <IconButton>
              <HookIcon />
            </IconButton>
          </BottomActions>

          <LeftActions>
            <IconButton>
              <FilterIcon />
            </IconButton>
          </LeftActions>
        </AppBlock>
        {!isLast && (
          /* Right connecting line between Page Processors is not needed
             for the last App (nothing to connect) */
          <div className={clsx(classes.dottedLine, classes.lineRight)} />
        )}
      </div>
    </Fragment>
  );
};

export default withRouter(PageProcessor);
