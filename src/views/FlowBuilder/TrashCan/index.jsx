import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import itemTypes from '../itemTypes';

const useStyles = makeStyles(theme => ({
  canDrop: {
    '& svg': {
      width: 80,
      height: 80,
    },
  },
  isOver: {
    color: theme.palette.success.main,
  },
  button: {
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
      onDrop(item.index);
    },
  });

  // console.log(isOver, canDrop);

  drop(ref);

  return (
    <Tooltip title="Drag applications here to delete" placement="top">
      <IconButton
        aria-label="delete"
        ref={ref}
        {...rest}
        className={clsx(classes.button, className, {
          [classes.isOver]: isOver,
          [classes.canDrop]: canDrop,
        })}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
}
