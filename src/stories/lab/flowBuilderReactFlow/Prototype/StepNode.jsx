import clsx from 'clsx';
import React from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import { Handle, Position } from 'react-flow-renderer';
import AddIcon from '../../../../components/icons/AddIcon';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 3,
    border: 'solid 1px',
    padding: 10,
    textAlign: 'center',
    width: 150,
    backgroundColor: theme.palette.common.white,
    margin: theme.spacing(0, -0.5),
  },
  contentContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    padding: 0,
  },
  leftAddButton: {
    left: -48,
  },
  rightAddButton: {
    left: 48,
  },
  handle: {
    border: 0,
    width: 1,
    height: 1,
    backgroundColor: 'transparent',
  },
}));

export default props => {
  const { data } = props;
  const { label } = data;
  const classes = useStyles();

  // console.log(props);

  return (
    <div className={classes.root}>
      <Handle className={classes.handle} type="target" position={Position.Left} />
      <div className={classes.contentContainer}>
        <IconButton className={clsx(classes.addButton, classes.leftAddButton)}><AddIcon /></IconButton>
        {label}
        <IconButton className={clsx(classes.addButton, classes.rightAddButton)}><AddIcon /></IconButton>
      </div>
      <Handle className={classes.handle} type="source" position={Position.Right} />
    </div>
  );
};
