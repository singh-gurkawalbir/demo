import produce from 'immer';
import { uniq } from 'lodash';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';

const defaultState = {};

export default (state = defaultState, action) => {
  const { type, resourceType, collection, integrationId, resource } = action;

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

      case actionTypes.INTEGRATION_LCM.CLEAR_REVISIONS:
        delete draft[integrationId];
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
  revisionsList => uniq(revisionsList.map(rev => rev._byUserId))
);
selectors.revisionsFetchStatus = (state = defaultState, integrationId) => state[integrationId]?.status;
selectors.revisionInstallSteps = (state, integrationId, revisionId) => {
  const revision = selectors.revision(state, integrationId, revisionId);

  const steps = [...(revision?.installSteps || [])];

  if (steps.length) {
    const firstInCompleteStep = steps.find(step => !step.completed);

    firstInCompleteStep.isCurrentStep = true;
  }

  return steps;
};
// #endregion
