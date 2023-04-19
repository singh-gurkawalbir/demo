import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { IconButton, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { getHelpTextMap } from '../../../components/Help';
import { selectors } from '../../../reducers';
import { useFlowContext } from '../FlowBuilderBody/Context';

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
  newiconButtonRoot: {
    padding: theme.spacing(0.1),
    // backgroundColor: theme.palette.primary.lightest,
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
      '& svg': {
        color: theme.palette.primary.main,
      },
      placement: 'top',
    },
  },
  iconButtonLabel: {
    '& svg': {
      width: 26,
      height: 26,
    },
  },
  subFlowButtonLabel: {
    width: 18,
    height: 18,
    '& svg': {
      width: 16,
      height: 16,
    },
  },
}));

// dupli

export default function ActionIconButton({
  helpKey,
  helpText,
  className,
  children,
  variant,
  ...props
}) {
  const classes = useStyles();
  const { flowId } = useFlowContext();

  const isIconView = useSelector(state =>
    selectors.fbIconview(state, flowId) === 'icon'
  );

  return (
    <Tooltip title={helpText || (helpKey && getHelpTextMap()[helpKey])}>
      <IconButton
        size="small"
        className={clsx(classes.button, className, classes[variant])}
        classes={{
          root: clsx({[classes.newiconButtonRoot]: isIconView}, {[classes.iconButtonRoot]: !isIconView}),
          label: clsx({[classes.subFlowButtonLabel]: isIconView}, {[classes.iconButtonLabel]: !isIconView}),
        }}
        {...props}>
        {children}
      </IconButton>
    </Tooltip>
  );
}
