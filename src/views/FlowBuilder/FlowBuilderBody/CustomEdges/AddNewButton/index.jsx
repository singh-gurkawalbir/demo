import { ClickAwayListener, IconButton, MenuItem, MenuList, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { ArrowPopper } from '@celigo/fuse-ui';
import AddEmptyStepIcon from '../../../../../components/icons/AddEmptyStepIcon';
import BranchIcon from '../../../../../components/icons/BranchIcon';
import AddIcon from '../../../../../components/icons/AddIcon';
import { useFlowContext } from '../../Context';
import { useHandleAddNode, useHandleAddNewRouter } from '../../../hooks';
import { isNodeConnectedToRouter } from '../../lib';
import { message } from '../../../../../utils/messageStore';
import { selectors } from '../../../../../reducers';

const useStyles = makeStyles(theme => ({
  addButton: {
    position: 'static',
    backgroundColor: theme.palette.background.paper,
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
  iconViewAddButton: {
    position: 'static',
    backgroundColor: theme.palette.background.paper,
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    padding: 0,
    height: '15px',
    width: '15px',
    '& > span': {
      width: 18,
      height: 18,
    },
    '& * svg': {
      width: 15,
      height: 15,
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
            label: 'Add destination / lookup',
            onClick: handleAddNode,
          },
          {
            Icon: BranchIcon,
            disabled,
            label: 'Add branching',
            onClick: handleAddRouter,
          },
        ].map(({ Icon, label, onClick, disabled }) => (
          <Tooltip
            key={label}
            title={disabled ? message.FLOWBUILDER.MAX_ROUTERS_LIMIT_REACHED : ''}
            placement="bottom"
          >
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

const AddNodeToolTip = ({ handleOpenMenu, handleAddNode, edgeId, isIconView }) => {
  const classes = useStyles();

  const { elementsMap } = useFlowContext();
  const isConnectedToRouterOrTerminal = isNodeConnectedToRouter(
    edgeId,
    elementsMap
  );
  const isFlowBranchingEnabled = useSelector(state => selectors.isFlowBranchingEnabled(state));

  if (isConnectedToRouterOrTerminal || !isFlowBranchingEnabled) {
    return (
      <Tooltip
        title={isConnectedToRouterOrTerminal ? 'Add destination / lookup' : ''}
        placement="top"
      >
        <IconButton onClick={handleAddNode} className={clsx({[classes.iconViewAddButton]: isIconView}, {[classes.addButton]: !isIconView})}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <IconButton className={clsx({[classes.iconViewAddButton]: isIconView}, {[classes.addButton]: !isIconView})} onClick={handleOpenMenu}>
      <AddIcon />
    </IconButton>
  );
};

export default ({ edgeId, disabled }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const {flowId} = useFlowContext();

  const isIconView = useSelector(state =>
    selectors.fbIconview(state, flowId) === 'icon'
  );

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
            isIconView={isIconView}
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
