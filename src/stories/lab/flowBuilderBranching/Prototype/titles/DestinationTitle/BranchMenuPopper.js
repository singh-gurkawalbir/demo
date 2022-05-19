import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import ArrowPopper from '../../../../../../components/ArrowPopper';
import { useFlowContext } from '../../Context';
import { generateId, getAllPPNodes } from '../../lib';
import actions from '../../reducer/actions';
import { getSomeImport, getSomePpImport } from '../../nodeGeneration';

export default function AddNodeMenuPopper({ anchorEl, handleClose }) {
  const open = Boolean(anchorEl);
  const { flow, elements, setState } = useFlowContext();

  const allPPSteps = getAllPPNodes(flow, elements);
  const id = `new-${generateId()}`;
  const flowNode = getSomePpImport(id);
  const resourceNode = getSomeImport(id);

  const handleCallback = stepId => () => {
    const step = allPPSteps.find(s => s.id === stepId);

    setState({
      type: actions.ADD_NEW_STEP,
      resourceType: 'imports',
      path: step.path,
      flowNode,
      resourceNode,
      flowId: flow._id,
    });
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
