import React from 'react';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    height: 48,
    display: 'flex',
  },
  wrapper: {
    padding: '0px',
    color: theme.palette.text.primary,
  },
  label: {
    textTransform: 'initial',
    display: 'flex',
    alignItems: 'center',
    marginTop: 3,
  },
}));

export default function Status({ children, label, className, onClick }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <Button
        data-test="headerStatus"
        variant="text"
        color="primary"
        className={classes.wrapper}
        onClick={onClick}>
        {children}
        <Typography variant="body2" component="span" className={classes.label}>
          {label}
        </Typography>
      </Button>
    </div>
  );
}
