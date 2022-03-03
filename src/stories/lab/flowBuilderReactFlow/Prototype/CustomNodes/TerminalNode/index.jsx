import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position, useStoreState } from 'react-flow-renderer';
import { Tooltip } from '@material-ui/core';
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
    color: theme.palette.secondary.light,
    borderRadius: '50%',
    padding: 2,
  },
}));

export const useIsTerminalOrMergeNodeDroppable = nodeId => {
  const selectedElements = useStoreState(state => state.selectedElements);

  if (!selectedElements) {
    return false;
  }
  const dragElement = selectedElements[0];

  if (!['terminal', 'merge'].includes(dragElement.type)) {
    return false;
  }

  return nodeId !== dragElement.id;
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
        <Tooltip title="Drag to merge with other branch" position="top">
          <span>
            <MergeIcon className={classes.merge} />
          </span>
        </Tooltip>
      )}
    </div>
  );
}
