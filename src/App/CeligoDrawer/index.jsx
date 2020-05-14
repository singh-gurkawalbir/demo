import React, { Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, matchPath } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { List, Collapse, ButtonBase, Chip } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import CeligoLogo from '../../components/CeligoLogo';
import CeligoMarkIcon from '../../components/icons/CeligoMarkIcon';
import menuItems from './menuItems';
import getRoutePath from '../../utils/routePaths';
import * as selectors from '../../reducers';
import actions from '../../actions';
import ArrowDownIcon from '../../components/icons/ArrowDownIcon';
import ArrowUpIcon from '../../components/icons/ArrowUpIcon';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';

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
  list: {
    backgroundColor: 'rgb(255,255,255,0.1)',
    paddingTop: 0,
    paddingBottom: 0,
    '& ul': {
      '&:last-child': {
        borderBottom: `solid 1px ${theme.palette.secondary.dark}`,
      },
    },
  },
  listItem: {
    backgroundColor: theme.palette.background.drawer2,
    '& svg > *': {
      color: theme.palette.common.white,
    },
    '&:hover': {
      backgroundColor: theme.palette.background.drawer2,
      color: theme.palette.background.paper,
      '&:before': {
        background: theme.palette.background.drawerActive,
      },
      '& svg > *': {
        color: theme.palette.background.paper,
      },
    },
    '&:not(:last-child)': {
      borderBottom: `solid 1px ${theme.palette.secondary.dark}`,
    },
    '&:before': {
      content: '""',
      width: 6,
      height: '100%',
      position: 'absolute',
      background: 'transparent',
      left: 0,
    },
  },
  activeItem: {
    backgroundColor: `${theme.palette.background.drawerActive} !important`,
    color: theme.palette.common.white,
    '& svg > *': {
      color: theme.palette.background.paper,
    },
  },
  itemIconRoot: {
    minWidth: 45,
  },
  menuList: {
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  itemText: {
    fontSize: 13,
    fontFamily: 'unset',
    color: 'inherit',
  },
  drawerToggle: {
    border: '1px solid',
    borderColor: theme.palette.background.drawer2,
    borderRadius: 4,
    width: theme.spacing(3),
    height: theme.spacing(3),
    padding: 0,
  },
  innerListItems: {
    backgroundColor: theme.palette.background.drawer3,
    // backgroundColor: 'rgb(255,255,255,0.1)',
    '&:hover': {
      backgroundColor: theme.palette.background.drawer3,
      // backgroundColor: theme.palette.background.drawerActive,
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
    fill: theme.palette.common.white,
    color: theme.palette.common.white,
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
const integrationsFilterConfig = {
  type: 'integrations',
  ignoreEnvironmentFilter: true,
};

export default function CeligoDrawer() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const userProfile = useSelector(state => selectors.userProfile(state));
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state).accessLevel
  );
  const integrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    integrationsFilterConfig
  ).resources;
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const environment = useSelector(
    state => selectors.userPreferences(state).environment
  );
  const [expand, setExpand] = React.useState(null);
  const isSandbox = environment === 'sandbox';
  const marketplaceConnectors = useSelectorMemo(
    selectors.makeMarketPlaceConnectorsSelector,
    undefined,
    isSandbox
  );
  const handleDrawerToggle = useCallback(() => {
    dispatch(actions.toggleDrawer());
  }, [dispatch]);
  const handleExpandClick = useCallback(
    label => () => {
      setExpand(label === expand ? null : label);

      if (!drawerOpened) handleDrawerToggle();
    },
    [drawerOpened, expand, handleDrawerToggle]
  );

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
      open={drawerOpened}>
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
              <ButtonBase className={classes.logo} onClick={handleDrawerToggle}>
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
        <div className={classes.menuList}>
          <List className={clsx(classes.list)}>
            {menuItems(
              userProfile,
              accessLevel,
              integrations,
              marketplaceConnectors
            ).map(({ label, Icon, path, routeProps, children }) => (
              <Fragment key={label}>
                <ListItem
                  button
                  className={clsx(classes.listItem, {
                    [classes.activeItem]:
                      expand !== label &&
                      matchPath(location.pathname, routeProps || `/pg${path}`),
                  })}
                  component={children ? undefined : Link}
                  to={getRoutePath(path)}
                  data-test={label}
                  onClick={children ? handleExpandClick(label) : null}>
                  <ListItemIcon classes={{ root: classes.itemIconRoot }}>
                    {<Icon />}
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      className: classes.itemText,
                    }}
                    primary={label}
                  />
                  {children &&
                    (expand === label ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                </ListItem>
                {children && (
                  <Collapse in={expand === label} unmountOnExit timeout="auto">
                    <List className={clsx(classes.list)} disablePadding>
                      {children.map(
                        ({
                          label,
                          Icon,
                          path,
                          routeProps,
                          href,
                          component,
                        }) => (
                          <ListItem
                            className={clsx(
                              classes.listItem,
                              classes.innerListItems,
                              {
                                [classes.activeItem]: matchPath(
                                  location.pathname,
                                  routeProps || `/pg${path}`
                                ),
                              }
                            )}
                            data-test={label}
                            key={label}
                            component={component || Link}
                            target={href && '_blank'}
                            href={href}
                            to={!href ? getRoutePath(path) : undefined}
                            button>
                            <ListItemIcon
                              classes={{ root: classes.itemIconRoot }}>
                              {<Icon />}
                            </ListItemIcon>
                            <ListItemText
                              primary={label}
                              primaryTypographyProps={{
                                className: classes.itemText,
                              }}
                            />
                          </ListItem>
                        )
                      )}
                    </List>
                  </Collapse>
                )}
              </Fragment>
            ))}
          </List>
        </div>
        <div>
          <div className={clsx(classes.toolbar, classes.toggleContainer)}>
            <IconButton
              data-test="celigoDrawerToggle"
              color="inherit"
              onClick={handleDrawerToggle}
              className={classes.drawerToggle}>
              {drawerOpened ? <ArrowLeftIcon /> : <ArrowRightIcon />}
            </IconButton>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
