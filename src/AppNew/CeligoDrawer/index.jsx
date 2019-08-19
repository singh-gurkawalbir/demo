import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Divider } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: theme.drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
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
  drawerPaper: {
    width: theme.drawerWidth, // drawerWidth needs to be in our design token.
  },
  toolbar: theme.mixins.toolbar,

  menuContainer: {
    overflow: 'hidden',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '48px auto 80px',
    '& > div:first-child': {
      alignSelf: 'end',
      margin: theme.spacing(1, 0, 0, 0.5),
    },
    '& > div:last-child': {
      alignSelf: 'end',
      margin: theme.spacing(0, 0, 2, 0.5),
    },
  },
  menuItem: {
    marginTop: theme.spacing(1),
  },
}));

export default function CeligoDrawer({ open = false, onClick }) {
  const classes = useStyles();

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
      <div className={classes.toolbar} />

      <div className={classes.menuContainer}>
        <div>
          <IconButton
            // color="inherit"
            aria-label="open drawer"
            onClick={onClick}
            // edge="start"
            // className={clsx(classes.menuButton, {
            //   [classes.hide]: open,
            // })}
          >
            <MenuIcon />
          </IconButton>
        </div>
        <div>
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>
        <div>
          <Divider />
          <div className={clsx(classes.toolbar, classes.menuItem)}>
            <IconButton onClick={onClick}>
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
