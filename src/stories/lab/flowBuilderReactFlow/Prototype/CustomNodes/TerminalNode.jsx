import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position, Handle } from 'react-flow-renderer';
import { IconButton } from '@material-ui/core';
import clsx from 'clsx';
import Icon from '../../../../../components/icons/FlowsIcon';
import DefaultHandle from './Handles/DefaultHandle';
import { useFlowContext } from '../Context';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    padding: 0,
  },
  grow: {
    transform: 'scale(1.3)',
    boxShadow: '2px grey',
  },
  drop: {
    transform: 'scale(1.5)',
    boxShadow: '2px 2px 5px blue',
  },
  handle: {
    left: 0,
    width: 26,
    height: 26,
    backgroundColor: 'transparent',
  },
  sourceHandle: {
    border: 'solid 1px grey',
  },
  targetHandle: {
    border: 'solid 2px blue',
  },
}));

export default function TerminalNode(props) {
  const classes = useStyles();
  const {id} = props;
  const {mergeNodeId} = useFlowContext();

  return (
    <div>
      <DefaultHandle type="target" position={Position.Left} />
      <IconButton
        className={classes.button}>
        <Icon />
      </IconButton>
      {mergeNodeId && mergeNodeId !== id ? (
        <Handle
          type="target"
          onConnect={params => console.log('handle terminal node onConnect', params)}
          // isConnectable
          // isValidConnection={event => console.log(event)}
          position={Position.Right}
          className={clsx(classes.handle, classes.targetHandle)} />
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className={clsx(classes.handle, classes.sourceHandle)} />
      )}
    </div>
  );
}
