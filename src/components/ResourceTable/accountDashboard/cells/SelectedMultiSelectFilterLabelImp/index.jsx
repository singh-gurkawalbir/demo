import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelectorMemo } from '../../../../../hooks';
import { selectors } from '../../../../../reducers';

const useStyles = makeStyles(theme => ({
  flowGroupName: {
    color: theme.palette.text.secondary,
  },
}));
export default function SelectedLabelImp({name, id}) {
  const classes = useStyles();
  const flow = useSelectorMemo(selectors.makeResourceSelector, 'flows', id);
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, flow?._integrationId);
  let flowGroupName = 'Unassigned';

  if (!flowGroupings?.length || name === 'All flows') return name;

  if (flow?._flowGroupingId) {
    flowGroupName = flowGroupings.find(flowGroup => flowGroup._id === flow._flowGroupingId)?.name;
  }

  return (
    <div>
      <span>{name}</span>
      <span className={classes.flowGroupName}>{` | ${flowGroupName}`}</span>
    </div>
  );
}
