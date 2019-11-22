import produce from 'immer';
import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const {
    id,
    type,
    mappings,
    adaptorType,
    application,
    generateFields,
    lookups,
    value,
    index,
    field,
  } = action;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    switch (type) {
      case actionTypes.MAPPING.INIT:
        {
          const initChangeIdentifier =
            (draft[id] && draft[id].initChangeIdentifier) || 0;

          draft[id] = {
            mappings: mappings.map(m => ({ ...m, rowIdentifier: 0 })),
            lookups,
            initChangeIdentifier,
            application,
            adaptorType,
            generateFields,
          };
        }

        break;
      case actionTypes.MAPPING.DELETE:
        draft[id].initChangeIdentifier += 1;
        draft[id].mappings.splice(index, 1);
        break;
      case actionTypes.MAPPING.PATCH_FIELD:
        if (draft[id].mappings[index]) {
          const objCopy = { ...draft[id].mappings[index] };

          objCopy.rowIdentifier += 1;

          let inputValue = value;

          if (field === 'extract') {
            if (inputValue !== '') {
              /* User removes the extract completely and blurs out, 
              extract field should be replaced back with last valid content
              Change the extract value only when he has provided valid content
            */

              if (inputValue.indexOf('"') === 0) {
                if (inputValue.charAt(inputValue.length - 1) !== '"')
                  inputValue += '"';
                delete objCopy.extract;
                objCopy.hardCodedValue = inputValue.substr(
                  1,
                  inputValue.length - 2
                );
                objCopy.hardCodedValueTmp = inputValue;
              } else {
                delete objCopy.hardCodedValue;
                objCopy.extract = inputValue;
              }
            }
          } else {
            objCopy[field] = inputValue;
          }

          draft[id].mappings[index] = objCopy;
        } else if (value) {
          draft[id].mappings.push({
            [field]: value,
            rowIdentifier: 0,
          });
        }

        break;
      case actionTypes.MAPPING.PATCH_SETTING:
        if (draft[id][index]) {
          const valueTmp = { ...value };

          valueTmp.rowIdentifier += 1;

          if (valueTmp.hardCodedValue) {
            valueTmp.hardCodedValueTmp = `"${valueTmp.hardCodedValue}"`;
          }

          draft[id][index] = { ...valueTmp };
        }

        break;
      case actionTypes.MAPPING.UPDATE_LOOKUP:
        draft[id].lookups = lookups;
        break;
      default:
    }
  });
}

// #region PUBLIC SELECTORS
const emptySet = [];

export function mapping(state, id) {
  if (!state) {
    return emptySet;
  }

  const mappings = state[id];

  if (!mappings) return emptySet;

  return mappings;
}
