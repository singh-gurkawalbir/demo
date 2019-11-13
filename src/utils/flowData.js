/*
 * Utility functions related to sample data for flows
 */
import { keys } from 'lodash';
import moment from 'moment';

const sampleDataStage = {
  exports: {
    inputFilter: 'flowInput',
    transform: 'raw',
    hooks: 'transform',
    outputFilter: 'hooks',
  },
  imports: {
    inputFilter: 'raw',
    preMap: 'raw',
    importMappingExtract: 'preMap',
    postMap: 'preMap',
    postSubmit: 'responseTransform',
    responseTransform: 'sampleResponse',
  },
};
// Regex for parsing patchSet paths to listen field specific changes of a resource
// sample Sequence path:  '/pageProcessors' or '/pageGenerators'
// sample responseMapping path: '/pageProcessors/${resourceIndex}/responseMapping
const pathRegex = {
  sequence: /^(\/pageProcessors|\/pageGenerators)$/,
  responseMapping: /\/pageProcessors\/[0-9]+\/responseMapping/,
};

export function getPreviewStageData(previewData, previewStage = 'parse') {
  const stages = (previewData && previewData.stages) || [];
  const parseStage = stages.find(stage => stage.name === previewStage);

  return (
    parseStage &&
    (previewStage === 'raw'
      ? parseStage.data
      : parseStage.data && parseStage.data[0])
  );
}

export const getSampleDataStage = (stage, resourceType = 'exports') =>
  sampleDataStage[resourceType][stage] || stage;

// @TODO: Raghu Change this to return instead of inplace updates to flow
export const reset = (flow, index, isPageGenerator) => {
  if (isPageGenerator) {
    const pgsToReset = flow.pageGenerators.slice(index).map(pg => pg._exportId);
    const pgIds = keys(flow.pageGeneratorsMap);

    pgIds.forEach(pgId => {
      // eslint-disable-next-line no-param-reassign
      if (pgsToReset.includes(pgId)) flow.pageGeneratorsMap[pgId] = {};
    });

    // eslint-disable-next-line no-param-reassign
    flow.pageProcessorsMap = {};
  } else {
    const ppsToReset = flow.pageProcessors
      .slice(index)
      .map(pp => pp._exportId || pp._importId);
    const ppIds = keys(flow.pageProcessorsMap);

    ppIds.forEach(ppId => {
      // eslint-disable-next-line no-param-reassign
      if (ppsToReset.includes(ppId)) flow.pageProcessorsMap[ppId] = {};
    });
  }
};

export const compare = (currentList = [], updatedList = []) => {
  const changedIndex = updatedList.findIndex((item, index) => {
    const currentItem = currentList[index] || {};

    return (
      (item._exportId || item._importId) !==
      (currentItem._exportId || currentItem._importId)
    );
  });

  return changedIndex;
};

export const getLastExportDateTime = () =>
  moment()
    .add(-1, 'y')
    .toISOString();

export const getAddedLookupInFlow = (oldFlow = {}, patchSet = []) => {
  const { pageProcessors = [] } = oldFlow;
  const pageProcessorsPatch = patchSet.find(
    patch => patch.path === '/pageProcessors'
  );
  const updatedPageProcessors =
    (pageProcessorsPatch && pageProcessorsPatch.value) || [];

  if (updatedPageProcessors.length - pageProcessors.length === 1) {
    const addedPP = updatedPageProcessors[updatedPageProcessors.length - 1];

    return addedPP.type === 'export' ? addedPP._exportId : undefined;
  }
};

// Goes through patchset changes to decide what is updated
export const getFlowUpdatesFromPatch = (patchSet = []) => {
  if (!patchSet.length) return {};
  const updatedPathsFromPatchSet = patchSet.map(patch => patch.path);
  const updates = {
    sequence: false,
    responseMapping: false,
  };

  updatedPathsFromPatchSet.forEach(path => {
    if (pathRegex.sequence.test(path) && !updates.sequence)
      updates.sequence = true;

    if (pathRegex.responseMapping.test(path) && !updates.responseMapping) {
      // Extract resourceIndex from the path
      const [resourceIndex] = path.match(/[0-9]+/);

      if (resourceIndex) {
        updates.responseMapping = {
          resourceIndex: parseInt(resourceIndex, 10),
        };
      }
    }
  });

  return updates;
};

// Checks specifically for the raw data patch call on resource
// So patchSet would be [{path:'/rawData', value:{}}]
export const isRawDataPatchSet = (patchSet = []) =>
  patchSet[0] && patchSet[0].path === '/rawData';
