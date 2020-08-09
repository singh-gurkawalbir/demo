import React from 'react';
import { makeStyles } from '@material-ui/core';
import RefreshIcon from '../../../../../../../components/icons/RefreshIcon';
import CancelIcon from '../../../../../../../components/icons/CancelIcon';
import RunFlowButton from '../../../../../../../components/RunFlowButton';
import IconTextButton from '../../../../../../../components/IconTextButton';

const useStyles = makeStyles(theme => ({
  rightActionContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignContent: 'center',
    margin: theme.spacing(1),
  },
}));
export default function LatestJobActions({ flowId }) {
  const classes = useStyles();

  return (
    <div className={classes.rightActionContainer}>
      <RunFlowButton variant="iconText" flowId={flowId} label="Run" />
      <IconTextButton>
        <RefreshIcon /> Refresh
      </IconTextButton>
      <IconTextButton>
        <CancelIcon /> Cancel
      </IconTextButton>
    </div>
  );
}
