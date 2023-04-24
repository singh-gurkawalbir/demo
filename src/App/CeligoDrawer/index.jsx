import { ButtonBase, Chip } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CeligoLogo } from '@celigo/fuse-ui';
import actions from '../../actions';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon';
import CeligoMarkIcon from '../../components/icons/CeligoMarkIcon';
import { selectors } from '../../reducers';
import MenuList from './MenuList';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: parseInt(theme.drawerWidth, 10),
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
    width: parseInt(theme.drawerWidth, 10),
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
    width: parseInt(theme.spacing(7), 10) + 4,
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
      margin: parseInt(theme.spacing(0, 0, 2, 0.5), 10),
    },
  },
  menuContainerSandbox: {
    gridTemplateRows: `${
      theme.appBarHeight + theme.pageBarHeight
    }px auto 140px`,
  },

  toggleContainer: {
    marginTop: parseInt(theme.spacing(1), 10),
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
    width: parseInt(theme.spacing(3), 10),
    height: parseInt(theme.spacing(3), 10),
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
    marginTop: parseInt(theme.spacing(1.5), 10),
    '& span': {
      padding: [[0, 5]],
    },
    backgroundColor: 'transparent',
  },
  iconHoverSandbox: {
    '&:hover svg': {
      fill: theme.palette.primary.dark,
    },
  },
}));

function CeligoDrawer({ drawerOpened, isSandbox }) {
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
      open={!drawerOpened}
    >
      <div
        className={clsx(classes.menuContainer, {
          [classes.menuContainerSandbox]: isSandbox,
        })}
        onDoubleClick={handleDrawerToggle}
      >
        <div>
          <div
            className={clsx(classes.logoContainer, {
              [classes.logoContainerSandbox]: isSandbox,
            })}
          >
            {drawerOpened ? (
              <ButtonBase
                className={clsx(classes.logo, {
                  [classes.logoSandbox]: isSandbox,
                })}
                onClick={handleDrawerToggle}
              >
                <CeligoLogo aria-label="open drawer" />
              </ButtonBase>
            ) : (
              <IconButton
                color="inherit"
                aria-label="close drawer"
                onClick={handleDrawerToggle}
                className={clsx({[classes.iconHoverSandbox]: isSandbox })}
                size="large">
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
        <div className={classes.menuList}>
          <MenuList />
        </div>
        <div>
          <div className={clsx(classes.toolbar, classes.toggleContainer)}>
            <IconButton
              data-test="celigoDrawerToggle"
              aria-label="toggle drawer"
              color="inherit"
              onClick={handleDrawerToggle}
              className={clsx(classes.drawerToggle, {[classes.drawerToggleSandbox]: isSandbox})}
              size="large">
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

  return useMemo(
    () => <CeligoDrawer isSandbox={isSandbox} drawerOpened={drawerOpened} />,
    [drawerOpened, isSandbox]
  );
}
