import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { ClickAwayListener, Popper, Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
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
    zIndex: theme.zIndex.modal + 1,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    borderRadius: '4px',
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
        borderColor: `transparent transparent ${theme.palette.secondary.lightest} transparent`,
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
        borderColor: `rgb(0,0,0,0.2) transparent transparent  transparent`,
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
        marginTop: '0.4em',
        borderWidth: '1em 1em 1em 0',
        // eslint-disable-next-line prettier/prettier
        borderColor: `transparent ${theme.palette.background.paper} transparent  transparent`,
      },
      '&::after': {
        borderWidth: '1.3em 1.3em 1.3em 0',
        // eslint-disable-next-line prettier/prettier
        borderColor: `transparent rgb(0,0,0,0.2) transparent transparent`,
        position: 'absolute',
        top: '1px',
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
        marginTop: '0.5em',
      },
      '&::after': {
        borderWidth: '1.3em 0 1.3em 1.3em',
        // eslint-disable-next-line prettier/prettier
        borderColor: `transparent transparent transparent rgb(0,0,0,0.2)`,
        position: 'absolute',
        top: '2px',
        left: '0px',
        zIndex: '-2',
      },
    },
  },
}));

export default function ArrowPopper({
  children,
  onClose = () => {}, // default to noop.
  className,
  ...rest
}) {
  const [arrowEl, setArrowEl] = useState(null);
  const classes = useStyles(rest);

  return (
    <Popper
      {...rest}
      onClose={onClose}
      className={classes.popper}
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
      <span className={classes.arrow} ref={setArrowEl} />
      <ClickAwayListener onClickAway={onClose}>
        <Paper className={clsx(classes.paper, className)} elevation={1}>
          {children}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
