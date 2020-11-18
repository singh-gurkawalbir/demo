import { STANDALONE_INTEGRATION } from '../utils/constants';

export default function useGetNotificationOptions({ integrationId, flows = [], connections = []}) {
  const initialValue = integrationId !== STANDALONE_INTEGRATION.id ? [{ value: integrationId, label: 'All flows' }] : [];

  const flowOps = flows.reduce((finalOps, f) => {
    finalOps.push({ value: f._id, label: f.name });

    return finalOps;
  }, initialValue);
  const connectionOps = connections.map(c => ({ value: c._id, label: c.name }));

  return { flowOps, connectionOps };
}
