import { IconButton, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import messageStore from '../../../../utils/messageStore';
import ArrowPopper from '../../../ArrowPopper';
import useConfirmDialog from '../../../ConfirmDialog';
import EllipsisIcon from '../../../icons/EllipsisHorizontalIcon';

const useStyles = makeStyles(theme => ({
  actionsMenuPopper: {
    maxWidth: 250,
    top: `${theme.spacing(1)}px !important`,
  },
  purgeErrorEllipsis: {
    marginLeft: theme.spacing(1),
  },
}));

export default function PurgeErrorAction({ flowId, resourceId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const selectedErrorCount = useSelector(state =>
    selectors.selectedErrorIds(state, { flowId, resourceId, isResolved: true }).length
  );

  const handleMenuClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const handlePurge = useCallback(() => {
    confirmDialog({
      title: 'Confirm purge error(s)',
      message: messageStore('MULTIPLE_ERROR_PURGE_CONFIRM_MESSAGE'),
      buttons: [
        {
          label: 'Purge error(s)',
          error: true,
          onClick: () => {
            dispatch(actions.errorManager.flowErrorDetails.purge.request({flowId, resourceId}));
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
    setAnchorEl(null);
  }, [confirmDialog, dispatch, flowId, resourceId]);

  if (!selectedErrorCount) {
    return null;
  }

  return (
    <>
      <IconButton
        data-test="purgeError"
        aria-label="more"
        aria-controls="purgeError"
        aria-haspopup="true"
        size="small"
        onClick={handleMenuClick}
        className={classes.purgeErrorEllipsis}>
        <EllipsisIcon />
      </IconButton>
      <ArrowPopper
        id="purgeError"
        placement="bottom-end"
        restrictToParent={false}
        classes={{ popper: classes.actionsMenuPopper }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}>
        <MenuItem selected disabled className={classes.purgeMenuItem} >
          Purge
        </MenuItem>
        <MenuItem value="selected" onClick={handlePurge}>
          {selectedErrorCount} selected {selectedErrorCount === 1 ? 'error' : 'errors'}
        </MenuItem>
      </ArrowPopper>
    </>
  );
}
