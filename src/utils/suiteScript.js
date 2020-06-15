import trim from './trim';

export const suiteScriptResourceKey = ({
  ssLinkedConnectionId,
  resourceType,
  resourceId,
}) => `${ssLinkedConnectionId}-${resourceType}-${resourceId}`;

export const isJavaFlow = flow =>
  (flow.locationQualifier && trim(flow.locationQualifier).length > 0) ||
          (['REALTIME_EXPORT', 'REALTIME_IMPORT'].includes(flow.type) &&
            !flow.hasConfiguration)

export const flowType = flow => {
  if (isJavaFlow(flow)) {
    return null;
  }
  if (['EXPORT', 'IMPORT'].includes(flow.type)) {
    return 'Scheduled';
  }
  if (['REALTIME_EXPORT', 'REALTIME_IMPORT'].includes(flow.type)) {
    return 'Realtime';
  }
};

export const flowSupportsMapping = flow => {
  let supportsMapping = !!flow.editable
  if (supportsMapping && flow.import) {
    if (['ACTIVITY_STREAM', 'ftp', 'magento', 'ebay'].includes(flow.import.type)) {
      supportsMapping = false
    }
  }
  if (supportsMapping && flow.export.type === 'MY_COMPUTER') {
    supportsMapping = false
  }
  return supportsMapping;
};

export const flowAllowsScheduling = flow => {
  let supportsScheduling = !!flow.editable
  if (supportsScheduling && flow.import) {
    if (['REALTIME_EXPORT', 'REALTIME_IMPORT'].includes(flow.import.type)) {
      supportsScheduling = false
    }
  }
  if (supportsScheduling && flow.export.type === 'MY_COMPUTER') {
    supportsScheduling = false
  }
  return supportsScheduling
};

export const isFlowRunnable = flow => {
  if (!flow.disabled && !['REALTIME_EXPORT', 'REALTIME_IMPORT'].includes(flow.type) && flow.export.type !== 'MY_COMPUTER') {
    if (flow.version && flow.hasConfiguration) {
      return true;
    }
    if (flow.locationQualifier) {
      return true;
    }
  }
  return false;
};
