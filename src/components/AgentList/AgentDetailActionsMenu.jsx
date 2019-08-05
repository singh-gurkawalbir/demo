import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Divider from '@material-ui/core/Divider';
import getRoutePath from '../../utils/routePaths';

export default function AgentDetailActionsMenu(props) {
  const { onActionClick, agent } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleActionClick(action) {
    handleMenuClose();
    onActionClick(action);
  }

  return (
    <Fragment>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}>
        <MenuItem
          component={Link}
          to={getRoutePath(`agents/edit/${agent._id}`)}>
          {/* onClick={() => {
            handleActionClick('edit');
          }}> */}
          Edit Agent
        </MenuItem>

        <Divider />
        <MenuItem
          onClick={() => {
            handleActionClick('viewReferences');
          }}>
          View References
        </MenuItem>
        <Divider />

        <MenuItem
          onClick={() => {
            handleActionClick('delete');
          }}>
          Delete Agent
        </MenuItem>
      </Menu>
      <IconButton onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>
    </Fragment>
  );
}
