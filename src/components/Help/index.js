import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import HelpIcon from 'mdi-react/HelpIcon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowPopper from '../ArrowPopper';
import helpTextMap from './helpTextMap';

@withStyles(theme => ({
  iconButton: {
    '& > *': {
      pointerEvents: 'none',
    },
  },
  helpPopper: {
    maxWidth: '350px',
    maxHeight: '300px',
    padding: `${theme.spacing.unit}px ${theme.spacing.double}px`,
    overflow: 'auto',
  },
}))
export default class Help extends Component {
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

  handleClose = event => {
    // Icon button calling itself
    if (event && event.target.id === 'iconButton') return;
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { classes, helpKey } = this.props;
    const open = !!anchorEl;

    return (
      <ClickAwayListener onClickAway={() => this.handleClose(null)}>
        <IconButton
          id="iconButton"
          className={classes.iconButton}
          onClick={this.handleMenu}>
          <HelpIcon fontSize="small" />
        </IconButton>
        <ArrowPopper
          placement="left"
          className={classes.helpPopper}
          id="waffleBox"
          onClose={this.handleClose}
          open={open}
          anchorEl={anchorEl}>
          <Typography variant="caption">{helpTextMap[helpKey]}</Typography>
        </ArrowPopper>
      </ClickAwayListener>
    );
  }
}
