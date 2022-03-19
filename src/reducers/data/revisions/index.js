import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';

const defaultState = {};

export default (state = defaultState, action) => {
  const { type, resourceType, collection, resource } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.REQUEST_COLLECTION:
        if (resourceType?.includes('revisions')) {
          const integrationId = resourceType.split('/')[1];

          if (!draft[integrationId]) {
            draft[integrationId] = {};
          }
          draft[integrationId].status = 'requested';
        }
        break;
      case actionTypes.RESOURCE.RECEIVED_COLLECTION:
        if (resourceType?.includes('revisions')) {
          const integrationId = resourceType.split('/')[1];

          if (!draft[integrationId]) {
            draft[integrationId] = {};
          }
          draft[integrationId].status = 'received';
          draft[integrationId].data = collection;
        }
        break;
      case actionTypes.RESOURCE.RECEIVED:
        if (resourceType?.includes('revisions')) {
          const integrationId = resourceType.split('/')[1];

          if (!draft[integrationId]) {
            draft[integrationId] = {};
          }
          draft[integrationId].status = 'received';
          if (!draft[integrationId].data) {
            draft[integrationId].data = [];
          }
          const index = draft[integrationId].data.findIndex(r => r._id === resource._id);

          if (index === -1) {
            draft[integrationId].data.push(resource);
          } else {
            draft[integrationId].data[index] = resource;
          }
        }
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.revisions = (state = defaultState, integrationId) => state[integrationId]?.data;
selectors.revision = (state = defaultState, integrationId, revisionId) => {
  const revisions = selectors.revisions(state, integrationId);

  return revisions?.find(rev => rev._id === revisionId);
};
selectors.uniqueUserIdsFromRevisions = createSelector(
  selectors.revisions,
  revisionsList => revisionsList.reduce((userIds, revision) => {
    if (revision._byUserId) {
      userIds.add(revision._byUserId);
    }

    return userIds;
  }, new Set())
);
selectors.revisionsFetchStatus = (state = defaultState, integrationId) => state[integrationId]?.status;
selectors.revisionInstallSteps = (state, integrationId, revisionId) => {
  const revision = selectors.revision(state, integrationId, revisionId);

  const steps = [...(revision?.installSteps || [])];

  if (steps.length) {
    const firstInCompleteStep = steps.find(step => !step.completed);

    if (firstInCompleteStep) {
      firstInCompleteStep.isCurrentStep = true;
    }
  }

  return steps;
};

selectors.revisionType = (state, integrationId, revisionId) => {
  const revision = selectors.revision(state, integrationId, revisionId);

  return revision?.type;
};

selectors.isLoadingRevisions = (state, integrationId) => {
  const status = selectors.revisionsFetchStatus(state, integrationId);

  return !status || status === 'requested';
};

selectors.integrationHasNoRevisions = (state, integrationId) => {
  const status = selectors.revisionsFetchStatus(state, integrationId);
  const revisions = selectors.revisions(state, integrationId);

  return status === 'received' && !revisions?.length;
};
// #endregion
