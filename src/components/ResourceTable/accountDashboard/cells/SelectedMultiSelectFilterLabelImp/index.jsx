import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelectorMemo } from '../../../../../hooks';
import { selectors } from '../../../../../reducers';
import { getFlowGroup } from '../../../../../utils/flows';

const useStyles = makeStyles(theme => ({
  flowGroupName: {
    color: theme.palette.text.secondary,
  },
}));
export default function SelectedLabelImp({name, id}) {
  const classes = useStyles();
  const flow = useSelectorMemo(selectors.makeResourceSelector, 'flows', id);
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, flow?._integrationId);

  if (!flowGroupings?.length || name === 'All flows') return name;

  const flowGroupName = getFlowGroup(flowGroupings, '', flow._flowGroupingId)?.name;

  return (
    <div>
      <span>{name}</span>
      <span className={classes.flowGroupName}>{` | ${flowGroupName}`}</span>
    </div>
  );
}
