import { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import { isAuthenticated } from '../../reducers';
import WaffleBox from './WaffleBox';

const mapStateToProps = state => ({
  authenticated: isAuthenticated(state),
});

@withStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: theme.appBarBackground,
  },
  flex: {
    flex: 1,
  },
  celigoLogo: {
    float: 'left',
    position: 'static',
    height: 55,
    width: 140,
    // marginLeft: theme.spacing.unit * 2,
    background: `url(${
      process.env.CDN_BASE_URI
    }flow-builder/celigo-product-logo.svg) no-repeat center left`,
  },
}))
export class Appbar extends Component {
  state = {
    anchorEl: null,
  };

  handleMenu = event => {
    if (this.state.anchorEl) {
      this.setState({ anchorEl: null });
    } else {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, authenticated } = this.props;

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            <div className={classes.flex}>
              <Link className={classNames(classes.celigoLogo)} to="/pg/" />
            </div>
            <WaffleBox />
            {authenticated && <ProfileMenu />}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
// prettier-ignore
export default connect(mapStateToProps, null)(Appbar);
