import { useSelectorMemo } from '.';
import { selectors } from '../reducers';
import { emptyList, STANDALONE_INTEGRATION } from '../utils/constants';
import { getFlowGroup } from '../utils/resource';

export default function useGetNotificationOptions({ integrationId, flows = [], connections = []}) {
  const initialValue = integrationId !== STANDALONE_INTEGRATION.id ? [{ value: integrationId, label: 'All flows' }] : emptyList;
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, integrationId);
  const hasFlowGroupings = !!flowGroupings?.length;

  const flowOps = flows.reduce((finalOps, f) => {
    if (hasFlowGroupings) {
      const flowGroupName = getFlowGroup(flowGroupings, '', f._flowGroupingId).name;

      finalOps.push({ value: f._id, label: f.name, groupName: flowGroupName });
    } else {
      finalOps.push({ value: f._id, label: f.name });
    }

    return finalOps;
  }, initialValue);
  const connectionOps = connections.map(c => ({ value: c._id, label: c.name }));

  return { flowOps, connectionOps };
}
