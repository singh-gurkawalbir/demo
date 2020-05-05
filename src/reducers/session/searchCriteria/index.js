import produce from 'immer';
import actionTypes from '../../../actions/types';

const emptySet = [];

function enableSearchValue2(val) {
  return val === 'between' || val === 'within' || val === 'notwithin';
}

export default function reducer(state = {}, action) {
  const { id, type, value = [], index, field } = action;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    switch (type) {
      case actionTypes.SEARCH_CRITERIA.INIT: {
        const initChangeIdentifier =
          (draft[id] && draft[id].initChangeIdentifier) || 0;

        draft[id] = {
          searchCriteria: (value || []).map(m => {
            const searchValue2Enabled = !!(
              m.operator && enableSearchValue2(m.operator)
            );

            return { ...m, rowIdentifier: 0, searchValue2Enabled };
          }),
          initChangeIdentifier: initChangeIdentifier + 1,
        };
        break;
      }

      case actionTypes.SEARCH_CRITERIA.PATCH_FIELD: {
        let fieldValue;
        let fieldJoin;

        if (field === 'field' && value) {
          const valueParts = value.split('.');

          fieldValue = valueParts.pop();
          fieldJoin = valueParts.join('.') || undefined;
        }

        if (draft[id].searchCriteria[index]) {
          if (field === 'operator') {
            const searchValue2Enabled = !!enableSearchValue2(value);

            draft[id].searchCriteria[
              index
            ].searchValue2Enabled = searchValue2Enabled;

            if (!searchValue2Enabled) {
              delete draft[id].searchCriteria[index].searchValue2;
            }
          }

          draft[id].searchCriteria[index].rowIdentifier += 1;
          draft[id].searchCriteria[index][field] = value;

          if (field === 'field') {
            draft[id].searchCriteria[index][field] = fieldValue;
            draft[id].searchCriteria[index].join = fieldJoin;
          }
        } else if (value) {
          const newObj = {
            [field]: value,
            rowIdentifier: 0,
          };

          if (field === 'operator') {
            const searchValue2Enabled = !!enableSearchValue2(value);

            newObj.searchValue2Enabled = searchValue2Enabled;
          }

          if (field === 'field') {
            newObj[field] = fieldValue;
            newObj.join = fieldJoin;
          }

          draft[id].searchCriteria.push(newObj);
        }

        break;
      }

      case actionTypes.SEARCH_CRITERIA.DELETE: {
        draft[id].initChangeIdentifier += 1;
        draft[id].searchCriteria.splice(index, 1);

        break;
      }

      default:
    }
  });
}

// #region PUBLIC SELECTORS
export function getSearchCriteria(state, id) {
  if (!state) {
    return emptySet;
  }

  const searchCriteria = state[id];

  if (!searchCriteria) return emptySet;

  return searchCriteria;
}
