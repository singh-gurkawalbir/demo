import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import HelpIcon from 'mdi-react/HelpIcon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowPopper from '../ArrowPopper';
import helpTextMap from './helpTextMap';

@withStyles(theme => ({
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

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  helpText = (helpText, helpKey) => helpText || helpTextMap[helpKey];

  render() {
    const { anchorEl } = this.state;
    const { classes, className, helpKey, helpText } = this.props;
    const open = !!anchorEl;
    const helpTextValue = this.helpText(helpText, helpKey);

    return (
      helpTextValue && (
        <Fragment>
          <ClickAwayListener onClickAway={this.handleClose}>
            <IconButton className={className} onClick={this.handleMenu}>
              <HelpIcon fontSize="small" />
            </IconButton>
          </ClickAwayListener>
          <ArrowPopper
            placement="left"
            className={classes.helpPopper}
            id="helpBubble"
            open={open}
            anchorEl={anchorEl}>
            <Typography variant="caption">{helpTextValue}</Typography>
          </ArrowPopper>
        </Fragment>
      )
    );
  }
}
