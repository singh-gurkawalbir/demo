import React, {useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
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
}));

export default function TerminalNode(props) {
  const classes = useStyles();
  const {isDragging, id} = props;
  const {elements} = useFlowContext();
  const isDropable = useMemo(() => elements.find(ele => ele.id === id).highlight, [elements, id]);

  return (
    <div>
      <DefaultHandle type="target" position={Position.Left} />
      <IconButton
        className={clsx(classes.button,
          {[classes.drop]: isDragging,
            [classes.drop]: isDropable,
          })}>
        <Icon />
      </IconButton>
    </div>
  );
}
