import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { ArrowPopper } from '@celigo/fuse-ui';
import { MenuItem } from '@mui/material';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import actions from '../../actions';
import { TextButton } from '../Buttons';

const useStyles = makeStyles({
  donwloadInstallerBtn: {
    padding: 0,
  },
});

export default function AgentDownloadInstaller({ agentId }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleInstallerClick(osType) {
    return () => {
      handleMenuClose();
      dispatch(actions.agent.downloadInstaller(osType, agentId));
    };
  }

  return (
    <>
      <ArrowPopper anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
        <MenuItem onClick={handleInstallerClick('windows')}>Windows</MenuItem>
      </ArrowPopper>
      <TextButton
        endIcon={<ArrowDownIcon />}
        className={classes.donwloadInstallerBtn}
        data-test="downloadAgentInstaller"
        onClick={handleMenuClick}>
        Download
      </TextButton>
    </>
  );
}
