/* eslint-disable no-param-reassign */
import { ClickAwayListener, IconButton, makeStyles, MenuItem, MenuList } from '@material-ui/core';
import React from 'react';
import ArrowPopper from '../../../../../components/ArrowPopper';
import IconButtonWithTooltip from '../../../../../components/IconButtonWithTooltip';
import AddEmptyStepIcon from '../../../../../components/icons/AddEmptyStepIcon';
import BranchIcon from '../../../../../components/icons/BranchIcon';
import AddIcon from '../../../../../components/icons/AddIcon';
import { useFlowContext } from '../../Context';
import { useHandleAddNode, useHandleAddNewRouter } from '../../hooks';
import { isNodeConnectedToRouter } from '../../lib';

const useStyles = makeStyles(theme => ({
  addButton: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    padding: 0,
    '& > span': {
      width: 18,
      height: 18,
    },
    '& * svg': {
      width: 20,
      height: 20,
    },
  },
  listItemIcon: {
    minWidth: 'unset',
    marginRight: theme.spacing(1),
  },
}));

const AddNodeMenuPopper = ({ anchorEl, handleClose, handleAddNode, handleAddRouter}) => {
  const open = Boolean(anchorEl);

  return (
    <ArrowPopper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      onClose={handleClose}
    >
      <MenuList>
        {[
          {Icon: AddEmptyStepIcon, label: 'Add empty flow step', onClick: handleAddNode},
          {Icon: BranchIcon, label: 'Add branching', onClick: handleAddRouter },
        ].map(({Icon, label, onClick}) => (

          <MenuItem key={label} onClick={onClick}>
            <Icon /> {label}
          </MenuItem>
        ))}
      </MenuList>
    </ArrowPopper>
  );
};

const AddNodeToolTip = ({ handleOpenMenu, handleAddNode, edgeId}) => {
  const classes = useStyles();

  const { elements } = useFlowContext();
  const isConnectedToRouterOrTerminal = isNodeConnectedToRouter(edgeId, elements);

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

  const handleAddNode = useHandleAddNode(edgeId);
  const handleAddRouter = useHandleAddNewRouter(edgeId);

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

      <AddNodeMenuPopper
        anchorEl={anchorEl}
        handleClose={handleCloseMenu}
        handleAddNode={handleAddNode}
        handleAddRouter={handleAddRouter}
      />
    </>
  );
};
