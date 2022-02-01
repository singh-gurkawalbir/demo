import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Handle, Position } from 'react-flow-renderer';
import AddNodeButton from './AddNodeButton';

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
  handle: {
    border: 0,
    width: 1,
    height: 1,
    backgroundColor: 'transparent',
  },
}));

export default props => {
  const { data, id } = props;
  const { label } = data;
  const classes = useStyles();

  // console.log(props);

  return (
    <div className={classes.root}>
      <Handle className={classes.handle} type="target" position={Position.Left} />
      <div className={classes.contentContainer}>
        <AddNodeButton id={id} direction="left" />
        {label}
        <AddNodeButton id={id} direction="right" />
      </div>
      <Handle className={classes.handle} type="source" position={Position.Right} />
    </div>
  );
};
