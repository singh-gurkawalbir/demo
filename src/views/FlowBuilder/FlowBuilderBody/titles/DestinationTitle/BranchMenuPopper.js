import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import ArrowPopper from '../../../../../components/ArrowPopper';
import { useFlowContext } from '../../Context';
import { getAllFlowBranches } from '../../lib';
import actions from '../../../../../actions';

export default function AddNodeMenuPopper({ anchorEl, handleClose }) {
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const { flow, elements } = useFlowContext();

  const branches = getAllFlowBranches(flow, elements);

  const handleCallback = branchId => () => {
    const branch = branches.find(s => s.id === branchId);

    dispatch(actions.flow.addNewPPStep(flow._id, branch.path));
    handleClose();
  };

  return (
    <ArrowPopper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      onClose={handleClose}>

      <List dense>
        {branches.map(({name, id}) => (
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
