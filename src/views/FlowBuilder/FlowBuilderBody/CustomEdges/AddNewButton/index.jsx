/* eslint-disable no-param-reassign */
import {
  ClickAwayListener,
  IconButton,
  makeStyles,
  MenuItem,
  MenuList,
  Tooltip,
} from '@material-ui/core';
import React from 'react';
import ArrowPopper from '../../../../../components/ArrowPopper';
import AddEmptyStepIcon from '../../../../../components/icons/AddEmptyStepIcon';
import BranchIcon from '../../../../../components/icons/BranchIcon';
import AddIcon from '../../../../../components/icons/AddIcon';
import { useFlowContext } from '../../Context';
import { useHandleAddNode, useHandleAddNewRouter } from '../../../hooks';
import { isNodeConnectedToRouter } from '../../lib';
import messageStore from '../../../../../utils/messageStore';

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

const AddNodeMenuPopper = ({
  anchorEl,
  handleClose,
  handleAddNode,
  handleAddRouter,
  disabled,
}) => {
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
          {
            Icon: AddEmptyStepIcon,
            label: 'Add empty flow step',
            onClick: handleAddNode,
          },
          {
            Icon: BranchIcon,
            disabled,
            label: 'Add branching',
            onClick: handleAddRouter,
          },
        ].map(({ Icon, label, onClick, disabled }) => (
          <Tooltip key="key" title={disabled ? messageStore('MAX_ROUTERS_LIMIT_REACHED') : ''} placement="bottom">
            <span>
              <MenuItem key={label} onClick={onClick} disabled={disabled}>
                <Icon /> {label}
              </MenuItem>
            </span>
          </Tooltip>

        ))}
      </MenuList>
    </ArrowPopper>
  );
};

const AddNodeToolTip = ({ handleOpenMenu, handleAddNode, edgeId }) => {
  const classes = useStyles();

  const { elementsMap } = useFlowContext();
  const isConnectedToRouterOrTerminal = isNodeConnectedToRouter(edgeId, elementsMap);

  if (isConnectedToRouterOrTerminal) {
    return (
      <Tooltip
        title={isConnectedToRouterOrTerminal ? 'Add empty flow step' : ''}
        placement="top"
      >
        <IconButton onClick={handleAddNode} className={classes.addButton}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <IconButton className={classes.addButton} onClick={handleOpenMenu}>
      <AddIcon />
    </IconButton>
  );
};
export default ({ edgeId, disabled }) => {
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
            handleAddNode={handleAddNode}
          />
        </span>
      </ClickAwayListener>

      <AddNodeMenuPopper
        anchorEl={anchorEl}
        disabled={disabled}
        handleClose={handleCloseMenu}
        handleAddNode={handleAddNode}
        handleAddRouter={handleAddRouter}
      />
    </>
  );
};
