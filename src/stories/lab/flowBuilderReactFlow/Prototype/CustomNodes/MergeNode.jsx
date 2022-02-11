import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { IconButton } from '@material-ui/core';
import clsx from 'clsx';
import Icon from '../../../../../components/icons/AddIcon';
import DefaultHandle from './Handles/DefaultHandle';
import { useIsTerminalOrMergeNodeDroppable } from './TerminalNode';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
  },
  drop: {
    transform: 'scale(1.5)',
    boxShadow: '2px 2px 5px blue',
  },
}));

export default function MergeNode({id}) {
  const classes = useStyles();

  const isDroppable = useIsTerminalOrMergeNodeDroppable(id);

  return (
    <div>
      <DefaultHandle type="target" position={Position.Left} />

      <IconButton
        className={clsx(classes.button, {
          [classes.drop]: isDroppable}
        )}>
        <Icon />
      </IconButton>
    </div>
  );
}
