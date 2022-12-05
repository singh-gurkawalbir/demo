import produce from 'immer';
import actionTypes from '../../../../actions/types';

const emptySet = [];

export default (state = {}, action) => {
  const { type, integrations } = action;

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.LANDING_PAGE.RECEIVED_INTEGRATIONS:
        draft.integrations = [...integrations];

        break;
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.getLandingPageIntegrations = state => {
  if (!state || !state.integrations) {
    return emptySet;
  }

  return state.integrations;
};

selectors.getLandingPageIntegrationName = (state, integrationId) => {
  if (!state || !state.integrations) {
    return;
  }

  return state.integrations.find(eachIa => eachIa._id === integrationId)?.name;
};

// #endregion
