import React from 'react';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import ArrowRightIcon from '../icons/ArrowRightIcon';

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
    '& svg': {
      marginTop: -3,
    },
  },
}));

function Status({ children, label, className, onClick }) {
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
          {label} <ArrowRightIcon />
        </Typography>
      </Button>
    </div>
  );
}

export default Status;
