import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { MenuItem } from '@mui/material';
import { ArrowPopper } from '@celigo/fuse-ui';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import { TextButton } from '../../../../components/Buttons';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import { FILTER_KEYS } from '../../../../utils/errorManagement';

const useStyles = makeStyles(theme => ({
  currentContainer: {
    padding: theme.spacing(0, 0.5),
    fontSize: '0.75rem',
    '& .MuiButton-endIcon': {
      color: theme.palette.secondary.main,
    },
  },
  content: {
    maxWidth: 350,
    '& .MuiMenuItem-root': {
      padding: theme.spacing(1, 2),
    },
    '& .MuiMenuItem-root+.MuiMenuItem-root': {
      borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    },
  },
  menuItem: {
    borderBottom: 0,
  },
}));

export default function RetryListPopper({resources}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const open = !!anchorEl;
  const handleMenu = useCallback(
    event => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    },
    [anchorEl]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleCallback = useCallback(
    id => {
      handleClose();
      history.push(buildDrawerUrl({
        path: drawerPaths.ERROR_MANAGEMENT.V2.ERROR_DETAILS,
        baseUrl: match.url,
        params: { resourceId: id, errorType: FILTER_KEYS.RETRIES},
      }));
    },
    [handleClose, history, match.url]
  );

  return (
    <>
      <TextButton
        data-private
        onClick={handleMenu}
        endIcon={<ArrowDownIcon />}
        className={classes.currentContainer}
        aria-owns={open ? 'accountList' : null}
        aria-haspopup="true"
        color="primary"
        bold>
        View results
      </TextButton>

      <ArrowPopper
        id="accountList"
        open={open}
        anchorEl={anchorEl}
        placement="bottom"
        onClose={handleClose}>
        <div className={classes.content}>
          {resources.map(({name, _id}) => (
            <MenuItem
              button
              className={classes.menuItem}
              onClick={() => handleCallback(_id)}
              key={name}>
              {name}
            </MenuItem>
          ))}
        </div>
      </ArrowPopper>
    </>
  );
}
