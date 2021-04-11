import produce from 'immer';
import meta from '../meta';
import actionTypes from '../actionTypes';

export const isActiveSubTabId = subTabState => Object.keys(subTabState).find(key => subTabState[key].active);

export const cronExpr = subTabState => ['Minute', 'Hour', 'Day of month', 'Month', 'Day of week'].map(key => {
  const activeSubId = isActiveSubTabId(subTabState[key]);

  return subTabState[key][activeSubId]?.value || '*';
}).reduce((finalRes, curr) => {
  let acc = finalRes;

  acc += ` ${curr}`;

  return acc;
}, '?');

const cronBuilderReducer = (state, action) => {
  const {type, value} = action;

  return produce(state, draft => {
    const activeSubTabState = draft.subTabState[draft.activeTab];

    draft.touched = true;
    switch (type) {
      case actionTypes.SET_PARENT_TAB:
        draft.activeTab = value;
        break;

      case actionTypes.SET_CHILD_TAB:

        Object.keys(activeSubTabState).forEach(key => {
          // eslint-disable-next-line no-param-reassign
          activeSubTabState[key].active = false;
        });
        activeSubTabState[value].active = true;

        // eslint-disable-next-line no-case-declarations
        const {type: subFieldType, min} = meta.fieldMap[value];

        if (subFieldType === 'label') {
          activeSubTabState[value].value = '*';
        }
        if (subFieldType === 'groupedButton') {
          activeSubTabState[value].value = '*';
        }
        if (subFieldType === 'slider') {
          const slidVal = activeSubTabState[value].value?.split('/')?.[1];

          if (!slidVal) { activeSubTabState[value].value = `*/${min.toString()}`; }
        }
        break;
      case actionTypes.SET_VALUE:
        // eslint-disable-next-line no-case-declarations
        const activeSubTabId = isActiveSubTabId(activeSubTabState);

        activeSubTabState[activeSubTabId].value = value;
        break;
      default:
        break;
    }
  });
};

export default cronBuilderReducer;
