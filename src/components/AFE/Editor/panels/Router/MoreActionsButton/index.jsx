/* eslint-disable no-param-reassign */
import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ClickAwayListener,
  IconButton,
  MenuItem,
  Tooltip,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowPopper } from '@celigo/fuse-ui';
import EllipsisHorizontalIcon from '../../../../../icons/EllipsisHorizontalIcon';
import EditIcon from '../../../../../icons/EditIcon';
import TrashIcon from '../../../../../icons/TrashIcon';
import { selectors } from '../../../../../../reducers';
import useConfirmDialog from '../../../../../ConfirmDialog';
import { buildDrawerUrl, drawerPaths } from '../../../../../../utils/rightDrawer';
import RawHtml from '../../../../../RawHtml';
import actions from '../../../../../../actions';
import messageStore, { message } from '../../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  deleteWrapper: {
    color: theme.palette.error.dark,
  },
}));

export default function MoreActionsButton({editorId, position, pageProcessors = [], allowDeleting}) {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const { confirmDialog } = useConfirmDialog();
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const handleCloseMenu = event => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const branches = useSelector(state => selectors.editor(state, editorId).rule.branches);
  const handleOpenMenu = event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleEdit = e => {
    e.stopPropagation();
    history.push(buildDrawerUrl({
      path: drawerPaths.FLOW_BUILDER.BRANCH_EDIT,
      baseUrl: history.location.pathname,
      params: { position },
    }));
  };

  const handleDeleteBranch = useCallback(event => {
    event.stopPropagation();
    handleCloseMenu(event);

    const configuredCount = pageProcessors.filter(pp => !!pp.type).length;
    const unconfiguredCount = pageProcessors.filter(pp => !pp.type).length;
    const message = messageStore('AFE_EDITOR_PANELS_INFO.BRANCH_DELETE_CONFIRMATION_MESSAGE', {configuredCount, unconfiguredCount});

    confirmDialog({
      title: 'Confirm delete',
      message: <RawHtml html={message} />,
      buttons: [
        {
          label: 'Delete',
          error: true,
          onClick: () => {
            const branchesCopy = [...branches];

            branchesCopy.splice(position, 1);
            dispatch(actions.editor.patchRule(editorId, branchesCopy, {rulePath: 'branches'}));
          },
        },
        { label: 'Cancel', variant: 'text' },
      ],
    });
  },
  [branches, confirmDialog, dispatch, editorId, pageProcessors, position]
  );
  const handleArrowPopperClick = e => {
    e.stopPropagation();
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleCloseMenu}>
        <IconButton size="small" onClick={handleOpenMenu}>
          <EllipsisHorizontalIcon />
        </IconButton>
      </ClickAwayListener>

      <ArrowPopper
        id="branchOptions"
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleCloseMenu}
        onClick={handleArrowPopperClick}
      >
        <MenuItem data-test={`edit-branch-${position}`} onClick={handleEdit}>
          <EditIcon /> Edit branch name/description
        </MenuItem>

        <Tooltip title={allowDeleting ? '' : message.AFE_EDITOR_PANELS_INFO.DELETE_LAST_BRANCH_MESSAGE} placement="bottom" aria-label="no notifications">
          <span>
            <MenuItem disabled={!allowDeleting} className={classes.deleteWrapper} data-test={`deleteBranch-${position}`} onClick={handleDeleteBranch}>
              <TrashIcon /> Delete branch
            </MenuItem>
          </span>
        </Tooltip>

      </ArrowPopper>
    </>
  );
}
