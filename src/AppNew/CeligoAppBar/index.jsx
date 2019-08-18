import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Search from '../Search';
import TextToggle from '../../components/TextToggle';
import ElevateOnScroll from '../ElevateOnScroll';
import SlideOnScroll from '../SlideOnScroll';

const useStyles = makeStyles(theme => ({
  appBar: {
    marginLeft: theme.drawerWidth,
    width: `calc(100% - ${theme.spacing(8)}px)`,

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
  actions: {
    display: 'flex',
  },
}));

export default function CeligoAppBar({ shift = false }) {
  const classes = useStyles();

  return (
    <SlideOnScroll threshold={250}>
      <ElevateOnScroll threshold={100}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: shift,
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
            <div className={classes.actions}>
              <Search />
              <IconButton
                size="small"
                aria-label="show 17 new notifications"
                color="inherit">
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </ElevateOnScroll>
    </SlideOnScroll>
  );
}
