import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position, useStoreState } from 'react-flow-renderer';
import { IconButton } from '@material-ui/core';
import CircleIcon from './CircleIcon';
import MergeIcon from '../../../../../../components/icons/MergeIcon';
import DefaultHandle from '../Handles/DefaultHandle';

const useStyles = makeStyles(theme => ({
  container: {
    width: 34,
    height: 34,
    display: 'flex',
    alignItems: 'center',
  },
  merge: {
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
    <div className={classes.container}>
      <DefaultHandle type="target" position={Position.Left} />
      {isDroppable ? (
        <CircleIcon />
      ) : (
        <IconButton className={classes.merge}>
          <MergeIcon />
        </IconButton>
      )}
    </div>
  );
}
