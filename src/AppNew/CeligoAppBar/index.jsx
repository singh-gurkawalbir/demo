import React from 'react';
import { useSelector } from 'react-redux';
import {
  AppBar,
  Breadcrumbs,
  Link,
  Toolbar,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import GlobalSearch from '../GlobalSearch';
import TextToggle from '../../components/TextToggle';
import ElevateOnScroll from '../../components/ElevateOnScroll';
import SlideOnScroll from '../../components/SlideOnScroll';
import ProfileMenuButton from '../ProfileMenuButton';
import * as selectors from '../../reducers';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon';
import Notifications from './Notifications';
import LicenseAction from './LicenseAction';

const useStyles = makeStyles(theme => ({
  celigoLogo: {
    height: 36,
    width: 120,
    background: `url(${process.env.CDN_BASE_URI}images/flow-builder/celigo-product-logo.svg) no-repeat center left`,
  },
  unauthenticatedAppBar: {
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
    '& li': {
      float: 'left',
      marginRight: theme.spacing(3),
      '&:last-child': {
        marginRight: 0,
      },
    },
  },
  addons: {
    textTransform: 'unset',
    fontSize: 13,
  },
}));

export default function CeligoAppBar(props) {
  const classes = useStyles();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const authenticated = useSelector(state => selectors.isAuthenticated(state));
  const { location } = props;

  return (
    <SlideOnScroll threshold={500}>
      <ElevateOnScroll threshold={250}>
        {!authenticated ? (
          <AppBar className={classes.unauthenticatedAppBar}>
            {location && location.pathname === '/pg/signin' && (
              <span className={classNames(classes.celigoLogo)} />
            )}
          </AppBar>
        ) : (
          <AppBar
            color="inherit"
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: drawerOpened,
            })}>
            <Toolbar className="topBar" variant="dense">
              <Breadcrumbs
                maxItems={3}
                separator={<ArrowRightIcon fontSize="small" />}
                aria-label="breadcrumb"
                className={classes.breadCrumb}>
                <Link color="inherit" href="/pg">
                  Home
                </Link>
                <Link color="inherit" href="/pg">
                  Profile
                </Link>
                <Link color="inherit" href="/pg">
                  Subscription
                </Link>
                <Typography variant="body2" className={classes.addons}>
                  Add-ons
                </Typography>
              </Breadcrumbs>
              <ul className={classes.topBarActions}>
                <li>
                  <GlobalSearch />
                </li>
                <li>
                  <TextToggle
                    defaultValue={1}
                    exclusive
                    options={[
                      { value: 1, label: 'Production' },
                      { value: 2, label: 'Sandbox' },
                    ]}
                  />
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
        )}
      </ElevateOnScroll>
    </SlideOnScroll>
  );
}
