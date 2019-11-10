import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AppBar, Toolbar } from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import GlobalSearch from '../GlobalSearch';
import ElevateOnScroll from '../../components/ElevateOnScroll';
import SlideOnScroll from '../../components/SlideOnScroll';
import ProfileMenuButton from './ProfileMenuButton';
import * as selectors from '../../reducers';
import Notifications from './Notifications';
import LicenseAction from './LicenseAction';
import AccountList from './AccountList';
import EnvironmentToggle from './EnvironmentToggle';
import CeligoBreadcrumb from './CeligoBreadcrumb';

const useStyles = makeStyles(theme => ({
  celigoLogo: {
    height: 36,
    width: 120,
    background: `url(${process.env.CDN_BASE_URI}images/flow-builder/celigo-product-logo.svg) no-repeat center left`,
  },
  unauthenticatedAppBar: {
    display: 'none',
    background: theme.palette.background.paper2,
    height: 36,
  },

  appBar: {
    background: theme.palette.background.paper2,
    marginLeft: theme.drawerWidth,
    width: `calc(100% - ${theme.spacing(7)}px)`,
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
    margin: [[5, 0, 0, 0]],
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
  const { pathname } = useLocation();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  return (
    <SlideOnScroll threshold={500}>
      <ElevateOnScroll threshold={250}>
        <AppBar
          color="inherit"
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: drawerOpened,
          })}>
          <Toolbar className="topBar" variant="dense">
            <CeligoBreadcrumb location={pathname} />
            <ul className={classes.topBarActions}>
              <li>
                <GlobalSearch />
              </li>
              {/* 
                Including the AccountList causes the app to reload 3 times 
                (and re-run all init) I think this is causes by removing the 
                session caching layer we had in place 
              */}
              <li>
                <AccountList />
              </li>
              <li>
                <EnvironmentToggle />
              </li>
              <li>
                <Notifications />
              </li>
              <li>
                <LicenseAction />
              </li>
              <li>
                <ProfileMenuButton />
              </li>
            </ul>
          </Toolbar>
        </AppBar>
      </ElevateOnScroll>
    </SlideOnScroll>
  );
}
