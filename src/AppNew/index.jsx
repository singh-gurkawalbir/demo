import React from 'react';
import { MuiThemeProvider, fade, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Slide from '@material-ui/core/Slide';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { Grid, Button, Divider } from '@material-ui/core';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import clsx from 'clsx';
import FontStager from '../components/FontStager';
import TextToggle from '../components/TextToggle';
import themeProvider from '../theme/themeProvider';
import CeligoIconButton from '../components/IconButton';
import AddIcon from '../components/icons/AddIcon';

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${theme.spacing(8)}px)`,

    // zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    '& > div > div': {
      minHeight: 10,
    },
  },
  drawerOpen: {
    width: drawerWidth,
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
      width: theme.spacing(8) + 1,
    },
  },
  drawerPaper: {
    width: drawerWidth, // drawerWidth needs to be in our design token.
  },
  // no idea what theme.mixins is for, but it seems to be used
  // to set the offset from top of window to the content of
  // the page such that scroll top will still have the content
  // visible.
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  grow: {
    flexGrow: 1,
  },
  actions: {
    display: 'flex',
  },
  menuContainer: {
    height: '100%',
    display: 'grid',
    gridTemplateRows: '40px auto 80px',
    '& > div:first-child': {
      margin: theme.spacing(1, 0, 0, 1),
    },
    '& > div:last-child': {
      alignSelf: 'end',
      margin: theme.spacing(0, 0, 2, 1),
    },
  },
  pageHeader: {
    padding: theme.spacing(1, 3),
    height: 72,
    width: `calc(100% - ${theme.spacing(2 * 3) + 1}px)`,
    margin: theme.spacing(-3, -3, 0),
    position: 'fixed',
  },
  pageHeaderShift: {
    width: `calc(100% - ${drawerWidth - theme.spacing(2)}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(1),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 100,
      '&:focus': {
        width: 200,
      },
    },
  },
}));
const ElevationScroll = React.forwardRef((props, ref) => {
  const { children, threshold } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold,
  });

  // if (!children) return children;

  return React.cloneElement(children, {
    ref,
    elevation: trigger ? 4 : 0,
  });
});
// eslint-disable-next-line react/display-name
const SlideScroll = React.forwardRef((props, ref) => {
  const { children, threshold } = props;

  return (
    <Slide
      appear={false}
      direction="down"
      in={!useScrollTrigger({ threshold })}>
      {React.cloneElement(children, { ref })}
    </Slide>
  );
});

export default function AppNew() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const customTheme = themeProvider('light');

  function handleDrawerClick() {
    setOpen(!open);
  }

  return (
    <MuiThemeProvider theme={customTheme}>
      <FontStager />

      <div className={classes.root}>
        <CssBaseline />
        <SlideScroll threshold={250}>
          <ElevationScroll threshold={100}>
            <AppBar
              position="fixed"
              className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
              })}>
              <Toolbar>
                <TextToggle
                  defaultValue={1}
                  exclusive
                  variant="appbar"
                  options={[
                    { value: 1, label: 'Production' },
                    { value: 2, label: 'Sandbox' },
                  ]}
                />
                <div className={classes.grow} />
                <div className={classes.actions}>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase
                      placeholder="Search…"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      inputProps={{ 'aria-label': 'search' }}
                    />
                  </div>
                  <IconButton
                    size="small"
                    aria-label="show 17 new notifications"
                    color="inherit">
                    <Badge badgeContent={17} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </div>
              </Toolbar>
            </AppBar>
          </ElevationScroll>
        </SlideScroll>

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
                onClick={handleDrawerClick}
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
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map(
                  (text, index) => (
                    <ListItem button key={text}>
                      <ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItem>
                  )
                )}
              </List>
            </div>
            <div>
              <Divider />
              <div className={classes.toolbar}>
                <IconButton onClick={handleDrawerClick}>
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

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <SlideScroll threshold={100}>
            <ElevationScroll threshold={0}>
              <Paper
                className={clsx(classes.pageHeader, {
                  [classes.pageHeaderShift]: open,
                })}
                elevation={0}
                square>
                <Breadcrumbs maxItems={3} aria-label="breadcrumb">
                  <Link color="inherit" href="/pg">
                    Home
                  </Link>
                  <Link color="inherit" href="/pg">
                    Profile
                  </Link>
                  <Link color="inherit" href="/pg">
                    Subscription
                  </Link>
                  <Typography color="textPrimary">Add-ons</Typography>
                </Breadcrumbs>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography variant="h3">Subscription Add-ons</Typography>
                  </Grid>
                  <Grid item>
                    <Button variant="text">
                      <AddIcon /> Create integration
                    </Button>
                    <CeligoIconButton variant="text">
                      <AddIcon /> Install Zip
                    </CeligoIconButton>
                  </Grid>
                </Grid>
              </Paper>
            </ElevationScroll>
          </SlideScroll>

          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
            dolor purus non enim praesent elementum facilisis leo vel. Risus at
            ultrices mi tempus imperdiet. Semper risus in hendrerit gravida
            rutrum quisque non tellus. Convallis convallis tellus id interdum
            velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean
            sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
            integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
            eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
            quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
            vivamus at augue. At augue eget arcu dictum varius duis at
            consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
            donec massa sapien faucibus et molestie ac.
          </Typography>
          <Typography paragraph>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
            ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
            elementum integer enim neque volutpat ac tincidunt. Ornare
            suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
            volutpat consequat mauris. Elementum eu facilisis sed odio morbi.
            Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
            ornare massa eget egestas purus viverra accumsan in. In hendrerit
            gravida rutrum quisque non tellus orci ac. Pellentesque nec nam
            aliquam sem et tortor. Habitant morbi tristique senectus et.
            Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean
            euismod elementum nisi quis eleifend. Commodo viverra maecenas
            accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
            ultrices sagittis orci a.
          </Typography>
          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
            dolor purus non enim praesent elementum facilisis leo vel. Risus at
            ultrices mi tempus imperdiet. Semper risus in hendrerit gravida
            rutrum quisque non tellus. Convallis convallis tellus id interdum
            velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean
            sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
            integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
            eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
            quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
            vivamus at augue. At augue eget arcu dictum varius duis at
            consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
            donec massa sapien faucibus et molestie ac.
          </Typography>
          <Typography paragraph>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
            ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
            elementum integer enim neque volutpat ac tincidunt. Ornare
            suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
            volutpat consequat mauris. Elementum eu facilisis sed odio morbi.
            Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
            ornare massa eget egestas purus viverra accumsan in. In hendrerit
            gravida rutrum quisque non tellus orci ac. Pellentesque nec nam
            aliquam sem et tortor. Habitant morbi tristique senectus et.
            Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean
            euismod elementum nisi quis eleifend. Commodo viverra maecenas
            accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
            ultrices sagittis orci a.
          </Typography>
          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
            dolor purus non enim praesent elementum facilisis leo vel. Risus at
            ultrices mi tempus imperdiet. Semper risus in hendrerit gravida
            rutrum quisque non tellus. Convallis convallis tellus id interdum
            velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean
            sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
            integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
            eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
            quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
            vivamus at augue. At augue eget arcu dictum varius duis at
            consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
            donec massa sapien faucibus et molestie ac.
          </Typography>
          <Typography paragraph>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
            ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
            elementum integer enim neque volutpat ac tincidunt. Ornare
            suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
            volutpat consequat mauris. Elementum eu facilisis sed odio morbi.
            Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
            ornare massa eget egestas purus viverra accumsan in. In hendrerit
            gravida rutrum quisque non tellus orci ac. Pellentesque nec nam
            aliquam sem et tortor. Habitant morbi tristique senectus et.
            Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean
            euismod elementum nisi quis eleifend. Commodo viverra maecenas
            accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
            ultrices sagittis orci a.
          </Typography>
        </main>
      </div>
    </MuiThemeProvider>
  );
}
