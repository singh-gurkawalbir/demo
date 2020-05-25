import React, { Fragment, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, MenuItem, Menu } from '@material-ui/core';
import EllipsisIcon from '../../icons/EllipsisHorizontalIcon';

/**
 * TODO: This should be refactored to look like flow menu. We are mocking the menu items with component and is strongly not recommeneded
 *
 */
const useStyles = makeStyles(theme => ({
  // actionContainer: {
  //   position: 'sticky',
  //   display: 'flex',
  //   overflow: 'hidden',
  //   zIndex: 1,
  // },
  // wrapper: {
  //   '& > .MuiMenu-paper': {
  //     marginLeft: theme.spacing(-2),
  //     '& > ul > li': {
  //       padding: 0,
  //     },
  //     '& > ul > li > button:first-child ': {
  //       padding: 0,
  //       fontFamily: 'unset',
  //       fontWeight: 'unset',
  //       fontSize: 'unset',
  //       minHeight: 42,
  //       paddingLeft: theme.spacing(2),
  //       paddingRight: theme.spacing(2),
  //     },
  //     '& > ul > li > button:first-child:hover ': {
  //       backgroundColor: 'unset',
  //     },
  //   },
  // },
  action: {
    padding: theme.spacing(0, 0),
  },
  actionColHead: {
    // any smaller and table "jiggles" when transitioning to/from hover state
    width: 125,
    textAlign: 'center',
  },
  ellipsisContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function ActionMenu({ actions, selectAction }) {
  console.log('actions', actions);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'row-actions' : undefined;
  const handleMenuClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const renderActionmenu = ({ title, icon, component }) => {
    const handleActionClick = () => {
      selectAction(component);
    };

    return (
      <MenuItem key={title} onClick={handleActionClick}>
        {icon}
        {title}
      </MenuItem>
    );
  };

  if (!actions || !actions.length) return null;

  return (
    <Fragment>
      <IconButton
        data-test="openActionsMenu"
        aria-label="more"
        aria-controls={actionsPopoverId}
        aria-haspopup="true"
        size="small"
        onClick={handleMenuClick}>
        <EllipsisIcon />
      </IconButton>

      <Menu
        elevation={2}
        variant="menu"
        id={actionsPopoverId}
        anchorEl={anchorEl}
        className={classes.wrapper}
        open={open}
        onClose={handleMenuClose}>
        {actions.map(a => renderActionmenu(a))}
      </Menu>
    </Fragment>
  );
}
