
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
      .slice(pageProcessorIndex);

    dependentPageProcessors.push(...pps, ...getDependentRoutersAndPPs(flow, branch?.nextRouterId).pps);

    return dependentPageProcessors.map(pp => pp._exportId || pp._importId);
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

    // Besides resetting PPs, if the PP is in a router, we need to reset the routers followed by this PP
    if (!Number.isNaN(routerIndex) && !Number.isNaN(branchIndex)) {
      const currentBranch = flow.routers?.[routerIndex]?.branches?.[branchIndex];

      // if the current branch has nextRouterId, we should reset the dependent routers
      if (currentBranch?.nextRouterId) {
        // fetches all dependent routers
        const dependentRouters = getDependentRoutersAndPPs(flow, currentBranch.nextRouterId).routers;
        const routerIds = keys(flow.routersMap);

        routerIds.forEach(rId => {
          if (dependentRouters.includes(rId)) flow.routersMap[rId] = {};
        });
      }
    }
  }
};

export const clearInvalidStatesOnRouterUpdate = (flow, routerId) => {
  if (!flow || !routerId || !flow.routers?.length) return;
  const router = flow.routers.find(r => r.id === routerId);

  if (!router) return;

  // fetch page processors in this router
  const currentRouterPPs = router.branches.reduce((acc, branch) => {
    acc.push(...branch.pageProcessors);

    return acc;
  }, []);

  // fetch dependent routers and page processors
  const { routers: dependentRouters = [], pps: dependentPPs } = router.branches.reduce((acc, branch) => {
    // goes through all branches and fetches next dependent routers and page processors
    if (branch.nextRouterId) {
      const { routers = [], pps = []} = getDependentRoutersAndPPs(flow, branch.nextRouterId);

      return {
        routers: [...acc.routers, ...routers],
        pps: [...acc.pps, ...pps],
      };
    }

    return acc;
  }, { routers: [], pps: []});

  // remove router flow data
  if (flow.routersMap) {
    const routerIds = keys(flow.routersMap || {});

    routerIds.forEach(rId => {
      if (dependentRouters.includes(rId)) flow.routersMap[rId] = {};
    });
  }
  // remove page processor flow data
  if (flow.pageProcessorsMap) {
    // dependent ppIds are the page processors in the current router and the dependent routers
    const dependentPPIds = [...currentRouterPPs, ...dependentPPs].map(pp => pp._exportId || pp._importId);
    const ppIds = keys(flow.pageProcessorsMap || {});

    ppIds.forEach(ppId => {
      if (dependentPPIds.includes(ppId)) flow.pageProcessorsMap[ppId] = {};
    });
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
