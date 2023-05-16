import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ArrowPopper, TextButton } from '@celigo/fuse-ui';
import { MenuItem } from '@mui/material';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import actions from '../../actions';

export default function AgentDownloadInstaller({ agentId }) {
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
        data-test="downloadAgentInstaller"
        onClick={handleMenuClick}>
        Download
      </TextButton>
    </>
  );
}
