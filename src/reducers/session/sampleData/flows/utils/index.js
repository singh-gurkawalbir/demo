
/* eslint-disable no-param-reassign */
import { keys } from 'lodash';

export const getFirstOutOfOrderIndex = (currentList = [], updatedList = []) => {
  const changedIndex = updatedList.findIndex((item, index) => {
    const currentItem = currentList[index] || {};

    return (
      (item._exportId || item._importId) !==
        (currentItem._exportId || currentItem._importId)
    );
  });

  return changedIndex;
};

export const clearInvalidPgOrPpStates = (flow, index, isPageGenerator) => {
  if (!flow) return;
  if (isPageGenerator) {
    const pgsToReset = flow.pageGenerators.slice(index).map(pg => pg._exportId);
    const pgIds = keys(flow.pageGeneratorsMap);

    pgIds.forEach(pgId => {
      if (pgsToReset.includes(pgId)) flow.pageGeneratorsMap[pgId] = {};
    });

    flow.pageProcessorsMap = {};
  } else {
    const ppsToReset = flow.pageProcessors
      .slice(index)
      .map(pp => pp._exportId || pp._importId);
    const ppIds = keys(flow.pageProcessorsMap);

    ppIds.forEach(ppId => {
      if (ppsToReset.includes(ppId)) flow.pageProcessorsMap[ppId] = {};
    });
  }
};

export const clearInvalidStagesForPgOrPp = (flow, index, stages = [], statusToUpdate, isPageGenerator) => {
  if (!flow) return;
  const resource = isPageGenerator ? flow.pageGenerators[index] : flow.pageProcessors[index];
  const resourceId = resource._exportId || resource._importId;
  const resourceMap = isPageGenerator ? 'pageGeneratorsMap' : 'pageProcessorsMap';
  const resourceIds = keys(flow[resourceMap]);

  if (resourceIds.includes(resourceId)) {
    stages.forEach(stage => {
      if (flow[resourceMap][resourceId][stage]) {
        if (statusToUpdate) {
          flow[resourceMap][resourceId][stage].status = statusToUpdate;
        } else {
          flow[resourceMap][resourceId][stage] = {};
        }
      }
    });
  }
};
