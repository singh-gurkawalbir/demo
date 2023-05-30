import { Divider, IconButton, MenuItem } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import ArrowPopper from '../../../ArrowPopper';
import DownloadIcon from '../../../icons/DownloadIcon';
import actions from '../../../../actions';
import EllipsisHorizontalIcon from '../../../icons/EllipsisHorizontalIcon';

const useStyles = makeStyles(theme => ({
  divider: {
    height: theme.spacing(3),
    margin: theme.spacing(0, 0.5),
  },
  errorAction: {
    marginRight: 0,
  },
}));

export default function SplitViewErrorActions({flowId, resourceId, retryDataKey}) {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMenuClick = useCallback(evt => {
    setAnchorEl(evt?.currentTarget);
  }, []);

  const handleDownloadRetryData = useCallback(() => {
    dispatch(actions.errorManager.retryData.download({flowId, resourceId, retryDataKey}));
  }, [dispatch, flowId, resourceId, retryDataKey]);

  return (
    <>
      <IconButton
        startIcon={EllipsisHorizontalIcon}
        onClick={handleMenuClick}
        className={classes.errorAction}>
        <EllipsisHorizontalIcon />
      </IconButton>
      <ArrowPopper
        id="accountList"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        placement="bottom-start">
        <MenuItem onClick={handleDownloadRetryData}>
          {DownloadIcon}
          Download retry data
        </MenuItem>
      </ArrowPopper>
      <Divider className={classes.divider} orientation="vertical" />
    </>
  );
}
