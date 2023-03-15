import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    marginRight: 10,
    borderRadius: '50%',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    '&:hover': {
      background: theme.palette.background.default,
    },
    '& > a': {
      color: theme.palette.secondary.light,
    },
  },
}));

export default function Manage(props) {
  const classes = useStyles();
  const { children } = props;

  return (
    <div aria-label="manage" className={classes.wrapper} {...props}>
      {children}
    </div>
  );
}

