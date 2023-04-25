import React, { useState, useCallback } from 'react';
import {
  ClickAwayListener,
  IconButton,
  MenuItem,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ArrowPopper } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import EllipsisHorizontalIcon from '../../../icons/EllipsisHorizontalIcon';
import TrashIcon from '../../../icons/TrashIcon';
import useConfirmDialog from '../../../ConfirmDialog';
import RawHtml from '../../../RawHtml';
import messageStore from '../../../../utils/messageStore';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({
  deleteWrapper: {
    color: theme.palette.error.dark,
  },
}));

export default function RouterMenu({ editorId }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const { confirmDialog } = useConfirmDialog();
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const flowId = useSelector(state => selectors.editor(state, editorId).flowId);
  const flow = useSelector(state => selectors.fbFlow(state, flowId));
  const isViewMode = useSelector(state => selectors.isFlowViewMode(state, flow?._integrationId, flowId));
  const routerId = useSelector(state => selectors.editorRule(state, editorId)?.id);
  const isEdit = useSelector(state => selectors.editor(state, editorId).isEdit);
  const {
    configuredCount,
    unconfiguredCount,
  } = useSelector(state => selectors.fbRouterStepsInfo(state, flowId, routerId), shallowEqual);

  const handleCloseMenu = event => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const handleOpenMenu = event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = useCallback(event => {
    handleCloseMenu(event);

    const message = messageStore('ROUTER_DELETE_CONFIRMATION_MESSAGE', {configuredCount, unconfiguredCount});

    confirmDialog({
      title: 'Confirm delete',
      message: <RawHtml html={message} />,
      buttons: [
        {
          label: 'Delete',
          error: true,
          onClick: () => {
            dispatch(actions.flow.deleteRouter(flowId, routerId));
            history.goBack();
          },
        },
        { label: 'Cancel', variant: 'text' },
      ],
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [confirmDialog, routerId, configuredCount, unconfiguredCount]
  );

  return (
    <>
      <ClickAwayListener onClickAway={handleCloseMenu}>
        <IconButton
          data-test="routerMenu"
          size="small"
          disabled={!isEdit}
          onClick={handleOpenMenu}
          sx={{padding: '3px'}}
        >
          <EllipsisHorizontalIcon />
        </IconButton>
      </ClickAwayListener>

      <ArrowPopper
        id="routerOptions"
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleCloseMenu}
      >
        <MenuItem
          data-test="deleteBranching" className={classes.deleteWrapper} disabled={isViewMode} onClick={handleDelete}
          sx={{fontSize: '14px'}}>
          <TrashIcon /> Delete branching
        </MenuItem>
      </ArrowPopper>
    </>
  );
}
