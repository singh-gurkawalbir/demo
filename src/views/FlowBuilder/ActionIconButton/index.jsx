import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { IconButton, Tooltip } from '@mui/material';
import { getHelpTextMap } from '../../../components/Help';

const useStyles = makeStyles(theme => ({
  button: {
    opacity: 1,
    transition: theme.transitions.create(['all'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  iconButtonRoot: {
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
      '& svg': {
        color: theme.palette.primary.main,
      },
    },
  },
  iconButtonLabel: {
    '& svg': {
      width: 26,
      height: 26,
    },
  },
  contained: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function ActionIconButton({
  helpKey,
  helpText,
  className,
  children,
  variant,
  ...props
}) {
  const classes = useStyles();

  return (
    <Tooltip title={helpText || (helpKey && getHelpTextMap()[helpKey])}>
      <IconButton
        size="small"
        className={clsx(classes.button, className, classes[variant])}
        classes={{
          root: classes.iconButtonRoot,
          label: classes.iconButtonLabel,
        }}
        {...props}>
        {children}
      </IconButton>
    </Tooltip>
  );
}
