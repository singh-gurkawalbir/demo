import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { dispatch } from 'd3';
import ArrowPopper from '../../../../../components/ArrowPopper';
import { useFlowContext } from '../../Context';
import { getAllPPNodes } from '../../lib';
import actions from '../../../../../actions';

export default function AddNodeMenuPopper({ anchorEl, handleClose }) {
  const open = Boolean(anchorEl);
  const { flow, elements } = useFlowContext();

  const allPPSteps = getAllPPNodes(flow, elements);

  const handleCallback = stepId => () => {
    const step = allPPSteps.find(s => s.id === stepId);

    dispatch(actions.flow.addNewPPStep(flow._id, step.path));
    handleClose();
  };

  return (
    <ArrowPopper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      onClose={handleClose}>

      <List dense>
        {allPPSteps.map(({name, id}) => (
          <ListItem
            button
            onClick={handleCallback(id)}
            key={name}>
            <ListItemText >{name}</ListItemText>
          </ListItem>
        ))}
      </List>

    </ArrowPopper>
  );
}
