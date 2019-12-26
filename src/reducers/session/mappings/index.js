import produce from 'immer';
import actionTypes from '../../../actions/types';
import mappingUtil from '../../../utils/mapping';
import lookupUtil from '../../../utils/lookup';

const emptySet = [];

export default function reducer(state = {}, action) {
  const {
    id,
    type,
    generateFields,
    lookups,
    value,
    index,
    field,
    options = {},
  } = action;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    switch (type) {
      case actionTypes.MAPPING.INIT:
        {
          const {
            adaptorType,
            resourceData,
            application,
            isGroupedSampleData,
            ...additionalOptions
          } = options;
          const formattedMappings = mappingUtil.getMappingFromResource(
            resourceData,
            adaptorType,
            false,
            isGroupedSampleData,
            additionalOptions
          );
          const lookups = lookupUtil.getLookupFromResource(
            resourceData,
            adaptorType
          );
          const initChangeIdentifier =
            (draft[id] && draft[id].initChangeIdentifier) || 0;

          draft[id] = {
            mappings: formattedMappings.map(m => ({ ...m, rowIdentifier: 0 })),
            incompleteGenerates: [],
            lookups: lookups || [],
            initChangeIdentifier: initChangeIdentifier + 1,
            application,
            resource: resourceData,
            adaptorType,
            generateFields,
            visible: true,
            isGroupedSampleData,
          };
        }

        break;
      case actionTypes.MAPPING.DELETE: {
        draft[id].initChangeIdentifier += 1;
        draft[id].mappings.splice(index, 1);
        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = mappingUtil.validateMappings(draft[id].mappings);

        draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }

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

      case actionTypes.MAPPING.PATCH_FIELD: {
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

            // remove isKey and useFirstRow if present when generate doesn't contain '[*].'
            if (inputValue.indexOf('[*].') === -1) {
              if ('isKey' in objCopy) {
                delete objCopy.isKey;
              }

              if ('useFirstRow' in objCopy) {
                delete objCopy.useFirstRow;
              }
            }
          }

          draft[id].mappings[index] = objCopy;
        } else if (value) {
          draft[id].mappings.push({
            [field]: value,
            rowIdentifier: 0,
          });
        }

        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = mappingUtil.validateMappings(draft[id].mappings);

        draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }

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
          const {
            generate,
            extract,
            isNotEditable,
            index: mappingIndex,
            isRequired,
            rowIdentifier,
          } = draft[id].mappings[index];
          const valueTmp = {
            generate,
            extract,
            isNotEditable,
            index: mappingIndex,
            isRequired,
            rowIdentifier,
          };

          Object.assign(valueTmp, value);

          // removing lookups
          if (!value.lookupName) {
            delete valueTmp.lookupName;
          }

          valueTmp.rowIdentifier += 1;

          if (valueTmp.hardCodedValue) {
            valueTmp.hardCodedValueTmp = `"${valueTmp.hardCodedValue}"`;
            delete valueTmp.extract;
          }

          draft[id].mappings[index] = { ...valueTmp };
          const {
            isSuccess,
            errMessage: validationErrMsg,
          } = mappingUtil.validateMappings(draft[id].mappings);

          draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;
        }

        break;
      case actionTypes.MAPPING.UPDATE_LOOKUP:
        draft[id].lookups = lookups;
        break;
      case actionTypes.MAPPING.SET_VISIBILITY:
        if (draft[id]) draft[id].visible = value;
        break;
      case actionTypes.MAPPING.SAVE:
        draft[id].submitCompleted = false;
        draft[id].submitFailed = false;
        break;
      case actionTypes.MAPPING.SAVE_COMPLETE:
        draft[id].submitCompleted = true;
        draft[id].validationErrMsg = undefined;

        break;
      case actionTypes.MAPPING.SAVE_FAILED:
        draft[id].submitFailed = true;
        draft[id].validationErrMsg = undefined;

        break;
      default:
    }
  });
}

// #region PUBLIC SELECTORS
export function mappingSaveProcessTerminate(state, id) {
  if (!state) {
    return emptySet;
  }

  if (!state[id]) return false;
  const { submitFailed, submitCompleted } = state[id];

  return !!(submitFailed || submitCompleted);
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
