import { ButtonBase, Chip } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import CeligoLogo from '../../components/CeligoLogo';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon';
import CeligoMarkIcon from '../../components/icons/CeligoMarkIcon';
import { selectors } from '../../reducers';
import MenuList from './MenuList';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: theme.drawerWidth,
    borderRight: 0,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    '& > div': {
      borderRight: 0,
    },
    '& > div > div': {
      minHeight: 10,
    },
  },
  drawerOpen: {
    width: theme.drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 4,
  },
  toolbar: theme.mixins.toolbar,

  menuContainer: {
    backgroundColor: theme.palette.background.drawer,
    color: theme.palette.common.white,
    // color: theme.palette.secondary.contrastText,
    overflow: 'hidden',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '75px auto 140px',
    '& > div:first-child': {
      alignSelf: 'center',
      justifySelf: 'center',
    },
    '& > div:last-child': {
      alignSelf: 'end',
      margin: theme.spacing(0, 0, 2, 0.5),
    },
  },
  menuContainerSandbox: {
    gridTemplateRows: `${theme.appBarHeight +
      theme.pageBarHeight}px auto 140px`,
  },

  toggleContainer: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
    '& svg': {
      color: theme.palette.text.hint,
    },
  },
  menuList: {
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  drawerToggle: {
    border: '1px solid',
    borderColor: theme.palette.background.drawer2,
    borderRadius: 4,
    width: theme.spacing(3),
    height: theme.spacing(3),
    padding: 0,
  },
  drawerToggleSandbox: {
    '& svg': {
      fill: theme.palette.background.paper,
    },
    '&:hover': {
      '& svg': {
        fill: theme.palette.background.drawer,
      },
    },
  },
  logoContainer: {
    alignItems: 'center',
    display: 'inline-flex',
    flexDirection: 'column',
    fill: theme.palette.primary.dark,
    color: theme.palette.primary.dark,
    '& svg': {
      fill: theme.palette.primary.dark,
    },
  },
  logoContainerSandbox: {
    '& > .MuiIconButton-root': {
      '&:hover': {
        '& svg': {
          fill: theme.palette.primary.dark,
        },
      },
    },
    '& svg': {
      fill: theme.palette.common.white,
    },
  },
  logo: {
    width: 90,
    display: 'inline-block',
  },
  sandboxChip: {
    color: theme.palette.common.white,
    borderColor: theme.palette.common.white,
    height: 'unset',
    marginTop: theme.spacing(1.5),
    '& span': {
      padding: [[0, 5]],
    },
  },
}));

function CeligoDrawer({drawerOpened, isSandbox}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleDrawerToggle = useCallback(() => {
    dispatch(
      actions.user.preferences.update({
        drawerOpened: !drawerOpened,
      })
    );
  }, [dispatch, drawerOpened]);

  // what is the active item? does it have a parent
  // that needs an active state as well?
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: drawerOpened,
        [classes.drawerClose]: !drawerOpened,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: drawerOpened,
          [classes.drawerClose]: !drawerOpened,
        }),
      }}
      open={!drawerOpened}>
      <div
        className={clsx(classes.menuContainer, {
          [classes.menuContainerSandbox]: isSandbox,
        })}
        onDoubleClick={handleDrawerToggle}>
        <div>
          <div
            className={clsx(classes.logoContainer, {
              [classes.logoContainerSandbox]: isSandbox,
            })}>
            {drawerOpened ? (
              <ButtonBase className={clsx(classes.logo, {[classes.logoSandbox]: isSandbox})} onClick={handleDrawerToggle}>
                <CeligoLogo aria-label="open drawer" />
              </ButtonBase>
            ) : (
              <IconButton
                color="inherit"
                aria-label="close drawer"
                onClick={handleDrawerToggle}>
                <CeligoMarkIcon color="inherit" />
              </IconButton>
            )}
            {isSandbox && (
              <Chip
                className={classes.sandboxChip}
                label={drawerOpened ? 'SANDBOX' : 'SB'}
                variant="outlined"
              />
            )}
          </div>
        </div>
        <div className={classes.menuList} >
          <MenuList />
        </div>
        <div>
          <div className={clsx(classes.toolbar, classes.toggleContainer)}>
            <IconButton
              data-test="celigoDrawerToggle"
              aria-label="toggle drawer"
              color="inherit"
              onClick={handleDrawerToggle}
              className={clsx(classes.drawerToggle, {[classes.drawerToggleSandbox]: isSandbox})}>
              {drawerOpened ? <ArrowLeftIcon /> : <ArrowRightIcon />}
            </IconButton>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default function MemoCeligoDrawer() {
  const environment = useSelector(
    state => selectors.userPreferences(state).environment
  );
  const isSandbox = environment === 'sandbox';
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  return useMemo(() => (
    <CeligoDrawer
      isSandbox={isSandbox}
      drawerOpened={drawerOpened}
    />
  ), [drawerOpened, isSandbox]
  );
}
