import produce from 'immer';
import { addMinutes } from 'date-fns';
import { createSelector } from 'reselect';
import actionTypes from '../../../../actions/types';

const emptySet = [];
const emptyObj = {};

export default (state = {}, action) => {
  const { type, scriptId = '', resourceReferences, logs, nextPageURL, field, value, flowId = '' } = action;
  const key = `${scriptId}-${flowId}`;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.LOGS.SCRIPTS.LOGS_REQUEST:
        if (!draft.scripts) {
          draft.scripts = {};
        }
        if (!draft.scripts[key]) {
          draft.scripts[key] = {};
        }
        draft.scripts[key].scriptId = scriptId;
        draft.scripts[key].flowId = flowId;
        draft.scripts[key].dateRange = {
          startDate: addMinutes(new Date(), -15),
          endDate: new Date(),
          preset: 'last15minutes',
        };
        draft.scripts[key].status = 'requested';
        break;

      case actionTypes.LOGS.SCRIPTS.LOGS_REQUEST_FAILED:
        if (draft?.scripts?.[key]) {
          draft.scripts[key].status = 'error';
          delete draft.scripts[key].nextPageURL;
        }

        break;

      case actionTypes.LOGS.SCRIPTS.LOGS_RECEIVED: {
        if (draft?.scripts?.[key]) {
          if (!draft.scripts[key].logs) {
            draft.scripts[key].logs = [];
          }
          const oldLogCount = draft.scripts[key].logs.length;

          logs.forEach((log, index) => {
            draft.scripts[key].logs.push({...log, index: (oldLogCount + index)});
          });

          draft.scripts[key].status = 'success';
          draft.scripts[key].nextPageURL = nextPageURL;
        }

        break;
      }
      case actionTypes.LOGS.SCRIPTS.SET_DEPENDENCY:
        if (draft?.scripts?.[key]) {
          draft.scripts[key].resourceReferences = resourceReferences;
        }
        break;
      case actionTypes.LOGS.SCRIPTS.PATCH_FILTER:
        if (draft?.scripts?.[key]) {
          draft.scripts[key][field] = value;
          if (field !== 'logLevel') {
            delete draft.scripts[key].logs;
            delete draft.scripts[key].nextPageURL;
          }
        }
        break;
      case actionTypes.LOGS.SCRIPTS.LOGS_REFRESH:
        if (draft?.scripts?.[key]) {
          draft.scripts[key].status = 'requested';
          delete draft.scripts[key].logs;
          delete draft.scripts[key].nextPageURL;
        }

        break;
      case actionTypes.LOGS.SCRIPTS.LOGS_CLEAR:
        if (!scriptId && flowId) {
          Object.keys(draft.scripts).forEach(scriptKey => {
            if (draft.scripts[scriptKey]?.flowId === flowId) {
              delete draft.scripts[scriptKey];
            }
          });
        } else {
          delete draft.scripts[key];
        }

        break;
      case actionTypes.LOGS.SCRIPTS.LOGS_LOAD_MORE:
        if (draft?.scripts?.[key]) {
          draft.scripts[key].status = 'requested';
        }
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.scriptLog = createSelector(
  (state, {scriptId = '', flowId = ''}) => {
    if (!state || !state.scripts) {
      return emptyObj;
    }
    const key = `${scriptId}-${flowId}`;

    return state.scripts[key] || emptyObj;
  },
  script => {
    const {logs, ...others} = script;
    const {logLevel} = others;
    const filteredLogs = (logLevel && logs) ? logs.filter(l => l.logLevel === logLevel) : logs;

    return {...others, logs: filteredLogs};
  }

);

selectors.flowExecutionLogScripts = createSelector(
  state => state?.scripts || emptySet,
  (state, flowId) => flowId,
  (scripts, flowId) => {
    if (!flowId) {
      return emptySet;
    }
    const filteredScript = [];

    Object.keys(scripts).forEach(scriptKey => {
      if (scripts[scriptKey].flowId === flowId) {
        filteredScript.push(scripts[scriptKey]);
      }
    });

    return filteredScript;
  }
);

