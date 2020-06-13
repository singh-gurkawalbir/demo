import { deepClone } from 'fast-json-patch';
import moment from 'moment';
import { isJsonString } from './string';
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

/*
 * Cases where postData needs to be passed in resource while previewing
 * 1. Incase of Delta export , postData needs to be sent
 * 2. Incase of Schedules Salesforce Export, user can add a SOQL Query using {{data.lastExportDateTime}},
 *  for which BE expects that "lastExportDateTime" to be passed as part of postData inside resource
 */
export const isPostDataNeededInResource = resource => {
  const { adaptorType, salesforce = {}, type } = resource || {};
  const isDeltaExport = type === 'delta';
  // const isScheduledSFExport =
  //   adaptorTypeMap[adaptorType] === 'salesforce' &&
  //   salesforce.executionType === 'scheduled';

  return isDeltaExport; // || isScheduledSFExport;
};

export const getLastExportDateTime = () =>
  moment()
    .add(-1, 'y')
    .toISOString();

export const getFormattedResourceForPreview = (
  resourceObj,
  resourceType,
  flowType
) => {
  const resource = deepClone(resourceObj);

  // type Once need not be passed in preview as it gets executed in preview call
  // so remove type once
  if (resource && resource.type === 'once') {
    delete resource.type;
    const { adaptorType } = resource;
    // const appType = adaptorType && adaptorTypeMap[adaptorType];

    // // Manually removing once doc incase of preview to restrict execution on once query - Bug fix IO-11988
    // if (appType && resource[appType] && resource[appType].once) {
    //   delete resource[appType].once;
    // }
  }

  if (isPostDataNeededInResource(resource)) {
    resource.postData = {
      lastExportDateTime: getLastExportDateTime(),
    };
  }

  // Incase of pp , morph sampleResponseData to support Response Mapping
  if (flowType === 'pageProcessors') {
    if (resource.sampleResponseData) {
      // If there is sampleResponseData, update it to json if not a json
      // @Raghu Make changes to save it as json in the first place, once ampersand is deprecated
      if (isJsonString(resource.sampleResponseData)) {
        resource.sampleResponseData = JSON.parse(resource.sampleResponseData);
      }
    }
    // else {
    //   // If there is no sampleResponseData, add default fields for lookups/imports
    //   // resource.sampleResponseData = generateDefaultExtractsObject(resourceType);
    // }
  }

  return resource;
};
