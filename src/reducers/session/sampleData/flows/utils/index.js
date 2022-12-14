
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
export const getDependentRoutersAndPPs = (flow, routerId) => {
  const routers = [routerId];
  const pps = [];

  if (flow.routers?.length) {
    const router = flow.routers.find(r => r.id === routerId);

    if (router) {
      (router.branches || []).forEach(branch => {
        if (branch.nextRouterId && !routers.includes(branch.nextRouterId)) {
          const dependencies = getDependentRoutersAndPPs(flow, branch.nextRouterId);

          routers.push(...dependencies.routers);
          pps.push(...dependencies.pps);
        }
        pps.push(...branch.pageProcessors);
      });
    }
  }

  return {routers, pps};
};
export const getPPsToReset = (flow, {routerIndex, branchIndex, pageProcessorIndex} = {}) => {
  if (!flow || (!flow.routers && !flow.pageProcessors)) return [];
  if (flow.routers?.length) {
    const dependentPageProcessors = [];
    const branch = flow.routers[routerIndex]?.branches?.[branchIndex];
    const pps = (branch?.pageProcessors || [])
      .slice(pageProcessorIndex)
      .map(pp => pp._exportId || pp._importId);

    dependentPageProcessors.push(...pps, ...getDependentRoutersAndPPs(flow, branch?.nextRouterId).pps);

    return dependentPageProcessors;
  }

  return (flow.pageProcessors || [])
    .slice(pageProcessorIndex)
    .map(pp => pp._exportId || pp._importId);
};
export const clearInvalidPgOrPpStates = (flow, index, isPageGenerator, {routerIndex, branchIndex} = {}) => {
  if (!flow) return;
  if (isPageGenerator) {
    const pgsToReset = flow.pageGenerators.slice(index).map(pg => pg._exportId);
    const pgIds = keys(flow.pageGeneratorsMap);

    pgIds.forEach(pgId => {
      if (pgsToReset.includes(pgId)) flow.pageGeneratorsMap[pgId] = {};
    });

    flow.pageProcessorsMap = {};
    flow.routersMap = {};
  } else {
    const ppsToReset = getPPsToReset(flow, {pageProcessorIndex: index, routerIndex, branchIndex});
    const ppIds = keys(flow.pageProcessorsMap);

    ppIds.forEach(ppId => {
      if (ppsToReset.includes(ppId)) flow.pageProcessorsMap[ppId] = {};
    });

    if ((routerIndex || routerIndex === 0) && (branchIndex || branchIndex === 0)) {
      const router = flow.routers[routerIndex]?.id;

      if (router) {
        const dependentRouters = getDependentRoutersAndPPs(flow, router.id).routers;
        const routerIds = keys(flow.routersMap);

        routerIds.forEach(rId => {
          if (dependentRouters.includes(rId)) flow.routersMap[rId] = {};
        });
      }
    }
  }
};

export const clearInvalidStagesForPgOrPp = (flow, index, stages = [], statusToUpdate, isPageGenerator, options = {}) => {
  if (!flow) return;
  const isLinearFlow = !flow.routers?.length;
  let resource;

  if (isPageGenerator) {
    resource = flow.pageGenerators[index];
  } else if (isLinearFlow) {
    resource = flow.pageProcessors[index];
  } else {
    resource = flow.routers[options.routerIndex].branches[options.branchIndex].pageProcessors[index];
  }
  if (!resource) return;
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
