import produce from 'immer';
import { addMinutes, startOfDay, endOfDay } from 'date-fns';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';

const emptySet = [];
const emptyObj = {};

// const findScript = (scriptObj, params = emptyObj) => scriptObj.find(script => {
//   let toReturn = true;

//   if (params._resourceId) {
//     toReturn = toReturn && isEqual(sortBy(script._resourceId), sortBy(params._resourceId));
//   }
//   if (params.functionType) {
//     toReturn = toReturn && isEqual(sortBy(script.functionType), sortBy(params.functionType));
//   }
//   if (params.flowId) {
//     toReturn = toReturn && isEqual(sortBy(script.flowId), sortBy(params.flowId));
//   }
//   if (params.time_lte) {
//     toReturn = toReturn && script.time_lte === params.time_lte;
//   }
//   if (params.time_gt) {
//     toReturn = toReturn && script.time_gt === params.time_gt;
//   }
//   // if (params.startAfterKey) {
//   //   toReturn = toReturn && script.startAfterKey === params.startAfterKey;
//   // }
//   if (params._forUserId) {
//     toReturn = toReturn && script._forUserId === params._forUserId;
//   }

//   return toReturn;
// });
export default (state = {}, action) => {
  const { type, scriptId = '', resourceReferences, logs, nextPageURL, field, value, flowId = '' } = action;
  // others => flowId, resourceId, functionType
  const key = `${scriptId}-${flowId}`;

  return produce(state, draft => {
    switch (type) {
      // TODO (Aditya): Check for this
      case actionTypes.SCRIPT.LOGS_REQUEST:
        if (!draft.script) {
          draft.script = {};
        }
        if (!draft.script[key]) {
          draft.script[key] = {};
        }
        draft.script[key].scriptId = scriptId;
        draft.script[key].flowId = flowId;
        draft.script[key].dateRange = {
          startDate: startOfDay(addMinutes(new Date(), -15)),
          endDate: endOfDay(new Date()),
          preset: 'last15minutes',
        };
        draft.script[key].status = 'requested';
        break;

      case actionTypes.SCRIPT.LOGS_REQUEST_FAILED:
        if (draft.script[key]) {
          draft.script[key].status = 'error';
          delete draft.script[key].nextPageURL;
        }

        break;

      case actionTypes.SCRIPT.LOGS_RECEIVED: {
        if (draft.script[key]) {
          if (!draft.script[key].logs) {
            draft.script[key].logs = [];
          }
          const oldLogCount = draft.script[key].logs.length;

          logs.forEach((log, index) => {
            draft.script[key].logs.push({...log, index: (oldLogCount + index)});
          });

          // draft.script[key].logs.push(...logs);
          draft.script[key].status = 'success';
          draft.script[key].nextPageURL = nextPageURL;
        }

        break;
      }
      case actionTypes.SCRIPT.SET_DEPENDENCY:
        if (draft.script[key]) {
          draft.script[key].resourceReferences = resourceReferences;
        }
        break;
      case actionTypes.SCRIPT.PATCH_FILTER:
        if (draft.script[key]) {
          draft.script[key][field] = value;
          if (field !== 'logLevel') {
            delete draft.script[key].logs;
            delete draft.script[key].nextPageURL;
          }
        }
        break;
      case actionTypes.SCRIPT.LOGS_REFRESH:
        if (draft.script[key]) {
          draft.script[key].status = 'requested';
          delete draft.script[key].logs;
          delete draft.script[key].nextPageURL;
        }

        break;
      case actionTypes.SCRIPT.LOGS_CLEAR:
        delete draft.script;
        break;
      case actionTypes.SCRIPT.LOGS_LOAD_MORE:
        if (draft.script[key]) {
          draft.script[key].status = 'requested';
          // draft.script[key].script;
        }
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.scriptLog = createSelector(
  (state, {scriptId = '', flowId = ''}) => {
    if (!state || !state.script) {
      return emptyObj;
    }
    const key = `${scriptId}-${flowId}`;

    return state.script[key] || emptyObj;
  },
  script => {
    const {logs, ...others} = script;
    const {logLevel} = others;
    const filteredLogs = (logLevel && logs) ? logs.filter(l => l.logLevel === logLevel) : logs;

    return {...others, logs: filteredLogs};
  }

);

selectors.flowExecutionLogScripts = createSelector(
  state => state?.script || emptySet,
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

