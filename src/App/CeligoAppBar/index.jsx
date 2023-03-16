import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar } from '@mui/material';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import ProfileMenuButton from './ProfileMenuButton';
import { selectors } from '../../reducers';
import Notifications from './Notifications';
import LicenseAction from './LicenseAction';
import AccountList from './AccountList';
import EnvironmentToggle from './EnvironmentToggle';
// import ThemeToggle from './ThemeToggle';
import CeligoBreadcrumb from './CeligoBreadcrumb';
// import GlobalSearch from './GlobalSearch';

const useStyles = makeStyles(theme => ({
  appBar: {
    background: theme.palette.background.default,
    marginLeft: theme.drawerWidth,
    width: `calc(100% - ${theme.spacing(7)})`,
    height: 36,
    overflow: 'hidden',
    boxSizing: 'border-box',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.only('xs')]: {
      height: 'auto',
    },
  },
  appBarShift: {
    width: `calc(100% - ${theme.drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: theme.mixins.toolbar,
  breadCrumb: {
    flexGrow: 1,
    '& li': {
      fontSize: 13,
      '& a': {
        color: theme.palette.secondary.light,
        '&:hover': {
          textDecoration: 'none',
          color: theme.palette.primary.main,
        },
      },
    },
  },
  topBar: {
    '& button': {
      padding: 0,
    },
  },
  topBarActions: {
    listStyle: 'none',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    '& li': {
      float: 'left',
      marginRight: theme.spacing(3),
      '&:last-child': {
        marginRight: 0,
      },
      '&:empty': {
        display: 'none',
      },
    },
  },
  addons: {
    textTransform: 'unset',
    fontSize: 13,
  },
}));

export default function CeligoAppBar() {
  const classes = useStyles();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  return (
    <AppBar
      color="inherit"
      position="fixed"
      elevation={0}
      className={clsx(classes.appBar, {
        [classes.appBarShift]: drawerOpened,
      })}
    >
      <Toolbar className="topBar" variant="dense">
        <CeligoBreadcrumb />
        <ul className={classes.topBarActions}>
          {/*
                Including the AccountList causes the app to reload 3 times
                (and re-run all init) I think this is causes by removing the
                session caching layer we had in place
              */}
          {/* To toggle the global search feature, please uncomment the below line */}
          {/* <li><GlobalSearch /></li> */}
          <li>
            <AccountList />
          </li>
          <li>
            <LicenseAction />
          </li>
          <li>
            <EnvironmentToggle />
          </li>
          <li>
            <Notifications />
          </li>
          <li>
            <ProfileMenuButton />
          </li>
        </ul>
      </Toolbar>
    </AppBar>
  );
}
