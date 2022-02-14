/* eslint-disable no-param-reassign */
import { ClickAwayListener, IconButton, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import React from 'react';
import ArrowPopper from '../../../../../components/ArrowPopper';
import IconButtonWithTooltip from '../../../../../components/IconButtonWithTooltip';
import AddIcon from '../../../../../components/icons/AddIcon';
import { useFlowContext } from '../Context';
import actions from '../reducer/actions';

const useStyles = makeStyles(theme => ({
  addButton: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
    padding: 0,
  },
}));

const AddNodeMenuPopper = ({ anchorEl, handleClose, handleAddNode, handleAddRouter}) => {
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

          {label: 'Add branching', onClick: handleAddRouter },
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

const isNodeConnectedToRouterOrTerminal = (nodeId, elements) => {
  const {source, target} = elements.find(ele => ele.id === nodeId);

  return elements.filter(e => [source, target].includes(e.id)).some(node => ['router', 'terminal'].includes(node?.type));
};

const AddNodeToolTip = ({ handleOpenMenu, handleAddNode, edgeId}) => {
  const classes = useStyles();

  const { elements } = useFlowContext();
  const isConnectedToRouterOrTerminal = isNodeConnectedToRouterOrTerminal(edgeId, elements);

  if (isConnectedToRouterOrTerminal) {
    return (
      <IconButtonWithTooltip
        tooltipProps={{title: isConnectedToRouterOrTerminal ? 'Add empty flow step' : '', placement: 'top'}}
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

  const { dispatchFlowUpdate } = useFlowContext();
  const handleAddNode = () => {
    dispatchFlowUpdate({type: actions.ADD_NEW_NODE, edgeId});
  };
  const handleAddRouter = () => {
    dispatchFlowUpdate({type: actions.ADD_NEW_ROUTER, edgeId});
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleCloseMenu}>
        <span>
          <AddNodeToolTip
            handleOpenMenu={handleOpenMenu}
            edgeId={edgeId}
            handleAddNode={handleAddNode} />
        </span>
      </ClickAwayListener>

      <AddNodeMenuPopper anchorEl={anchorEl} handleClose={handleCloseMenu} handleAddNode={handleAddNode} handleAddRouter={handleAddRouter} />
    </>
  );
};
