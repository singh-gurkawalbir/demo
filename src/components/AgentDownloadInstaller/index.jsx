import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import { Button, MenuItem } from '@material-ui/core';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import actions from '../../actions';


const useStyles = makeStyles({
  donwloadInstallerBtn: {
    padding: 0,
  }
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
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
        <MenuItem onClick={handleInstallerClick('windows')}>Windows</MenuItem>
      </Menu>
      <Button className={classes.donwloadInstallerBtn} data-test="downloadAgentInstaller" onClick={handleMenuClick}>
        Download <ArrowDownIcon />
      </Button>
    </>
  );
}
