import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import itemTypes from '../itemTypes';

const useStyles = makeStyles(theme => ({
  appBlock: {
    width: '15vw',
    height: '15vh',
    border: 'solid 1px lightblue',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    cursor: 'move',
  },
}));
const PageProcessor = ({ _id, name, index, moveItem }) => {
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
      moveItem(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: itemTypes.PAGE_PROCESSOR, _id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));

  return (
    <div ref={ref} className={classes.appBlock} style={{ opacity }}>
      <Typography variant="h2">{name}</Typography>
    </div>
  );
};

export default PageProcessor;
