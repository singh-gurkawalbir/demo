import { Fragment, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';

export default function AccessTokenActionsMenu(props) {
  const { accessToken, onActionClick } = props;
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
        {accessToken.permissions.activate && (
          <MenuItem
            onClick={() => {
              handleActionClick('reactivate');
            }}>
            Reactivate token
          </MenuItem>
        )}
        {accessToken.permissions.revoke && (
          <MenuItem
            onClick={() => {
              handleActionClick('revoke');
            }}>
            Revoke token
          </MenuItem>
        )}
        <Divider />
        {accessToken.permissions.generateToken && (
          <MenuItem
            onClick={() => {
              handleActionClick('generate');
            }}>
            Regenerate token
          </MenuItem>
        )}
        {!accessToken.permissions.generateToken && (
          <Tooltip
            title={accessToken.permissionReasons.generateToken}
            placement="top">
            <div>
              <MenuItem
                disabled
                onClick={() => {
                  handleActionClick('generate');
                }}>
                Regenerate token
              </MenuItem>
            </div>
          </Tooltip>
        )}
        <Divider />
        {accessToken.permissions.edit ? (
          <MenuItem
            onClick={() => {
              handleActionClick('edit');
            }}>
            Edit token
          </MenuItem>
        ) : (
          <Tooltip title={accessToken.permissionReasons.edit} placement="top">
            <div>
              <MenuItem
                disabled
                onClick={() => {
                  handleActionClick('edit');
                }}>
                Edit token
              </MenuItem>
            </div>
          </Tooltip>
        )}
        <Divider />
        <MenuItem
          onClick={() => {
            handleActionClick('audit');
          }}>
          View audit log
        </MenuItem>
        <Divider />
        {accessToken.permissions.delete ? (
          <MenuItem
            onClick={() => {
              handleActionClick('delete');
            }}>
            Delete token
          </MenuItem>
        ) : (
          <Tooltip title={accessToken.permissionReasons.delete} placement="top">
            <div>
              <MenuItem
                disabled
                onClick={() => {
                  handleActionClick('delete');
                }}>
                Delete token
              </MenuItem>
            </div>
          </Tooltip>
        )}
      </Menu>
      <IconButton onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>
    </Fragment>
  );
}
