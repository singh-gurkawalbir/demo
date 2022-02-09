/* eslint-disable no-param-reassign */
import { v4 } from 'uuid';
import produce from 'immer';
import React from 'react';
import { makeStyles, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import AddIcon from '../../../../components/icons/AddIcon';
import { layoutElements } from './lib';
import { useFlowContext } from './Context';
import ArrowPopper from '../../../../components/ArrowPopper';

const useStyles = makeStyles(theme => ({
  addButton: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    padding: 0,
  },
}));

const generateId = () => v4().replace(/-/g, '').substring(0, 4);

export default ({ edgeId }) => {
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
  const handleAddNode = event => {
    // alert(`add node to the ${direction} of node ${id}`);
    event.stopPropagation();
    const newId = generateId();

    setElements(elements => {
      const newElements = produce(elements, draft => {
        const edgeIndex = elements.findIndex(el => el.id === edgeId);
        const oldEdge = draft[edgeIndex];
        const oldSourceId = oldEdge.source;
        const oldTargetId = oldEdge.target;
        const nodeIndex = elements.findIndex(el => el.id === oldSourceId);

        const newNode = {
          id: newId,
          type: 'pp',
          data: { label: `New node: ${newId}`},
        };

        oldEdge.target = newId;

        draft.splice(nodeIndex, 0, newNode);
        draft.push(
          { id: generateId(),
            source: newId,
            target: oldTargetId,
            type: 'default' }
        );
      });

      return layoutElements(newElements, 'LR');
    });
    handleClose();
  };

  return (
    <>
      <IconButton
        className={classes.addButton}
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
            {label: 'Add empty flow step', onClick: event => handleAddNode(event, edgeId)},

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
