/* eslint-disable no-param-reassign */
import { v4 } from 'uuid';
import clsx from 'clsx';
import produce from 'immer';
import React from 'react';
import { makeStyles, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import AddIcon from '../../../../../components/icons/AddIcon';
import { getConnectedEdges, layoutElements } from '../lib';
import { useFlowContext } from '../Context';
import ArrowPopper from '../../../../../components/ArrowPopper';

const useStyles = makeStyles(theme => ({
  addButton: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    padding: 0,
    top: -56,
  },
  leftAddButton: {
    left: -26,
  },
  rightAddButton: {
    left: 48,
  },
}));

const generateId = () => v4().replace(/-/g, '').substring(0, 4);
const addNodesWithStepHandle = (newId, id, direction) => [
  {
    id: newId,
    type: 'pp',
    data: { label: `New node: ${newId}`},
  },
  direction === 'left' ? { id: generateId(), source: newId, target: id, type: 'step' } : { id: generateId(), source: id, target: newId, type: 'step' },

];

export default ({ id, direction = 'left'}) => {
  const classes = useStyles();
  const { setElements } = useFlowContext();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onAddEmptyFlowStep = event => {
    // alert(`add node to the ${direction} of node ${id}`);
    event.stopPropagation();
    const newId = generateId();

    setElements(elements => {
      const newElements = produce(elements, draft => {
        const connectedEdge = getConnectedEdges(id, direction, draft);
        // console.log(connectedEdge);
        const index = elements.findIndex(el => el.id === id);
        const newNodes = addNodesWithStepHandle(newId, id, direction);

        draft.splice(direction === 'left' ? index : index + 1, 0, ...newNodes);
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
    handleClose();
  };

  return (
    <>
      <IconButton
        className={clsx(classes.addButton, classes[`${direction}AddButton`])}
        onClick={handleClick}
    >
        <AddIcon />
      </IconButton>
      <ArrowPopper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleClose}

      >
        <List
          dense className={classes.listWrapper}>
          {[
            {label: 'Add empty flow step', onClick: event => onAddEmptyFlowStep(event, id, direction)},

            {label: 'Add branching', onClick: handleClose },
          ].map(({label, onClick}) => (
            <ListItem
              button
              onClick={onClick}
              key={label}>
              <ListItemText >{label}</ListItemText>
            </ListItem>
          ))}
        </List>

      </ArrowPopper>

    </>
  );
};
