/* eslint-disable no-param-reassign */
import { v4 } from 'uuid';
import clsx from 'clsx';
import produce from 'immer';
import React from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import AddIcon from '../../../../../components/icons/AddIcon';
import { getConnectedEdges, layoutElements } from '../lib';
import { useFlowContext } from '../Context';

const useStyles = makeStyles(theme => ({
  addButton: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    padding: 0,
  },
  leftAddButton: {
    left: -26,
  },
  rightAddButton: {
    left: 48,
  },
}));

const generateId = () => v4().replace(/-/g, '').substring(0, 4);

export default ({ id, direction = 'left'}) => {
  const classes = useStyles();
  const { setElements } = useFlowContext();

  const onClick = event => {
    // alert(`add node to the ${direction} of node ${id}`);
    event.stopPropagation();
    const newId = generateId();

    setElements(elements => {
      const newElements = produce(elements, draft => {
        const connectedEdge = getConnectedEdges(id, direction, draft);
        // console.log(connectedEdge);

        draft.push({
          id: newId,
          type: 'pp',
          data: { label: `New node: ${newId}`},
        });

        if (direction === 'left') {
          draft.push({ id: generateId(), source: newId, target: id, type: 'step' });
        } else {
          draft.push({ id: generateId(), source: id, target: newId, type: 'step' });
        }

        connectedEdge.forEach(e => {
          if (direction === 'left') {
            e.target = newId;
          } else {
            e.source = newId;
          }
        });
      });

      return layoutElements(newElements, 'LR');
    });
  };

  return (
    <IconButton
      className={clsx(classes.addButton, classes[`${direction}AddButton`])}
      onClick={event => onClick(event, id, direction)}
    >
      <AddIcon />
    </IconButton>
  );
};
