import React, { Fragment } from 'react';
import { makeStyles, fade } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Divider, List, Collapse } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AccountCircle from '@material-ui/icons/AccountCircle';
import clsx from 'clsx';
import CeligoLogo from '../../components/CeligoLogo';
import CeligoMarkIcon from '../../components/icons/CeligoMarkIcon';

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
    backgroundColor: theme.palette.secondary.dark,
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
    backgroundColor: fade(theme.palette.common.white, 0.07),
  },
  listItem: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
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
  },
  logo: {
    width: 90,
    display: 'inline-block',
    fill: fade(theme.palette.primary.main, 0.8),
  },
}));
const menuItems = [
  { label: 'Home', Icon: MailIcon },
  {
    label: 'Tools',
    Icon: MailIcon,
    children: [
      { label: 'Flow Builder', Icon: MailIcon },
      { label: 'Data Loader', Icon: InboxIcon },
    ],
  },
  {
    label: 'Resources',
    Icon: MailIcon,
    children: [
      { label: 'Exports', Icon: MailIcon },
      { label: 'Imports', Icon: InboxIcon },
      { label: 'Connections', Icon: MailIcon },
      { label: 'Integrations', Icon: MailIcon },
    ],
  },
  { label: 'Marketplace', Icon: MailIcon },
  {
    label: 'Support',
    Icon: MailIcon,
    children: [
      { label: 'Knowledge Base', Icon: InboxIcon },
      { label: 'Support Ticket', Icon: MailIcon },
    ],
  },
];

export default function CeligoDrawer({ open = false, onClick }) {
  const classes = useStyles();
  const [expand, setExpand] = React.useState({});
  const handleClick = label => () => {
    setExpand({ ...expand, [label]: !expand[label] });
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
      open={open}>
      <div className={classes.menuContainer}>
        <div>
          <div className={classes.logoContainer}>
            {open ? (
              <span className={classes.logo}>
                <CeligoLogo aria-label="open drawer" onClick={onClick} />
              </span>
            ) : (
              <IconButton
                color="inherit"
                aria-label="close drawer"
                onClick={onClick}>
                <CeligoMarkIcon color="primary" />
              </IconButton>
            )}
          </div>
        </div>
        <div className={classes.menuList}>
          <List className={classes.list}>
            {menuItems.map(({ label, Icon, children }) => (
              <Fragment key={label}>
                <ListItem
                  button
                  className={classes.listItem}
                  onClick={children ? handleClick(label) : undefined}>
                  <ListItemIcon classes={{ root: classes.itemIconRoot }}>
                    {<Icon />}
                  </ListItemIcon>
                  <ListItemText primary={label} />
                  {children &&
                    (expand[label] ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>
                {children && (
                  <Collapse in={expand[label]} unmountOnExit timeout="auto">
                    <List className={classes.list} disablePadding>
                      {children.map(({ label, Icon }) => (
                        <ListItem
                          className={classes.listItem}
                          key={label}
                          button>
                          <ListItemIcon
                            classes={{ root: classes.itemIconRoot }}>
                            {<Icon />}
                          </ListItemIcon>
                          <ListItemText primary={label} />
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
            <IconButton color="inherit" onClick={onClick}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="menuId"
            aria-haspopup="true"
            color="inherit">
            <AccountCircle />
          </IconButton>
        </div>
      </div>
    </Drawer>
  );
}
