import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles, fade } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Divider, List, Collapse, ButtonBase } from '@material-ui/core';
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
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(5) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: theme.mixins.toolbar,

  menuContainer: {
    backgroundColor: theme.palette.secondary.darkest,
    color: theme.palette.secondary.contrastText,
    overflow: 'hidden',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '64px auto 140px',
    '& > div:first-child': {
      alignSelf: 'center',
    },
    '& > div:last-child': {
      alignSelf: 'end',
      margin: theme.spacing(0, 0, 2, 0.5),
    },
  },
  menuItem: {
    marginTop: theme.spacing(1),
  },
  list: {
    backgroundColor: fade(theme.palette.secondary.light, 0.25),
    paddingTop: 0,
    paddingBottom: 0,
    '& ul': {
      '&:last-child': {
        borderBottom: `solid 1px ${theme.palette.secondary.dark}`,
      },
    },
  },
  listItem: {
    '&:hover': {
      borderColor: theme.palette.primary.main,
      borderLeft: 'solid 3px',
      color: theme.palette.common.white,
      paddingLeft: theme.spacing(2) - 3,
    },
    '&:not(:last-child)': {
      borderBottom: `solid 1px ${theme.palette.secondary.dark}`,
    },
  },
  itemIconRoot: {
    color: 'inherit',
  },
  menuList: {
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  logoContainer: {
    textAlign: 'center',
    fill: theme.palette.primary.dark,
    color: theme.palette.primary.dark,
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
}));

export default function CeligoDrawer() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const [expand, setExpand] = React.useState(null);
  const handleDrawerToggle = () => {
    dispatch(actions.toggleDrawer());
  };

  const handleExpandClick = label => () => {
    setExpand(label === expand ? null : label);

    if (!drawerOpened) handleDrawerToggle();
  };

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
      <div className={classes.menuContainer}>
        <div>
          <div className={classes.logoContainer}>
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
          <List className={classes.list}>
            {menuItems.map(({ label, Icon, path, children }) => (
              <Fragment key={label}>
                <ListItem
                  button
                  className={classes.listItem}
                  component={children ? undefined : Link}
                  to={getRoutePath(path)}
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
                    <List className={classes.list} disablePadding>
                      {children.map(({ label, Icon, path }) => (
                        <ListItem
                          className={classes.listItem}
                          key={label}
                          component={Link}
                          to={getRoutePath(path)}
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
                      ))}
                    </List>
                  </Collapse>
                )}
              </Fragment>
            ))}
          </List>
        </div>
        <div>
          <Divider />
          <div className={clsx(classes.toolbar, classes.menuItem)}>
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              {drawerOpened ? <ArrowLeftIcon /> : <ArrowRightIcon />}
            </IconButton>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
