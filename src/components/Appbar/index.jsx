import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from 'mdi-react/MenuIcon';
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
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  icon: {
    fill: theme.palette.common.white,
  },
}))
export default class Appbar extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <MuiAppBar position="static">
          <Toolbar>
            <IconButton
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
                {process.env.APP_NAME}
              </Typography>
            </Link>
          </Toolbar>
        </MuiAppBar>
      </div>
    );
  }
}
