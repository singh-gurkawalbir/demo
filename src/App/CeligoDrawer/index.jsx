import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, matchPath } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { List, Collapse, ButtonBase } from '@material-ui/core';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';
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
    // itemIconRoot: {
    //   width: 300,
    // },
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
    backgroundColor: theme.palette.secondary.darkest,
    color: theme.palette.secondary.contrastText,
    overflow: 'hidden',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '75px auto 140px',
    '& > div:first-child': {
      alignSelf: 'center',
    },
    '& > div:last-child': {
      alignSelf: 'end',
      margin: theme.spacing(0, 0, 2, 0.5),
    },
  },
  menuContainerSandbox: {
    backgroundColor: theme.palette.sandbox.dark,
    color: theme.palette.sandbox.contrastText,
  },
  toggleContainer: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
    '& svg': {
      color: theme.palette.text.hint,
    },
  },
  sandboxToggleContainer: {
    borderColor: theme.palette.secondary.light,
    '& svg': {
      color: theme.palette.secondary.light,
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
  sandboxList: {
    backgroundColor: 'rgb(255,255,255,0.3)',
    '& ul': {
      '&:last-child': {
        borderColor: theme.palette.sandbox.dark,
      },
    },
  },
  listItem: {
    backgroundColor: theme.palette.secondary.main,
    '& svg > *': {
      color: theme.palette.text.hint,
    },
    '&:hover': {
      backgroundColor: theme.palette.text.secondary,
      color: theme.palette.background.paper,
      '&:before': {
        background: theme.palette.primary.main,
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
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: theme.palette.common.white,
    '& svg > *': {
      color: theme.palette.background.paper,
    },
  },
  listItemSandbox: {
    backgroundColor: theme.palette.sandbox.light,
    '& svg > *': {
      color: theme.palette.secondary.light,
    },
    '&:hover': {
      backgroundColor: darken(theme.palette.sandbox.dark, 0.1),
      '&:before': {
        background: darken(theme.palette.sandbox.dark, 0.4),
      },
    },
    '&:not(:last-child)': {
      borderColor: theme.palette.sandbox.dark,
    },
  },
  activeItemSandbox: {
    backgroundColor: `${darken(theme.palette.sandbox.dark, 0.4)} !important`,
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
  logoContainer: {
    textAlign: 'center',
    fill: theme.palette.primary.dark,
    color: theme.palette.primary.dark,
    '& svg': {
      fill: theme.palette.primary.dark,
    },
  },
  sandboxLogoContainer: {
    '& svg': {
      fill: theme.palette.secondary.light,
    },
  },
  logo: {
    width: 90,
    display: 'inline-block',
  },
  itemText: {
    fontSize: 13,
    fontFamily: 'unset',
    color: 'inherit',
  },
  drawerToggle: {
    border: '1px solid',
    borderColor: theme.palette.text.secondary,
    borderRadius: 4,
    width: theme.spacing(3),
    height: theme.spacing(3),
    padding: 0,
  },
  sandboxDrawerToggle: {
    borderColor: theme.palette.secondary.light,
  },
  innerListItems: {
    background: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: lighten(theme.palette.text.secondary, 0.1),
    },
  },
  sandboxInnerListItems: {
    background: lighten(theme.palette.sandbox.light, 0.2),
    '&:hover': {
      backgroundColor: darken(theme.palette.sandbox.dark, 0.1),
    },
  },
}));

export default function CeligoDrawer() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const userProfile = useSelector(state => selectors.userProfile(state));
  const userPermissions = useSelector(state =>
    selectors.userPermissions(state)
  );
  const integrations = useSelector(
    state =>
      selectors.resourceList(state, {
        type: 'integrations',
        ignoreEnvironmentFilter: true,
      }),
    (left, right) => left.length === right.length
  ).resources;
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const environment = useSelector(
    state => selectors.userPreferences(state).environment
  );
  const [expand, setExpand] = React.useState(null);
  const isSandbox = environment === 'sandbox';
  const marketplaceConnectors = useSelector(state =>
    selectors.marketplaceConnectors(state, undefined, isSandbox)
  );
  const handleDrawerToggle = () => {
    dispatch(actions.toggleDrawer());
  };

  const handleExpandClick = label => () => {
    setExpand(label === expand ? null : label);

    if (!drawerOpened) handleDrawerToggle();
  };

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
              [classes.sandboxLogoContainer]: isSandbox,
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
          </div>
        </div>
        <div className={classes.menuList}>
          <List
            className={clsx(classes.list, {
              [classes.sandboxList]: isSandbox,
            })}>
            {menuItems(
              userProfile,
              userPermissions,
              integrations,
              marketplaceConnectors
            ).map(({ label, Icon, path, routeProps, children }) => (
              <Fragment key={label}>
                <ListItem
                  button
                  className={clsx(classes.listItem, {
                    [classes.listItemSandbox]: isSandbox,
                    [classes.activeItem]:
                      !isSandbox &&
                      expand !== label &&
                      matchPath(location.pathname, routeProps || `/pg${path}`),
                    [classes.activeItemSandbox]:
                      isSandbox &&
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
                    <List
                      className={clsx(classes.list, {
                        [classes.sandboxList]: isSandbox,
                      })}
                      disablePadding>
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
                                [classes.listItemSandbox]: isSandbox,
                                [classes.sandboxInnerListItems]: isSandbox,
                                [classes.activeItem]:
                                  !isSandbox &&
                                  matchPath(
                                    location.pathname,
                                    routeProps || `/pg${path}`
                                  ),
                                [classes.activeItemSandbox]:
                                  isSandbox &&
                                  matchPath(
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
                            to={!href && getRoutePath(path)}
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
          <div
            className={clsx(classes.toolbar, classes.toggleContainer, {
              [classes.sandboxToggleContainer]: isSandbox,
            })}>
            <IconButton
              data-test="celigoDrawerToggle"
              color="inherit"
              onClick={handleDrawerToggle}
              className={clsx(classes.drawerToggle, {
                [classes.sandboxDrawerToggle]: isSandbox,
              })}>
              {drawerOpened ? <ArrowLeftIcon /> : <ArrowRightIcon />}
            </IconButton>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
