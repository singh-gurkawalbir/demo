import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip } from '@material-ui/core';
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
    backgroundColor: theme.palette.background.paper,
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
  newiconButtonLabel: {
    '& svg': {
      width: 20,
      height: 20,
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
  const { flowId } = useFlowContext();

  const iconView = useSelector(state =>
    selectors.fbIconview(state, flowId)
  );
  const isSubFlowView = useSelector(state =>
    selectors.fbSubFlowView(state, flowId)
  );

  return (
    <Tooltip title={helpText || (helpKey && getHelpTextMap()[helpKey])}>
      <IconButton
        size="small"
        className={clsx(classes.button, className, classes[variant])}
        classes={{
          root: clsx({[classes.newiconButtonRoot]: iconView === 'icon', [classes.newiconButtonRoot]: iconView !== 'icon'}),
          label: clsx({[classes.newiconButtonLabel]: (iconView === 'icon' && !isSubFlowView), [classes.iconButtonLabel]: iconView !== 'icon', [classes.subFlowButtonLabel]: isSubFlowView}),
        }}
        {...props}>
        {children}
      </IconButton>
    </Tooltip>
  );
}
