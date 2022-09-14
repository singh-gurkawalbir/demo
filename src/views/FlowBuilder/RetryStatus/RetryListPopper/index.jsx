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
    padding: theme.spacing(0, 0.5),
    '& .MuiButton-endIcon': {
      color: theme.palette.secondary.main,
    },
  },
  content: {
    maxWidth: 350,
  },
  menuItem: {
    borderBottom: 0,
  },
  viewResultsPopper: {
    '& .MuiMenuItem-root': {
      padding: theme.spacing(1, 2),
    },
    '& .MuiMenuItem-root+.MuiMenuItem-root': {
      borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    },
  },
  viewResultsPopperArrow: {
    left: '183px !important',
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
        color="primary">
        View results
      </TextButton>

      <ArrowPopper
        id="accountList"
        open={open}
        anchorEl={anchorEl}
        placement="bottom"
        onClose={handleClose}
        classes={{
          popper: classes.viewResultsPopper,
          arrow: classes.viewResultsPopperArrow,
        }}>

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
