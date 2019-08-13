import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiSpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';

const isTouch =
  typeof document !== 'undefined' && 'ontouchstart' in document.documentElement;

@withStyles(theme => ({
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}))
export default class SpeedDial extends Component {
  state = {
    open: false,
  };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { classes, children } = this.props;
    const { open } = this.state;

    return (
      <MuiSpeedDial
        open={open}
        ariaLabel="speed dial"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        ButtonProps={{
          color: 'secondary',
        }}
        onBlur={this.handleClose}
        onClick={this.handleClick}
        onClose={this.handleClose}
        onFocus={isTouch ? null : this.handleOpen}
        onMouseEnter={isTouch ? null : this.handleOpen}
        onMouseLeave={this.handleClose}>
        {children}
      </MuiSpeedDial>
    );
  }
}
