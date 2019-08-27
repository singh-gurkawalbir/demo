import React from 'react';
import { useSelector } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import GlobalSearch from '../GlobalSearch';
import TextToggle from '../../components/TextToggle';
import ElevateOnScroll from '../../components/ElevateOnScroll';
import SlideOnScroll from '../../components/SlideOnScroll';
import ProfileMenuButton from '../ProfileMenuButton';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  appBar: {
    marginLeft: theme.drawerWidth,
    width: `calc(100% - ${theme.spacing(7)}px)`,

    // zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${theme.drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: theme.mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
}));

export default function CeligoAppBar() {
  const classes = useStyles();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  return (
    <SlideOnScroll threshold={500}>
      <ElevateOnScroll threshold={250}>
        <AppBar
          color="secondary"
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: drawerOpened,
          })}>
          <Toolbar>
            <TextToggle
              defaultValue={1}
              exclusive
              variant="appbar"
              options={[
                { value: 1, label: 'Production' },
                { value: 2, label: 'Sandbox' },
              ]}
            />
            <div className={classes.grow} />
            <GlobalSearch />
            <IconButton
              size="small"
              aria-label="show 17 new notifications"
              color="inherit">
              <Badge badgeContent={17} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <ProfileMenuButton />
          </Toolbar>
        </AppBar>
      </ElevateOnScroll>
    </SlideOnScroll>
  );
}
