import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';

const emptyList = [];

export default (state = {}, action) => {
  const {
    type,
    id,
    patch: newPatch,
    conflict,
    scope,
    predicateForPatchFilter,
  } = action;
  const timestamp = Date.now();

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.STAGE_CLEAR:
        // we can't clear if there is no staged data
        if (!draft[id] || !draft[id].patch || !draft[id].patch.length) {
          return;
        }

        if (scope) {
          draft[id].patch = draft[id].patch.filter(
            patch => patch.scope !== scope
          );
        } else {
          // drop all staged patches.
          delete draft[id].patch;
        }

        return;

      case actionTypes.RESOURCE.STAGE_REMOVE:
        // we can't clear if there is no staged data
        if (!draft[id] || !draft[id].patch || !draft[id].patch.length) {
          return;
        }

        draft[id].patch = draft[id].patch.filter(predicateForPatchFilter);

        return;
      case actionTypes.RESOURCE.STAGE_UNDO:
        // we can't undo if there is no staged data
        if (!draft[id] || !draft[id].patch) {
          return;
        }

        if (scope) {
          let timestampOfPatch;

          for (let i = draft[id].patch.length - 1; i >= 0; i -= 1) {
            if (!timestampOfPatch && draft[id].patch[i].scope === scope) {
              timestampOfPatch = draft[id].patch.timestamp;
              draft[id].patch.splice(i, 1);
            }
            // removing older ones matching the same timestamp

            if (
              timestampOfPatch &&
              draft[id].patch[i].timestamp === timestampOfPatch
            ) {
              draft[id].patch.splice(i, 1);
            }
          }

          return;
        }

        // drop last patch.
        if (draft[id].patch.length > 1) {
          draft[id].patch.pop();
        } else {
          delete draft[id].patch;
        }

        return;
      case actionTypes.RESOURCE.STAGE_PATCH_AND_COMMIT:
      case actionTypes.RESOURCE.STAGE_PATCH: {
        if (!newPatch || !newPatch.length) return;

        if (!draft[id]) {
          draft[id] = {};
        }

        if (!draft[id].patch) {
          draft[id].patch = [];
        }

        // inserting the same field twice causes the previous patch to be ignored
        // TODO: a better way to deal with partial patches is required...
        // perhaps apply partial patches to only editor changes

        // scope shouldn't matter when removing partial patches
        // is it operation check that
        if (newPatch.length === 1 && newPatch[0].op === 'replace') {
          if (
            draft[id].patch.length > 0 &&
            newPatch[0].path ===
              draft[id].patch[draft[id].patch.length - 1].path &&
            newPatch[0].op === draft[id].patch[draft[id].patch.length - 1].op
          ) draft[id].patch.pop();
        }

        const scopedPatchWithTimestamp = scope
          ? newPatch.map(patch => ({
            ...patch,
            timestamp,
            scope,
          }))
          : newPatch.map(patch => ({
            ...patch,
            timestamp,
          }));

        draft[id].patch = [...draft[id].patch, ...scopedPatchWithTimestamp];

        return;
      }
      case actionTypes.RESOURCE.STAGE_CONFLICT:
        if (!draft[id]) {
          draft[id] = {};
        }

        draft[id].conflict = conflict;

        if (scope) {
          draft[id].scope = scope;
        }

        return;

      default:
        return state;
    }
  });
};

export const selectors = {};

selectors.stagedIdState = (state, id) => {
  if (!state || !id || !state[id]) {
    return null;
  }

  return state[id];
};

// #region PUBLIC SELECTORS

const transformStagedResource = (stagedIdState, scope) => {
  if (!stagedIdState) return null;

  let updatedPatches;

  if (scope) {
    updatedPatches =
      stagedIdState &&
      stagedIdState.patch &&
      stagedIdState.patch.filter(patch => patch.scope === scope);
  } else updatedPatches = stagedIdState && stagedIdState.patch;

  return { ...stagedIdState, patch: updatedPatches };
};

selectors.makeTransformStagedResource = () =>
  createSelector(
    selectors.stagedIdState,
    (_1, _2, scope) => scope,
    (stagedIdState, scope) => transformStagedResource(stagedIdState, scope)
  );
selectors.stagedResource = selectors.makeTransformStagedResource();

selectors.lookupProcessorResourceType = (state, resourceId) => {
  const stagedProcessor = selectors.stagedResource(state, resourceId);

  if (!stagedProcessor || !stagedProcessor.patch) {
    // TODO: we need a better pattern for logging warnings. We need a common util method
    // which logs these warning only if the build is dev... if build is prod, these
    // console.warn/logs should not even be bundled by webpack...
    // eslint-disable-next-line
    /*
     console.warn(
      'No patch-set available to determine new Page Processor resourceType.'
    );
    */
    return;
  }

  // [{}, ..., {}, {op: "replace", path: "/adaptorType", value: "HTTPExport"}, ...]
  const adaptorType = stagedProcessor?.patch?.find(
    p => p.op === 'replace' && p.path === '/adaptorType'
  );

  // console.log(`adaptorType-${id}`, adaptorType);

  return adaptorType?.value?.includes('Export') ? 'exports' : 'imports';
};

selectors.getAllResourceConflicts = createSelector(
  state => state,
  state => {
    if (!state) {
      return emptyList;
    }

    return Object.keys(state)
      .filter(rId => state[rId] && state[rId].conflict)
      .map(rId => ({ resourceId: rId, conflict: state[rId].conflict }));
  }
);
// #endregion
