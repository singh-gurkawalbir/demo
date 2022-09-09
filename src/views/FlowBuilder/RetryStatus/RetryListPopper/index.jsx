import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { ClickAwayListener, MenuItem } from '@material-ui/core';
import ArrowPopper from '../../../../components/ArrowPopper';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import { TextButton } from '../../../../components/Buttons';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import { FILTER_KEYS } from '../../../../utils/errorManagement';

const useStyles = makeStyles(theme => ({
  currentContainer: {
    color: theme.palette.secondary.main,
    padding: 0,
    paddingRight: theme.spacing(1),
    marginRight: theme.spacing(-1),
    '& svg': {
      marginLeft: theme.spacing(0.5),
    },
    '&:hover': {
      background: 'none',
      color: theme.palette.text.secondary,
      '& svg': {
        color: theme.palette.text.secondary,
      },
    },
  },
  content: {
    maxWidth: 350,
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
        aria-haspopup="true">
        View results
      </TextButton>

      <ArrowPopper
        id="accountList"
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleClose}>

        <ClickAwayListener onClickAway={handleClose}>
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
        </ClickAwayListener>
      </ArrowPopper>
    </>
  );
}
