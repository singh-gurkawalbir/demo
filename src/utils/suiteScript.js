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

  if (!_id) { return null; }
  Object.keys(flowTypeToIdPrefixMap).forEach(key => {
    if (_id.startsWith(flowTypeToIdPrefixMap[key])) {
      type = key;
    }
  });

  return type;
};

export const generateUniqueFlowId = (_id, type) => `${flowTypeToIdPrefixMap[type]}${_id}`;

export const getFlowIdAndTypeFromUniqueId = _id => {
  const returnValue = {
    flowType: null,
    flowId: null,
  };

  if (!_id) { return returnValue; }
  const flowType = flowTypeFromId(_id);

  returnValue.flowType = flowType;
  returnValue.flowId = _id.replace(flowTypeToIdPrefixMap[flowType], '');

  return returnValue;
};

export const suiteScriptResourceKey = ({
  ssLinkedConnectionId,
  resourceType,
  resourceId,
}) => `${ssLinkedConnectionId}-${resourceType}-${resourceId}`;

export const isJavaFlow = flow =>
  !!(flow && ((flow.locationQualifier && flow.locationQualifier.trim().length > 0) ||
          ([flowTypes.REALTIME_EXPORT, flowTypes.REALTIME_IMPORT].includes(flow.type) &&
            !flow.hasConfiguration)));

export const flowType = flow => {
  if (!flow || isJavaFlow(flow)) {
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
  if (!flow) {
    return false;
  }
  let supportsMapping = !!flow.editable;

  if (supportsMapping && flow.import) {
    if (['ACTIVITY_STREAM', 'ftp', 'magento', 'ebay'].includes(flow.import.type)) {
      supportsMapping = false;
    }
  }
  if (supportsMapping && flow.export?.type === 'MY_COMPUTER') {
    supportsMapping = false;
  }

  return supportsMapping;
};

export const flowAllowsScheduling = flow => {
  if (!flow) {
    return false;
  }
  let supportsScheduling = !!flow.editable;

  if (supportsScheduling) {
    if ([flowTypes.REALTIME_EXPORT, flowTypes.REALTIME_IMPORT].includes(flow.type)) {
      supportsScheduling = false;
    }
  }
  if (supportsScheduling && flow.export?.type === 'MY_COMPUTER') {
    supportsScheduling = false;
  }

  return supportsScheduling;
};

export const isFlowRunnable = flow => {
  if (flow && !flow.disabled && ![flowTypes.REALTIME_EXPORT, flowTypes.REALTIME_IMPORT].includes(flow.type) && flow.export?.type !== 'MY_COMPUTER') {
    if (flow.version && flow.hasConfiguration) {
      return true;
    }
    if (flow.locationQualifier && flow.locationQualifier.trim().length > 0) {
      return true;
    }
  }

  return false;
};
