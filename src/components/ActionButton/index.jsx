import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  editorButton: {
    marginLeft: theme.spacing(1),
    display: 'inline-block',
    padding: 0,
    borderRadius: 2,
    color: theme.palette.text.hint,
    cursor: 'pointer',
    '&:hover': {
      background: 'transparent',
      '& > span': {
        color: theme.palette.primary.main,
      },
    },
    '&:first-child': {
      marginRight: 0,
    },
  },
}));

export default function ActionButton({ className, children, ...props }) {
  const classes = useStyles();

  return (
    <IconButton className={clsx(classes.editorButton, className)} {...props}>
      <span>{children}</span>
    </IconButton>
  );
}
