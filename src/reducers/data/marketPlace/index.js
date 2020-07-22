import produce from 'immer';
import moment from 'moment';
import actionTypes from '../../../actions/types';
import { stringCompare } from '../../../utils/sort';
import { SUITESCRIPT_CONNECTORS, SUITESCRIPT_CONNECTOR_IDS } from '../../../utils/constants';

const emptySet = [];
const sfConnector = SUITESCRIPT_CONNECTORS.find(s => s._id === SUITESCRIPT_CONNECTOR_IDS.salesforce);

export default (state = {}, action) => {
  const { type, connectors, templates } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.MARKETPLACE.CONNECTORS_RECEIVED:
        draft.connectors = connectors || [];
        // to show v2 SF connector
        draft.connectors.push({...sfConnector, canInstall: true });
        break;

      case actionTypes.MARKETPLACE.TEMPLATES_RECEIVED:
        draft.templates = templates || [];
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export function marketPlaceState(state) {
  return state;
}

export function connectors(state, application, sandbox, licenses) {
  if (!state) {
    return emptySet;
  }

  let connectors = state.connectors || [];

  connectors = connectors.map(c => {
    const conn = c;
    if (conn._id === SUITESCRIPT_CONNECTOR_IDS.salesforce) {
      return conn;
    }
    let hasLicense = false;

    licenses &&
      licenses.forEach(l => {
        if (
          !hasLicense &&
          moment(l.expires) - moment() > 0 &&
          ((conn.framework === 'twoDotZero') ? (l.type === 'integrationApp') : (l.type === 'connector')) &&
          l._connectorId === conn._id &&
          !l._integrationId &&
          !!l.sandbox === sandbox
        ) {
          hasLicense = true;
        }
      });

    return { ...conn, canInstall: hasLicense };
  });

  if (application) {
    connectors = connectors.filter(
      c => c.applications && c.applications.includes(application)
    );
  }

  return connectors;
}

export function integrationAppList(state) {
  if (!state) return emptySet;

  return state.connectors || emptySet;
}

export function templates(state, application) {
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
}

export function template(state, templateId) {
  if (!state || !state.templates) return;

  return state.templates.find(t => t._id === templateId);
}
// #endregion
