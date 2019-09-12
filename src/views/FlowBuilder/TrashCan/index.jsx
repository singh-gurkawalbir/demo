import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import itemTypes from '../itemTypes';

const useStyles = makeStyles(theme => ({
  root: {
    width: 110,
    height: 110,
    // '&:hover svg': {
    //   width: 80,
    //   height: 80,
    // },
  },
  hovering: {
    '& svg': {
      width: 80,
      height: 80,
    },
  },
  button: {
    position: 'absolute',
    margin: theme.spacing(1),
    bottom: 0,
    right: 0,
    '& svg': {
      transition: theme.transitions.create(['width', 'height'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
}));

export default function TrashCan({ className, onDrop, ...rest }) {
  const classes = useStyles();
  const ref = useRef(null);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: itemTypes.PAGE_PROCESSOR,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop(item) {
      if (!ref.current) {
        return;
      }

      // Time to actually perform the action
      onDrop(item.index);
    },
  });
  const isActive = canDrop && isOver;

  drop(ref);

  return (
    <div
      ref={ref}
      {...rest}
      className={clsx(classes.root, className, {
        [classes.hovering]: isActive,
      })}>
      <Tooltip title="Drag applications here to delete">
        <IconButton aria-label="delete" className={classes.button}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
