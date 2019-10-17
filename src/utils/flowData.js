/*
 * Utility functions related to sample data for flows
 */
import { keys } from 'lodash';

const sampleDataStage = {
  exports: {
    inputFilter: 'flowInput',
    outputFilter: 'flowInput',
    transform: 'raw',
    hooks: 'transform',
    importMapping: 'flowInput',
  },
  imports: {
    inputFilter: 'raw',
    transform: 'responseTransform',
    importMappingExtract: 'raw',
    importMappingGenerate: 'sampleData',
    hooks: 'raw',
  },
};

export const getSampleDataStage = (stage, resourceType = 'exports') =>
  sampleDataStage[resourceType][stage];

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

export const compare = (currentList, updatedList) => {
  const changedIndex = updatedList.findIndex((item, index) => {
    const currentItem = currentList[index];

    return (
      (item._exportId || item._importId) !==
      (currentItem._exportId || currentItem._importId)
    );
  });

  return changedIndex;
};
