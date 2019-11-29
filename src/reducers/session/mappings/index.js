import produce from 'immer';
import actionTypes from '../../../actions/types';

const emptySet = [];

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
            incompleteGenerates: [],
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
      case actionTypes.MAPPING.UPDATE_GENERATES: {
        draft[id].generateFields = generateFields;
        const { incompleteGenerates } = draft[id];

        // Special case for salesforce
        incompleteGenerates.forEach(generateObj => {
          const {
            value: incompleteGenValue,
            index: incompleteGenIndex,
          } = generateObj;
          const childSObject = generateFields.find(
            field => field.id.indexOf(`${incompleteGenValue}[*].`) > -1
          );

          if (childSObject) {
            const objCopy = { ...draft[id].mappings[incompleteGenIndex] };

            objCopy.generate = childSObject.id;
            objCopy.rowIdentifier += 1;
            draft[id].mappings[incompleteGenIndex] = objCopy;
          }
        });

        break;
      }

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
      case actionTypes.MAPPING.PATCH_INCOMPLETE_GENERATES: {
        const incompleteGeneObj = draft[id].incompleteGenerates.find(
          gen => gen.index === index
        );

        if (incompleteGeneObj) {
          incompleteGeneObj.value = value;
        } else {
          draft[id].incompleteGenerates.push({ index, value });
        }

        break;
      }

      case actionTypes.MAPPING.PATCH_SETTINGS:
        if (draft[id].mappings[index]) {
          const valueTmp = { ...draft[id].mappings[index] };

          Object.assign(valueTmp, value);

          valueTmp.rowIdentifier += 1;

          if (valueTmp.hardCodedValue) {
            valueTmp.hardCodedValueTmp = `"${valueTmp.hardCodedValue}"`;
            delete valueTmp.extract;
          }

          draft[id].mappings[index] = { ...valueTmp };
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
export function mapping(state, id) {
  if (!state) {
    return emptySet;
  }

  const mappings = state[id];

  if (!mappings) return emptySet;

  return mappings;
}
