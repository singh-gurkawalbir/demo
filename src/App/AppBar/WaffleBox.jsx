import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AppsIcon from '@material-ui/icons/Apps';
import Button from '@material-ui/core/Button';
import ArrowPopper from '../../components/AFE/ArrowPopper';

@withStyles(theme => ({
  icon: {
    fill: theme.appBarContrast,
  },
}))
export default class WaffleBox extends Component {
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
    const { anchorEl, open } = this.state;
    const { classes } = this.props;

    return (
      <Fragment>
        <IconButton
          aria-owns={open ? 'profileOptions' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}>
          <AppsIcon fontSize="large" className={classes.icon} />
        </IconButton>
        <ArrowPopper
          id="waffleBox"
          onClose={this.handleClose}
          anchorEl={anchorEl}>
          <Button component={Link} to="/pg/editors" onClick={this.handleClose}>
            Editors
          </Button>
          <Button
            component={Link}
            to="/pg/resources"
            onClick={this.handleClose}>
            Resources
          </Button>
        </ArrowPopper>
      </Fragment>
    );
  }
}
