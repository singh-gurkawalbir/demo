import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position, useStoreState } from 'react-flow-renderer';
import { IconButton } from '@material-ui/core';
import clsx from 'clsx';
import Icon from '../../../../../components/icons/MergeIcon';
import DefaultHandle from './Handles/DefaultHandle';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    padding: 0,
    '& > span': {
      width: 20,
      height: 20,
      '& > svg': {
        width: '0.7em',
      },
    },
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

export const useIsTerminalOrMergeNodeDroppable = nodeId => {
  const draggingEles = useStoreState(state => state.selectedElements);

  if (!draggingEles) {
    return false;
  }
  const draggingEle = draggingEles[0];

  if (!['terminal', 'merge'].includes(draggingEle.type)) {
    return false;
  }

  return nodeId !== draggingEle.id;
};

export default function TerminalNode(props) {
  const classes = useStyles();
  const {id} = props;

  const isDroppable = useIsTerminalOrMergeNodeDroppable(id);

  return (
    <div>
      <DefaultHandle type="target" position={Position.Left} />
      <IconButton
        className={clsx(classes.button, {
          [classes.drop]: isDroppable })}>
        <Icon />
      </IconButton>
    </div>
  );
}
