import { useSelectorMemo } from '.';
import { selectors } from '../reducers';
import { emptyObject, STANDALONE_INTEGRATION } from '../utils/constants';

export default function useGetNotificationOptions({ integrationId, flows = [], connections = []}) {
  const initialValue = integrationId !== STANDALONE_INTEGRATION.id ? [{ value: integrationId, label: 'All flows' }] : [];
  const { flowGroupings } = useSelectorMemo(selectors.makeResourceSelector, 'integrations', integrationId) || emptyObject;
  const hasFlowGroupings = !!flowGroupings?.length;

  const flowOps = flows.reduce((finalOps, f) => {
    if (hasFlowGroupings) {
      const flowGroupName = flowGroupings.find(flowGroup => flowGroup._id === f._flowGroupingId)?.name;

      finalOps.push({ value: f._id, label: f.name, groupName: flowGroupName || 'Unassigned' });
    } else {
      finalOps.push({ value: f._id, label: f.name });
    }

    return finalOps;
  }, initialValue);
  const connectionOps = connections.map(c => ({ value: c._id, label: c.name }));

  return { flowOps, connectionOps };
}
