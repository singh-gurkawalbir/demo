/*
 * Utility functions related to sample data for flows
 */
import moment from 'moment';
import { deepClone } from 'fast-json-patch';
import merge from 'lodash/merge';
import {
  isRealTimeOrDistributedResource,
  isFileAdaptor,
  isBlobTypeResource,
  isRestCsvMediaTypeExport,
  adaptorTypeMap,
} from '../resource';
import responseMappingUtil from '../responseMapping';
import arrayUtils from '../array';
import jsonUtils from '../json';
import { isIntegrationApp } from '../flows';
import { getMockOutputFromResource, validateMockOutputField } from '../flowDebugger';

export const BASE_FLOW_INPUT_STAGE = 'flowInput';
export const IMPORT_FLOW_DATA_STAGE = 'importMappingExtract';
export const IMPORT_FILTERED_DATA_STAGE = 'preMap';
export const EXPORT_FILTERED_DATA_STAGE = 'postInputFilter';
export const IMPORT_POST_MAPPED_DATA_STAGE = 'postMapOutput';

export const STAGES_TO_RESET_FLOW_DATA = ['inputFilter'];

export const sampleDataStage = {
  exports: {
    processedFlowInput: 'flowInput',
    inputFilter: 'processedFlowInput',
    postInputFilter: 'inputFilter',
    transform: 'raw',
    outputFilter: 'transform',
    preSavePage: 'outputFilter', // preSavePage indicates export hooks
    responseMappingExtract: 'preSavePage',
    responseMapping: 'responseMappingExtract',
    postResponseMap: 'responseMapping',
    postResponseMapHook: 'postResponseMap',
  },
  /**
   * flowInput, processedFlowInput, inputFilter, postInputFilter
   * raw, transform, outputFilter, preSavePage, responseMappingExtract, responseMapping, postResponseMap, postResponseMapHook
   */
  imports: {
    processedFlowInput: 'flowInput',
    inputFilter: 'processedFlowInput',
    preMap: 'inputFilter',
    importMappingExtract: 'preMap',
    importMapping: 'importMappingExtract',
    responseMappingExtract: 'responseTransform',
    responseMapping: 'responseMappingExtract',
    postResponseMap: 'responseMapping',
    postResponseMapHook: 'postResponseMap',
    postMap: 'importMapping',
    postMapOutput: 'postMap',
    postSubmit: 'responseTransform',
    responseTransform: 'sampleResponse',
  },
  flows: {
    router: 'router',
  },
  /**
   * flowInput, processedFlowInput, inputFilter, preMap, importMappingExtract, importMapping, postMap,
   * sampleResponse, responseTransform, postSubmit
   * sampleResponse, responseTransform, responseMappingExtract, responseMapping, postResponseMap, postResponseMapHook
   */
};

/*
 * Given stage and resourceType, this util parses through the sampleData stage map and constructs dependency list
 * Ex: {a: b, b: c, c:d, e: f} is the map of dependencies for a given stage
 * If the stage requested is 'a', the dependency list is [b, c, d] that infers to get stage 'a', we need to go through all these 4 stages
 */
export const getAllDependentSampleDataStages = (
  stage,
  resourceType = 'exports'
) => {
  const stagesMap = sampleDataStage[resourceType];
  let endOfIteration = false;
  let dependentStage = stagesMap[stage];

  if (!dependentStage) return [];
  const dependentStages = [dependentStage];

  while (!endOfIteration) {
    dependentStage = stagesMap[dependentStage];

    if (!dependentStage) endOfIteration = true;
    else dependentStages.push(dependentStage);
  }

  return dependentStages;
};

// compare util returns -1, 0, 1 for less, equal and greater respectively
// returns 2 when both stages need to exist incase of different paths
export const _compareSampleDataStage = (prevStage, currStage, resourceType) => {
  if (prevStage === currStage) return 0;
  const prevStageRoute = [
    prevStage,
    ...getAllDependentSampleDataStages(prevStage, resourceType),
  ];
  const currStageRoute = [
    currStage,
    ...getAllDependentSampleDataStages(currStage, resourceType),
  ];

  if (arrayUtils.isContinuousSubSet(prevStageRoute, currStageRoute)) return -1;

  if (arrayUtils.isContinuousSubSet(currStageRoute, prevStageRoute)) return 1;

  return 2;
};

// Goes through each stage and compares with currStage
// Returns closest stage from prevStages to currStage i.e., minimum of all statuses
export const getCurrentSampleDataStageStatus = (
  prevStages,
  currStage,
  resourceType
) => {
  let currentStageStatus = 2;
  let relatedPrevStage;

  prevStages.forEach(prevStage => {
    const status = _compareSampleDataStage(prevStage, currStage, resourceType);

    // min of all stages
    if (status < currentStageStatus) {
      currentStageStatus = status;
      relatedPrevStage = prevStage;
    }
  });

  return {
    currentStageStatus,
    prevStage: relatedPrevStage,
  };
};

// Regex for parsing patchSet paths to listen field specific changes of a resource
// sample Sequence path:  '/pageProcessors' or '/pageGenerators'
// sample responseMapping path: '/pageProcessors/${resourceIndex}/responseMapping
export const flowPatchRegex = {
  newPPSequence: /(\/routers\/(\d+)\/branches\/(\d+))?\/pageProcessors\/(\d+)$/,
  pgSequence: /(\/pageGenerators\/(\d+))/,
  firstPgOrPp: /\/(pageGenerators|pageProcessors)$/,
  oldPPSequence: /(\/pageProcessors\/(\d+)\/(_importId|_exportId))$/,
  responseMapping: /(\/routers\/(\d+)\/branches\/(\d+))?\/pageProcessors\/(\d+)\/responseMapping/,
  oldResponseMapping: /\/pageProcessors\/(\d+)\/responseMapping/,
  ppAddition: /\/pageProcessors\/[0-9]+$/,
  routerUpdate: /\/routers\/(\d+)$/,
};

export function getPreviewStageData(previewData, previewStage = 'parse') {
  const stages = (previewData && previewData.stages) || [];

  // Incase of raw preview stage, returns the first stage data it is in
  // Incase of http/rest first stage is 'raw' but for NS/SF/DB adaptors it is parse
  // NOTE: 'raw' preview stage is explicitly used to extract the content to be stored in S3
  if (previewStage === 'raw') {
    // Fetches first of 'raw' or 'parse' stage from preview data
    const stageData = stages.find(
      stage => stage.name === 'raw' || stage.name === 'parse'
    );

    if (stageData?.name === 'raw') {
      return stageData.data?.[0];
    }

    return stageData && stageData.data;
  }

  // Group stage is present when the groupByFields of export is configured
  // If groupStage is present, we return the groupStage instead of parse stage to get the grouped data
  // NOTE: As of now, the group stage is available for http and DB adaptors only
  const groupStage = stages.find(stage => stage.name === 'group');
  const parseStage = stages.find(stage => stage.name === previewStage);

  return previewStage === 'parse' ? groupStage?.data?.[0] || parseStage?.data?.[0] : parseStage?.data?.[0];
}

export const getSampleDataStage = (stage, resourceType = 'exports') =>
  (sampleDataStage?.[resourceType]?.[stage]) || stage;

export const getLastExportDateTime = resource => {
  const dateFormat = resource?.delta?.dateFormat;

  if (dateFormat) {
    return moment()
      .add(-1, 'y')
      .format(dateFormat);
  }

  return moment()
    .add(-1, 'y')
    .toISOString();
};

export const getCurrentExportDateTime = resource => {
  const dateFormat = resource?.delta?.dateFormat;

  if (dateFormat) {
    return moment().format(dateFormat);
  }

  return moment().toISOString();
};

export const getPostDataForDeltaExport = (resource, customDate) => ({
  lastExportDateTime: customDate || getLastExportDateTime(resource),
  currentExportDateTime: getCurrentExportDateTime(resource),
});

const isRouterRemoved = patchSet => {
  const removeRouterRegexList = [
    /\/routers$/, // remove when only 1 router is present
    /\/routers\/(\d+)$/, // remove first router in multiple routers
    /\/routers\/(\d+)\/branches\/(\d+)$/, // multiple routers and remove any router other than first
  ];

  return removeRouterRegexList.some(regex => {
    const patch = patchSet.find(patch => patch.path.match(regex));

    return patch && patch.op === 'remove';
  });
};

// Goes through patchset changes to decide what is updated
export const getFlowUpdatesFromPatch = (patchSet = []) => {
  if (!patchSet.length) return {};
  // There is a case when we update flow just to update lastModified property
  // In that case, no need of any update for flowData
  if (patchSet.find(patch => patch.path === '/lastModified')) return {};
  // Analyze patches and update stages updated
  const updatedPathsFromPatchSet = patchSet.map(patch => patch.path);
  const updates = {
    sequence: false,
    responseMapping: false,
    router: false,
  };

  if (isRouterRemoved(patchSet)) {
    updates.router = {
      deleted: true,
    };

    return updates;
  }

  updatedPathsFromPatchSet.forEach(path => {
    //  If the patch matches changes for either PP/PG (Old & New formats),
    // then there is a change in Flow sequence ( Add/Delete )
    if (!updates.sequence && (
      flowPatchRegex.pgSequence.test(path) ||
      flowPatchRegex.oldPPSequence.test(path) ||
      flowPatchRegex.newPPSequence.test(path)
    )) {
      updates.sequence = true;
    }

    // If the patch matches changes in response mapping (New formats),
    // then there is a change in pp's response mapping
    if (!updates.responseMapping && flowPatchRegex.responseMapping.test(path)) {
      // Extract resourceIndex from the path
      const [,, routerIndex, branchIndex, resourceIndex] = flowPatchRegex.responseMapping.exec(path);

      if (resourceIndex) {
        updates.responseMapping = {
          resourceIndex: +resourceIndex,
          ...(branchIndex !== undefined ? {branchIndex: +branchIndex} : {}),
          ...(routerIndex !== undefined ? {routerIndex: +routerIndex} : {}),
        };
      }
    }

    // If the patch matches changes in response mapping (Old format),
    // then there is a change in pp's response mapping
    if (!updates.responseMapping && flowPatchRegex.oldResponseMapping.test(path)) {
      // Extract resourceIndex from the path
      const [resourceIndex] = path.match(/[0-9]+/);

      if (resourceIndex) {
        updates.responseMapping = {
          resourceIndex: parseInt(resourceIndex, 10),
        };
      }
    }

    if (!updates.router && flowPatchRegex.routerUpdate.test(path)) {
      // Extract routerIndex from the path
      updates.router = {
        updated: true,
        routerIndex: +path.match(/[0-9]/)[0],
      };
    }
  });

  return updates;
};

// Checks specifically for the raw data / sample data patch call on resource
// So patchSet would be [{path:'/rawData', value:{}}] or [{path:'/sampleData', value:{}}]
export const isRawDataPatchSet = (patchSet = []) =>
  patchSet[0] && ['/rawData', '/sampleData'].includes(patchSet[0].path);

/*
 * File adaptor / Real time( NS/ SF/ Webhooks)/ Blob type/ Rest CSV resources need UI Data to be passed in Page processor preview
 */
export const isUIDataExpectedForResource = (resource, connection) => {
  // if mockoutput data is populated on the resource, we don't need to send UI data
  if (getMockOutputFromResource(resource)) return false;

  return isRealTimeOrDistributedResource(resource) ||
        isFileAdaptor(resource) ||
        isRestCsvMediaTypeExport(resource, connection) ||
        isBlobTypeResource(resource) ||
        isIntegrationApp(resource);
};

export const isFileMetaExpectedForResource = resource => isFileAdaptor(resource);

// Gives sample file data
export const getSampleFileMeta = resource => {
  const isFileMetaRequiredForHTTPExport = resource?.adaptorType === 'HTTPExport' && resource?.http?.response?.fileURLPaths.some(path => !!path);
  const isFileMetaRequired = isFileMetaRequiredForHTTPExport || isFileMetaExpectedForResource(resource);

  if (!isFileMetaRequired) {
    return undefined;
  }

  if (isFileMetaRequiredForHTTPExport) {
    return [
      [
        {
          fileMeta: {
            fileName: 'sampleFileName',
            lastModifiedTime: 'Fri, 01 Jan 2000 00:00:00 GMT',
          },
        },
      ],
    ];
  }
  if (resource?.adaptorType === 'FTPExport') {
    return [
      {
        fileMeta: {
          fileName: 'sampleFileName',
          fileSize: 1234,
        },
      },
    ];
  }

  return [
    {
      fileMeta: {
        fileName: 'sampleFileName',
      },
    },
  ];
};

/*
 * Gives a sample data for Blob resource
 */
export const getBlobResourceSampleData = () => ({
  blobKey: 'blobKey',
});

export const isOneToManyResource = resource =>
  !!(resource && resource.oneToMany);

/*
 * Cases where postData needs to be passed in resource while previewing
 * 1. Incase of Delta export , postData needs to be sent
 * 2. Incase of Schedules Salesforce Export, user can add a SOQL Query using {{data.lastExportDateTime}},
 *  for which BE expects that "lastExportDateTime" to be passed as part of postData inside resource
 */
export const isPostDataNeededInResource = resource => {
  const { adaptorType, salesforce = {}, type } = resource || {};
  const isDeltaExport = type === 'delta';
  const isScheduledSFExport =
    adaptorTypeMap[adaptorType] === 'salesforce' &&
    salesforce.executionType === 'scheduled';

  return isDeltaExport || isScheduledSFExport;
};

/*
 * Based on resource type fetch the default extracts list
 * Ex: For Lookups: [ 'data','errors','ignored','statusCode']
 * This fn returns { data:'', errors: '', ignored: '', statusCode: ''}
 */
export const generateDefaultExtractsObject = (resourceType, adaptorType) => {
  const defaultExtractsList = responseMappingUtil.getResponseMappingExtracts(resourceType, adaptorType);

  return defaultExtractsList.reduce((acc, extractItem) => {
    acc[extractItem] = '';

    return acc;
  }, {});
};

/*
 * @Inputs: flowInputData and rawData for the pp
 * This util merges both to generate actual format of Flow Record being passed at runtime
 * If flowData is Array , then merge rawData to each object in that array
 * If flowData is an Object, then merge rawData and return the merged object
 */
export const generatePostResponseMapData = (flowData, rawData = {}) => {
  if (Array.isArray(flowData)) {
    return flowData.map(fd => merge(fd, rawData));
  }

  return merge(flowData, rawData);
};

export const getFormattedResourceForPreview = (
  resourceObj,
  resourceType,
  flowType,
  customStartDate
) => {
  const resource = deepClone(resourceObj || {});

  // type Once need not be passed in preview as it gets executed in preview call
  // so remove type once
  if (resource && resource.type === 'once') {
    delete resource.type;
    const { adaptorType } = resource;
    const appType = adaptorType && adaptorTypeMap[adaptorType];

    // Manually removing once doc incase of preview to restrict execution on once query - Bug fix IO-11988
    if (appType && resource[appType] && resource[appType].once) {
      delete resource[appType].once;
    }
  }

  if (resource.http?.formType === 'rest' && !resource.assistant) {
    delete resource.rest;
  }

  if (isPostDataNeededInResource(resource)) {
    resource.postData = getPostDataForDeltaExport(resource, customStartDate);
  }

  if (resource.mockOutput && validateMockOutputField(resource.mockOutput)) {
    delete resource.mockOutput;
  }

  if (flowType === 'pageProcessors' && !resource.mockResponse) {
    // Incase of pp , morph mockResponse to support Response Mapping
    // If there is no mockResponse, add default fields for lookups/imports
    resource.mockResponse = generateDefaultExtractsObject(resourceType, resource?.adaptorType);
  }

  return resource;
};

// updating correct http resource and endpoint ids for http2.0
export const updateHTTP2Metadata = (resourceObj, formKey) => {
  const resource = deepClone(resourceObj || {});
  const resourceType = formKey.includes('imports') ? 'imports' : 'exports';

  if (['exports', 'imports'].includes(resourceType) &&
resource?.http?._httpConnectorResourceId && resource?.assistantMetadata
  ) {
    if (resource?.http?._httpConnectorResourceId?.includes('+')) {
      resource.http._httpConnectorResourceId = resource.http._httpConnectorResourceId.split('+')?.[0];
    }
    if (resourceType === 'exports' && resource?.http?._httpConnectorEndpointId?.includes('+')) {
      resource.http._httpConnectorEndpointId = resource.http._httpConnectorEndpointId.split('+')?.[0];
    }
    if (resourceType === 'imports' && resource.http._httpConnectorEndpointIds?.[0]?.includes('+')) {
      resource.http._httpConnectorEndpointIds = [resource.http._httpConnectorEndpointIds[0].split('+')?.[0]];
    }
    resource.assistantMetadata = undefined;
  }

  return resource;
};
/**
 * @input patchSet
 * @input resourceType : Default value is exports
 * @outPut stage /  undefined
 * The stage returned is used to determine what parts of resource's stages need to be updated
 * If none of the below paths are matched, returns undefined which implies reset the entire resource's state
 */
export const getResourceStageUpdatedFromPatch = (patchSet = [], resourceType = 'exports') => {
  const { path: patchSetPath, value: patchSetValue = {} } = patchSet[0] || {};

  if (patchSetPath === '/transform') return 'transform';
  if (patchSetPath === '/filter') {
    if (resourceType === 'imports') {
      // Incase of imports, patchSet is filter for inputFilter
      return 'inputFilter';
    }

    // Incase of pgs/lookups, patchSet is filter for outputFilter
    // and inputFilter for inputFilter
    return 'outputFilter';
  }
  if (patchSetPath === '/inputFilter') return 'inputFilter';
  if (patchSetPath === '/hooks') {
    if (patchSetValue.preSavePage) return 'preSavePage';
    if (patchSetValue.preMap) return 'preMap';
    if (patchSetValue.postMap) return 'postMap';
  }
  if (patchSetPath?.includes('/mapping')) return 'importMapping';
};

/**
 * gives all the succeeding stages followed by passed stage
 * @input stage
 * @input resourceType : supports imports, exports
 * @outPut listOfStages []
 */
export const getSubsequentStages = (stage, resourceType) => {
  if (!['exports', 'imports'].includes(resourceType)) {
    return [];
  }
  const stageMap = sampleDataStage[resourceType];
  const nextStages = [];
  const keys = jsonUtils.getObjectKeysFromValue(stageMap, stage);

  if (!keys.length) {
    return [];
  }
  nextStages.push(...keys);
  for (let i = 0; i < keys.length; i += 1) {
    const currStage = keys[i];

    nextStages.push(...(getSubsequentStages(currStage, resourceType)));
  }

  return nextStages;
};

/**
 * @param {array} patch - patch set for the resource updated
 * returns Bool whether to update sample data or not
 * If the patch is of rawData / any specific stage which implies change happened outside resourceForm
 * No need of sample data update
 * TODO @Raghu: Add intelligence to analyse patchSet and update only if specific fields in resourceForm gets updated
 * As of now any field change in the resourceForm triggers sample data update
 */
export const shouldUpdateResourceSampleData = (patch = []) =>
  !!patch.length &&
  !isRawDataPatchSet(patch) &&
  !getResourceStageUpdatedFromPatch(patch);
