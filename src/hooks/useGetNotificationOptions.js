import { useSelectorMemo } from '.';
import { selectors } from '../reducers';
import { STANDALONE_INTEGRATION } from '../constants';
import { getFlowGroup } from '../utils/flows';

export default function useGetNotificationOptions({ integrationId, flows = [], connections = [], childId}) {
  const initialValue = integrationId !== STANDALONE_INTEGRATION.id ? [{ value: integrationId, label: 'All flows' }] : [];
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, integrationId);
  const flowSections = useSelectorMemo(selectors.mkIntegrationAppFlowSections, integrationId, childId);
  const hasFlowGroupings = !!flowGroupings?.length;
  const hasFlowSections = !!flowSections?.length;

  const flowOps = flows.reduce((finalOps, f) => {
    // if it is a DIY integration and has flowGroupings
    // should add corresponding flow group name for every flow option
    if (hasFlowGroupings) {
      const flowGroupName = getFlowGroup(flowGroupings, '', f._flowGroupingId)?.name;

      finalOps.push({ value: f._id, label: f.name, groupName: flowGroupName });
    } else if (hasFlowSections) {
      // if it is an integration app and has sections
      // should add corresponding section title for every flow option
      const sectionName = flowSections.find(flowSection => flowSection.flows?.some(flow => flow._id === f._id))?.title;

      finalOps.push({ value: f._id, label: f.name, groupName: sectionName });
    } else {
      finalOps.push({ value: f._id, label: f.name });
    }

    return finalOps;
  }, initialValue);
  const connectionOps = connections.map(c => ({ value: c._id, label: c.name }));

  return { flowOps, connectionOps };
}
