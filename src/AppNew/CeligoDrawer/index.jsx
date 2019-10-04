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
    itemIconRoot: {
      width: 300,
    },
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
  menuItem: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
    '& svg': {
      color: theme.palette.text.hint,
    },
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
    '& svg > *': {
      color: theme.palette.text.hint,
    },
    '&:hover': {
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
      width: '6px',
      height: '100%',
      position: 'absolute',
      background: 'transparent',
      left: '0px',
    },
  },
  itemIconRoot: {
    minWidth: '45px',
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
      color: theme.palette.primary.dark,
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
    '& svg': {
      position: 'relative',
      top: '-12px',
    },
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
      <div className={classes.menuContainer} onDoubleClick={handleDrawerToggle}>
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
                    <List className={classes.list} disablePadding>
                      {children.map(({ label, Icon, path }) => (
                        <ListItem
                          className={classes.listItem}
                          data-test={label}
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
