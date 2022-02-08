/* eslint-disable no-param-reassign */
import { ClickAwayListener, IconButton, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import produce from 'immer';
import React from 'react';
import { v4 } from 'uuid';
import ArrowPopper from '../../../../components/ArrowPopper';
import IconButtonWithTooltip from '../../../../components/IconButtonWithTooltip';
import AddIcon from '../../../../components/icons/AddIcon';
import { useFlowContext } from './Context';

const useStyles = makeStyles(theme => ({
  addButton: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    padding: 0,
  },
}));

const generateId = () => v4().replace(/-/g, '').substring(0, 4);

const AddNodeMenuPopper = ({ anchorEl, handleClose, handleAddNode}) => {
  const classes = useStyles();
  const open = Boolean(anchorEl);

  return (
    <ArrowPopper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      onClose={handleClose}

  >
      <List
        dense className={classes.listWrapper}>
        {[
          {label: 'Add empty flow step', onClick: handleAddNode},

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
  );
};

const isNodeConnectedToRouter = (nodeId, elements) => {
  const {source, target} = elements.find(ele => ele.id === nodeId);

  return elements.filter(e => [source, target].includes(e.id)).some(node => node?.type === 'router');
};

const AddNodeToolTip = ({ handleOpenMenu, handleAddNode, edgeId}) => {
  const classes = useStyles();

  const { elements } = useFlowContext();
  const isConnectedToRouter = isNodeConnectedToRouter(edgeId, elements);

  if (isConnectedToRouter) {
    return (
      <IconButtonWithTooltip
        tooltipProps={{title: isConnectedToRouter ? 'Add empty flow step' : ''}}
        onClick={handleAddNode}
        className={classes.addButton}
    >
        <AddIcon />
      </IconButtonWithTooltip>
    );
  }

  return (
    <IconButton
      className={classes.addButton}
      onClick={handleOpenMenu}
 >
      <AddIcon />
    </IconButton>
  );
};
export default ({ edgeId }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const { setElements } = useFlowContext();
  const handleAddNode = () => {
    const newId = generateId();

    setElements(elements => produce(elements, draft => {
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
    }));
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleCloseMenu}>
        <AddNodeToolTip
          handleOpenMenu={handleOpenMenu} edgeId={edgeId} handleAddNode={handleAddNode} />
      </ClickAwayListener>

      <AddNodeMenuPopper anchorEl={anchorEl} handleClose={handleCloseMenu} handleAddNode={handleAddNode} />
    </>
  );
};
