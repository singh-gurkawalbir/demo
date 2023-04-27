import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    display: 'inline-flex',
    fontSize: 12,
    padding: [[2, 10]],
    justifyContent: 'flex-start',
    border: '2px solid',
    borderColor: theme.palette.secondary.light,
    borderRight: 'none',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: [[4, 0, 0, 4]],
    height: 22,
    '&:before': {
      content: '""',
      top: 1,
      right: -8,
      borderColor: theme.palette.secondary.light,
      borderStyle: 'solid',
      borderWidth: [[0, 2, 2, 0]],
      display: 'inline-block',
      padding: 7,
      transform: 'rotate(-45deg)',
      position: 'absolute',
      borderRadius: [[2, 1, 2, 1]],
    },
    '&:after': {
      content: '""',
      top: 4,
      right: -3,
      width: 5,
      height: 5,
      borderRadius: '50%',
      border: '2px solid',
      borderColor: theme.palette.secondary.light,
      position: 'absolute',
      boxSizing: 'content-box',
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '80%',
    },
  },
  label: {
    maxWidth: 175,
    color: theme.palette.secondary.light,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    lineHeight: '13px',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%',
    },
  },
}));

export default function IntegrationTag({ label, className }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.wrapper, className)}>
      <span className={classes.label}>{label}</span>
    </div>
  );
}

IntegrationTag.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};
