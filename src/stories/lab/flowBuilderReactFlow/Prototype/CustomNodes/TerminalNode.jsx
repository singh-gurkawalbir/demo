import produce from 'immer';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position, Handle, getConnectedEdges } from 'react-flow-renderer';
import { IconButton } from '@material-ui/core';
import clsx from 'clsx';
import Icon from '../../../../../components/icons/MergeIcon';
import DefaultHandle from './Handles/DefaultHandle';
import { useFlowContext } from '../Context';
import { findNodeIndex, generateNewNode } from '../lib';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    padding: 2,
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
    width: 30,
    height: 30,
    backgroundColor: 'transparent',
    border: 'solid 0px',
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
  const {mergeNodeId, setElements} = useFlowContext();

  const handleConnect = ({source, target}) => {
    // both source and target nodes need to connect to a new "merge" node,
    // and then we delete the terminal nodes.
    setElements(elements => produce(elements, draft => {
      const sourceIndex = findNodeIndex(source, draft);
      const sourceNode = draft[sourceIndex];
      const targetIndex = findNodeIndex(target, draft);
      const targetNode = draft[targetIndex];
      const newNode = generateNewNode();
      const edges = getConnectedEdges([sourceNode, targetNode], draft);

      edges[0].target = newNode.id;
      edges[1].target = newNode.id;

      draft[sourceIndex] = newNode; // replace
      draft.splice(targetIndex, 1); // delete
    }));
  };

  return (
    <div>
      <DefaultHandle type="target" position={Position.Left} />
      <IconButton className={classes.button}>
        <Icon />
      </IconButton>
      {mergeNodeId && mergeNodeId !== id ? (
        <Handle
          type="target"
          // onConnect={params => console.log('handle terminal node onConnect', params)}
          // isValidConnection={event => console.log(event)}
          position={Position.Right}
          className={clsx(classes.handle, classes.targetHandle)} />
      ) : (
        <Handle
          type="source"
          onConnect={handleConnect}
          position={Position.Right}
          className={clsx(classes.handle, classes.sourceHandle)} />
      )}
    </div>
  );
}
