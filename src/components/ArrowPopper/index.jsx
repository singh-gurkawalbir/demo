import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

@withStyles(theme => ({
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
    '&::after': {
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
        // eslint-disable-next-line prettier/prettier
        borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
      },
      '&::after': {
        borderWidth: '0 1.3em 1.3em 1.3em',
        // eslint-disable-next-line prettier/prettier
        borderColor: `transparent transparent ${theme.palette.background.arrowAfter} transparent`,
        position: 'absolute',
        top: '-2px',
        left: '2px',
        zIndex: '-2',
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
        // eslint-disable-next-line prettier/prettier
        borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
      },
      '&::after': {
        borderWidth: '1.3em 1.3em 0 1.3em',
        // eslint-disable-next-line prettier/prettier
        borderColor: ` ${theme.palette.background.arrowAfter} transparent transparent  transparent`,
        position: 'absolute',
        top: '0px',
        left: '2px',
        zIndex: '-2',
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        // eslint-disable-next-line prettier/prettier
        borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
      },
      '&::after': {
        borderWidth: '1.3em 1.3em 1.3em 0',
        // eslint-disable-next-line prettier/prettier
        borderColor: `transparent ${theme.palette.background.arrowAfter} transparent transparent`,
        position: 'absolute',
        top: '-2px',
        left: '-2px',
        zIndex: '-2',
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        // eslint-disable-next-line prettier/prettier
        borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
      },
      '&::after': {
        borderWidth: '1.3em 0 1.3em 1.3em',
        // eslint-disable-next-line prettier/prettier
        borderColor: `transparent transparent transparent ${theme.palette.background.arrowAfter}`,
        position: 'absolute',
        top: '-2px',
        left: '0px',
        zIndex: '-2',
      },
    },
  },
}))
export default class ArrowPopper extends Component {
  state = {
    arrowEl: null,
  };
  handleArrowEl = node => {
    this.setState({ arrowEl: node });
  };

  render() {
    const {
      id,
      open,
      anchorEl,
      placement = 'bottom-end',
      classes,
      children,
      onClose = () => {}, // default to noop.
      className,
    } = this.props;
    const { arrowEl } = this.state;

    return (
      <Popper
        id={id}
        anchorEl={anchorEl}
        placement={placement}
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
        <span className={classes.arrow} ref={this.handleArrowEl} />
        <ClickAwayListener onClickAway={onClose}>
          <Paper className={classNames(classes.paper, className)}>
            {children}
          </Paper>
        </ClickAwayListener>
      </Popper>
    );
  }
}
