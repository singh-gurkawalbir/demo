import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

@withStyles(theme => ({
  paper: {
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
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${
          theme.palette.background.paper
        } transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${
          theme.palette.background.paper
        } transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${
          theme.palette.background.paper
        }`,
      },
    },
  },
}))
export default class ArrowPopper extends Component {
  state = {
    arrowEl: null,
  };
  handlearrowEl = node => {
    this.setState({ arrowEl: node });
  };

  render() {
    const { id, anchorEl, placement, classes, children, onClose } = this.props;
    const open = Boolean(anchorEl);
    const { arrowEl } = this.state;

    return (
      <Popper
        id={id}
        anchorEl={anchorEl}
        placement={placement || 'bottom-end'}
        disablePortal={false}
        open={open}
        className={classes.popper}
        onClose={onClose}
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
        <ClickAwayListener onClickAway={onClose}>
          <Paper className={classes.paper}>{children}</Paper>
        </ClickAwayListener>
      </Popper>
    );
  }
}
