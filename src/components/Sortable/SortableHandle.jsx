import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import GripperIcon from '../icons/GripperIcon';

const useStyles = makeStyles(theme => ({
  dragIconWrapper: {
    minWidth: theme.spacing(3.5),
    cursor: 'move',
    background: 'none',
    display: 'flex',
    alignItems: 'start',
    paddingTop: 6,
  },
}));
export const SortableDragHandle = ({className = '', isVisible, draggable}) => {
  const classes = useStyles();

  return (
    <div id="dragHandle" draggable={draggable} className={clsx(classes.dragIconWrapper, className)}>
      {isVisible ? <GripperIcon /> : null}
    </div>
  );
};

export default SortableHandle(SortableDragHandle);
