import { deepClone } from 'fast-json-patch';
import moment from 'moment';
import { isJsonString } from './string';

export const suiteScriptResourceKey = ({
  ssLinkedConnectionId,
  resourceType,
  resourceId,
}) => `${ssLinkedConnectionId}-${resourceType}-${resourceId}`;

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
