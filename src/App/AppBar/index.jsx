import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import Popper from '@material-ui/core/Popper';
import { Link } from 'react-router-dom';

@withStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  playground: {
    textDecoration: 'none',
    color: 'white',
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  icon: {
    fill: theme.palette.light,
  },
  bigAvatar: {
    marginLeft: theme.spacing.unit,
    width: 60,
    height: 60,
  },
  button: {
    margin: theme.spacing.unit,
  },
  profileMenu: {
    padding: theme.spacing.unit,
  },
  arrow: {
    position: 'absolute',
    fontSize: 7,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
  popper: {
    zIndex: 1,
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${
          theme.palette.background.paper
        } transparent`,
      },
    },
  },
}))
export default class Appbar extends Component {
  state = {
    anchorEl: null,
    arrowEl: null,
  };

  handlearrowEl = node => {
    this.setState({ arrowEl: node });
  };

  handleMenu = event => {
    if (this.state.anchorEl) {
      this.setState({ anchorEl: null });
    } else {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  handleThemeChange = event => {
    this.props.onSetTheme(event.target.value);
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl, arrowEl } = this.state;
    const { classes, profile, onToggleDrawer, themeName } = this.props;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              onClick={onToggleDrawer}
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu">
              <MenuIcon className={classes.icon} />
            </IconButton>
            <Link className={classes.playground} to="/pg/">
              <Typography
                variant="title"
                color="inherit"
                className={classes.flex}>
                integrator.io
              </Typography>
            </Link>
            {profile && (
              <div>
                <IconButton
                  aria-owns={open ? 'profileOptions' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit">
                  <Avatar
                    alt={profile.name}
                    src={profile.avatarUrl}
                    className={classes.avatar}
                  />
                </IconButton>

                <Popper
                  id="profileOptions"
                  anchorEl={anchorEl}
                  placement="bottom-end"
                  open={open}
                  className={classes.popper}
                  onClose={this.handleClose}
                  modifiers={{
                    flip: {
                      enabled: true,
                    },
                    preventOverflow: {
                      enabled: true,
                      boundariesElement: 'scrollParent',
                    },
                    arrow: {
                      enabled: true,
                      element: arrowEl,
                    },
                  }}>
                  <span className={classes.arrow} ref={this.handlearrowEl} />
                  <Paper className={classes.profileMenu}>
                    <Grid
                      container
                      spacing={16}
                      direction="row"
                      justify="flex-start"
                      alignItems="flex-start">
                      <Grid item>
                        <Avatar
                          alt={profile.name}
                          src={profile.avatarUrl}
                          className={classes.bigAvatar}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="headline" component="h2">
                          {profile.name}
                        </Typography>
                        <Typography component="h3">{profile.email}</Typography>
                      </Grid>
                    </Grid>
                    <div>
                      <FormControl className={classes.formControl}>
                        <Select
                          value={themeName}
                          onChange={this.handleThemeChange}
                          inputProps={{ name: 'themeName' }}>
                          <MenuItem value="light">Celigo Light Theme</MenuItem>
                          <MenuItem value="dark">Celigo Dark Theme</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <Button
                      onClick={this.handleClose}
                      variant="contained"
                      size="small"
                      color="primary"
                      className={classes.button}>
                      My Profile
                    </Button>
                    <Button
                      onClick={this.handleClose}
                      variant="contained"
                      size="small"
                      color="primary"
                      className={classes.button}>
                      Sign Out
                    </Button>
                  </Paper>
                </Popper>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
