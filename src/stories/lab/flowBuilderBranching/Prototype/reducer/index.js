import produce from 'immer';
import jsonPatch from 'fast-json-patch';
import actions from './actions';
import { emptyObject } from '../../../../../utils/constants';
import { generateAnEmptyActualRouter, generateBranch } from '../nodeGeneration';
import { populateIds } from '../translateSchema';
import { generateId } from '../lib';

const addNewStep = (draft, action) => {
  const { path, resourceType, flowNode, resourceNode, flowId } = action;

  const {session, data} = draft;
  const {staged} = session;

  if (!staged[flowId]) {
    staged[flowId] = {patch: []};
  }

  staged[flowId].patch.push({
    op: 'add',
    path,
    value: flowNode,
  });
  data.resources[resourceType].push(resourceNode);
};

const mergeTerminalNodes = (draft, action) => {
  const { flow, sourcePath, destinationPath } = action;
  const sourceRouter = jsonPatch.getValueByPointer(flow, sourcePath);
  const destinationRouter = jsonPatch.getValueByPointer(flow, destinationPath);

  const {session} = draft;
  const {staged} = session;

  const flowId = flow._id;

  if (sourceRouter && destinationRouter) {
    // eslint-disable-next-line no-console
    console.warn('already pointing to a router');

    return;
  }

  if (!staged[flowId]) {
    staged[flowId] = {patch: []};
  }

  if (!sourceRouter && !destinationRouter) {
    // create a new router
    const router = generateAnEmptyActualRouter(true);

    staged[flowId].patch.push(...[
      {
        op: 'add',
        path: sourcePath,
        value: router._id,
      },
      {
        op: 'add',
        path: destinationPath,
        value: router._id,
      },
      {
        op: 'add',
        path: '/routers/-',
        value: router,
      }]);

    return;
  }

  staged[flowId].patch.push(
    {
      op: 'add',
      path: !destinationRouter ? destinationPath : sourcePath,
      value: destinationRouter || sourceRouter,
    });
};

const splitPPArray = (ar, index) => {
  const firstHalf = ar.splice(0, index);
  const secondHalf = ar.splice(index - 1, ar.length);

  return [firstHalf, secondHalf];
};

const getInsertionIndex = path => {
  const segs = path.split('/');

  return segs[segs.length - 1];
};

const getPPOrPGPath = path => {
  const segs = path.split('/');

  return segs.filter((ele, index) => index < segs.length - 1).join('/');
};

const getBranchPath = path => {
  const segs = path.split('/');

  return segs.filter((ele, index) => index < segs.length - 2).join('/');
};

const generateTwoBranchRouter = (remainingNodes, nextRouterId) => {
  const origRouter = generateAnEmptyActualRouter();
  const branch = {...generateBranch(),
    pageProcessors: remainingNodes,
    _nextRouterId: nextRouterId,
  };

  origRouter.branches.push(branch);

  return origRouter;
};

const handleAddNewRouter = (draft, action) => {
  const { flow, path } = action;
  const { session } = draft;
  const { staged } = session;
  const flowId = flow._id;
  const pgPpPath = getPPOrPGPath(path);
  const ppPgArr = jsonPatch.getValueByPointer(flow, pgPpPath);
  const branchPath = getBranchPath(path);
  const { _nextRouterId } = jsonPatch.getValueByPointer(flow, branchPath);

  const insertionIndex = getInsertionIndex(path);

  let firstHalf;
  let secondHalf;

  if (insertionIndex !== '-') {
    [firstHalf, secondHalf] = splitPPArray(ppPgArr, insertionIndex);
  } else {
    firstHalf = ppPgArr;
    secondHalf = [{application: `none-${generateId()}`}];
  }

  if (!staged[flowId]) {
    staged[flowId] = {patch: []};
  }

  staged[flowId].patch.push({
    op: 'replace',
    path: pgPpPath,
    value: firstHalf,
  });

  const newBranchedRouter = generateTwoBranchRouter(secondHalf, _nextRouterId);

  staged[flowId].patch.push(...[{
    op: 'replace',
    path: `${branchPath}/_nextRouterId`,
    value: newBranchedRouter._id,
  }, {
    op: 'add',
    path: '/routers/-',
    value: newBranchedRouter,
  }]);
};

const handleDeleteEdge = (draft, action) => {
  const {flow, path} = action;
  const {session} = draft;
  const {staged} = session;
  const flowId = flow._id;

  if (!staged[flowId]) {
    staged[flowId] = {patch: []};
  }

  // remove the nextRouterId references
  staged[flowId].patch.push({
    op: 'remove',
    path,
  });
};

const mergeBranch = (draft, action) => {
  const {flow, sourcePath, targetNode} = action;
  const {session} = draft;
  const {staged} = session;
  const flowId = flow._id;

  if (!staged[flowId]) {
    staged[flowId] = {patch: []};
  }

  staged[flowId].patch.push({
    op: 'replace',
    path: sourcePath,
    value: targetNode.id,
  });
};

const handleDeleteNode = (draft, action) => {
  const {flow, path, isPageGenerator} = action;
  const {session} = draft;
  const {staged} = session;
  const flowId = flow._id;

  if (!staged[flowId]) {
    staged[flowId] = {patch: []};
  }
  if (isPageGenerator) {
    // remove the node
    staged[flowId].patch.push({
      op: 'remove',
      path,
    });
    // If last PG is deleted, add a new PG step
    if (flow.pageGenerators.length === 1) {
      staged[flowId].patch.push({
        op: 'add',
        path,
        value: {application: `none=${generateId()}`},
      });
    }
  } else
  // Page processors
  // Typical page processor looks like /routers/:routerIndex/branches/:branchIndex/pageProcessors/:pageProcessorIndex
  if (/\/routers\/(\d)\/branches\/(\d)\/pageProcessors\/(\d)/.test(path)) {
    const [, routerIndex, branchIndex, pageProcessorIndex] = /\/routers\/(\d)\/branches\/(\d)\/pageProcessors\/(\d)/.exec(path);
    const pageProcessors = jsonPatch.getValueByPointer(flow, `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors`);

    if (pageProcessors.length === 1) {
      const branches = jsonPatch.getValueByPointer(flow, `/routers/${routerIndex}/branches`);

      if (branches.length === 1) {
        staged[flowId].patch.push({
          op: 'remove',
          path: `/routers/${routerIndex}`,
        });
      } else {
        staged[flowId].patch.push({
          op: 'remove',
          path: `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/${pageProcessorIndex}`,
        });
      }
    } else {
      staged[flowId].patch.push({
        op: 'remove',
        path: `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/${pageProcessorIndex}`,
      });
    }
  }
};

export default function (state, action) {
  const {type } = action;

  return produce(state, draft => {
    switch (type) {
      case actions.ADD_NEW_STEP: {
        addNewStep(draft, action);

        return;
      }

      case actions.MERGE_TERMINAL_NODES: {
        mergeTerminalNodes(draft, action);

        return;
      }

      case actions.MERGE_BRANCH: {
        mergeBranch(draft, action);

        return;
      }

      case actions.ADD_NEW_ROUTER: {
        handleAddNewRouter(draft, action);

        return;
      }

      case actions.DELETE_EDGE: {
        handleDeleteEdge(draft, action);

        return;
      }

      case actions.DELETE_STEP: {
        handleDeleteNode(draft, action);

        return;
      }

      default:
        return draft;
    }
  });
}

const resourceDataModified = (
  resourceIdState,
  stagedIdState,
  resourceType,
  id
) => {
  if (!resourceType || !id) return emptyObject;

  const master = resourceIdState;
  const { patch, conflict } = stagedIdState || {};

  if (!master && !patch) return { merged: emptyObject };

  let merged;
  let lastChange;

  if (patch) {
    try {
      // If the patch is not deep cloned, its values are also mutated and
      // on some operations can corrupt the merged result.
      const patchResult = jsonPatch.applyPatch(
        master ? jsonPatch.deepClone(master) : {},
        jsonPatch.deepClone(patch)
      );

      merged = patchResult.newDocument;
    } catch (ex) {
      // eslint-disable-next-line
      console.warn('unable to apply patch to the document. PatchSet = ', patch, 'document = ', master,ex);
      // Incase if we are not able to apply patchSet to document,
      // catching the excpetion and assigning master to the merged.
      merged = master;
    }

    if (patch.length) lastChange = patch[patch.length - 1].timestamp;
  }

  const data = {
    master,
    patch,
    lastChange,
    merged: merged || master,
  };

  if (conflict) data.conflict = conflict;

  return data;
};

const getResource = (state, type, id) => state.data.resources[type].find(f => f._id === id);
const getSessionState = (state, id) => state.session.staged?.[id];

export const resourceDataSelector = (state, type, id) => {
  const resource = getResource(state, type, id);

  const session = getSessionState(state, id);

  const flow = resourceDataModified(resource, session, type, id)?.merged;

  populateIds(flow);

  return flow;
};
