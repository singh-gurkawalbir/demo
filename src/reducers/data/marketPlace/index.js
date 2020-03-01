import produce from 'immer';
import moment from 'moment';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, connectors, templates } = action;

  if (!type) {
    return state;
  }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.MARKETPLACE.CONNECTORS_RECEIVED:
        draft.connectors = connectors || [];
        break;

      case actionTypes.MARKETPLACE.TEMPLATES_RECEIVED:
        draft.templates = templates || [];
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS

export function connectors(state, application, sandbox, licenses) {
  if (!state) {
    return [];
  }

  let connectors = state.connectors || [];

  connectors = connectors.map(c => {
    const conn = c;
    let hasLicense = false;

    licenses &&
      licenses.forEach(l => {
        if (
          !hasLicense &&
          moment(l.expires) - moment() > 0 &&
          l.type === 'connector' &&
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
  if (!state) return [];

  return state.connectors || [];
}

export function templates(state, application) {
  if (!state) {
    return [];
  }

  let templates = state.templates || [];

  if (application) {
    templates = templates
      .filter(t => t.applications && t.applications.includes(application))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return templates;
}

export function template(state, templateId) {
  return ((state || {}).templates || []).find(t => t._id === templateId);
}
// #endregion
