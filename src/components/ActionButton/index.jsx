import React from 'react';
import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  editorButton: {
    marginRight: 5,
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    height: 50,
    width: 50,
    borderRadius: 2,
    color: theme.palette.text.hint,
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.background.paper,
      '& > span': {
        color: theme.palette.primary.main,
      },
    },
  },
}));

function ActionButton({ className, children, ...props }) {
  const classes = useStyles();

  return (
    <IconButton className={clsx(classes.editorButton, className)} {...props}>
      <span>{children}</span>
    </IconButton>
  );
}

export default ActionButton;
