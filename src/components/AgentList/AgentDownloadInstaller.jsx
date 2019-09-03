import { Fragment, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Divider from '@material-ui/core/Divider';

export default function AgentDownloadInstaller(props) {
  const { onInstallerClick } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleInstallerClick(osType) {
    return () => {
      handleMenuClose();
      onInstallerClick(osType);
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
      <IconButton onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>
    </Fragment>
  );
}
