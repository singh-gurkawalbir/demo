import produce from 'immer';
import actionTypes from '../../../actions/types';
import { stringCompare } from '../../../utils/sort';
import { SUITESCRIPT_CONNECTORS, SUITESCRIPT_CONNECTOR_IDS } from '../../../utils/constants';
import { isEuRegion } from '../../../forms/formFactory/utils';

const emptySet = [];
const sfConnector = SUITESCRIPT_CONNECTORS.find(s => s._id === SUITESCRIPT_CONNECTOR_IDS.salesforce);

export default (state = {}, action) => {
  const { type, connectors, templates } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.MARKETPLACE.CONNECTORS_RECEIVED:
        draft.connectors = connectors || [];

        // to show v2 SF connector only for non-eu region
        if (!isEuRegion()) {
          draft.connectors.push({...sfConnector, canInstall: true });
        }
        break;

      case actionTypes.MARKETPLACE.TEMPLATES_RECEIVED:
        draft.templates = templates || [];
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.marketPlaceState = state => state;

selectors.connectors = (state, application, sandbox, licenses) => {
  if (!state) {
    return emptySet;
  }

  let connectors = state.connectors || [];

  connectors = connectors.map(c => {
    const conn = c;

    if (conn._id === SUITESCRIPT_CONNECTOR_IDS.salesforce) {
      return conn;
    }
    const connectorLicenses = licenses.filter(l => (((conn.framework === 'twoDotZero') ? (l.type === 'integrationApp') : (l.type === 'connector')) && l._connectorId === conn._id && (l.expires || l.trialEndDate) && (!!l.sandbox === sandbox)));

    let unusedPaidLicenseExists = false;
    let usedTrialLicenseExists = false;

    connectorLicenses &&
    connectorLicenses.forEach(l => {
      if (!l._integrationId) {
        if (l.expires) {
          if (new Date(l.expires).getTime() > Date.now()) {
            unusedPaidLicenseExists = true;
          }
        } else if (new Date(l.trialEndDate).getTime() <= Date.now()) {
          usedTrialLicenseExists = true;
        }
      } else if (!l.expires) {
        usedTrialLicenseExists = true;
      }
    });

    return { ...conn, canInstall: unusedPaidLicenseExists, usedTrialLicenseExists };
  });

  if (application) {
    connectors = connectors.filter(
      c => c.applications && c.applications.includes(application)
    );
  }

  return connectors;
};

selectors.integrationAppList = state => {
  if (!state) return emptySet;

  return state.connectors || emptySet;
};

selectors.marketplaceTemplatesByApp = (state, application) => {
  if (!state) {
    return emptySet;
  }

  let templates = state.templates || emptySet;

  if (application) {
    templates = templates
      .filter(t => t.applications && t.applications.includes(application))
      .sort(stringCompare('name'));
  }

  return templates;
};

selectors.marketplaceTemplateById = (state, templateId) => {
  if (!state || !state.templates) return;

  return state.templates.find(t => t._id === templateId);
};
// #endregion
