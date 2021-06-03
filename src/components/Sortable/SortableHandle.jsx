import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import GripperIcon from '../icons/GripperIcon';

const useStyles = makeStyles(theme => ({
  dragIconWrapper: {
    minWidth: theme.spacing(3.5),
    cursor: 'move',
    background: 'none',
  },
}));
const SortableDragHandle = ({className = '', isVisible}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.dragIconWrapper, className)}>
      {isVisible ? <GripperIcon /> : null}
    </div>
  );
};

export default SortableHandle(SortableDragHandle);
