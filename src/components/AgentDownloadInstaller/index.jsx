import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import { Button, MenuItem } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
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
    <Fragment>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
        <MenuItem onClick={handleInstallerClick('windows')}>Windows</MenuItem>
        <Divider />
        <MenuItem onClick={handleInstallerClick('linux')}>
          Linux (BETA)
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleInstallerClick('macOS')}>
          Mac OS (BETA)
        </MenuItem>
      </Menu>
      <Button data-test="downloadAgentInstaller" onClick={handleMenuClick}>
        Download <ArrowDownIcon />
      </Button>
    </Fragment>
  );
}
