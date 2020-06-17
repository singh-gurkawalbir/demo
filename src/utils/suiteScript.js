import trim from './trim';

const flowTypes = {
  REALTIME_EXPORT: 'REALTIME_EXPORT',
  REALTIME_IMPORT: 'REALTIME_IMPORT',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
};

const flowTypeToIdPrefixMap = {
  [flowTypes.REALTIME_EXPORT]: 're',
  [flowTypes.REALTIME_IMPORT]: 'ri',
  [flowTypes.EXPORT]: 'e',
  [flowTypes.IMPORT]: 'i',
};

export const flowTypeFromId = _id => {
  let type;
  Object.keys(flowTypeToIdPrefixMap).forEach(key => {
    if (_id.startsWith(flowTypeToIdPrefixMap[key])) {
      type = key;
    }
  });
  return type;
};

export const generateUniqueFlowId = (_id, type) => `${flowTypeToIdPrefixMap[type]}${_id}`;

export const getFlowIdAndTypeFromUniqueId = _id => {
  const flowType = flowTypeFromId(_id);
  return {flowType, flowId: _id.replace(flowTypeToIdPrefixMap[flowType], '')};
};

export const suiteScriptResourceKey = ({
  ssLinkedConnectionId,
  resourceType,
  resourceId,
}) => `${ssLinkedConnectionId}-${resourceType}-${resourceId}`;

export const isJavaFlow = flow =>
  (flow.locationQualifier && trim(flow.locationQualifier).length > 0) ||
          ([flowTypes.REALTIME_EXPORT, flowTypes.REALTIME_IMPORT].includes(flow.type) &&
            !flow.hasConfiguration)

export const flowType = flow => {
  if (isJavaFlow(flow)) {
    return null;
  }
  if ([flowTypes.EXPORT, flowTypes.IMPORT].includes(flow.type)) {
    return 'Scheduled';
  }
  if ([flowTypes.REALTIME_EXPORT, flowTypes.REALTIME_IMPORT].includes(flow.type)) {
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
    if ([flowTypes.REALTIME_EXPORT, flowTypes.REALTIME_IMPORT].includes(flow.import.type)) {
      supportsScheduling = false
    }
  }
  if (supportsScheduling && flow.export.type === 'MY_COMPUTER') {
    supportsScheduling = false
  }
  return supportsScheduling
};

export const isFlowRunnable = flow => {
  if (!flow.disabled && ![flowTypes.REALTIME_EXPORT, flowTypes.REALTIME_IMPORT].includes(flow.type) && flow.export.type !== 'MY_COMPUTER') {
    if (flow.version && flow.hasConfiguration) {
      return true;
    }
    if (flow.locationQualifier) {
      return true;
    }
  }
  return false;
};
