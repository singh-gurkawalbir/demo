import shortid from 'shortid';
import produce from 'immer';
import { differenceWith, isEqual } from 'lodash';
import actionTypes from '../../../actions/types';
import mappingUtil, {isMappingEqual} from '../../../utils/mapping';

const { deepClone } = require('fast-json-patch');

const emptySet = [];
const emptyObj = {};

export default (state = {}, action) => {
  const {
    type,
    key,
    field,
    shiftIndex,
    value,
    mappings,
    lookups,
    flowId,
    resourceId,
    subRecordMappingId,
    oldValue,
    newValue,
    isConditionalLookup,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.MAPPING.INIT:
        if (!draft.mapping) {
          draft.mapping = {
            status: 'requested',
          };
        } else {
          draft.mapping.status = 'requested';
        }
        break;
      case actionTypes.MAPPING.INIT_COMPLETE:
        draft.mapping = {
          mappings,
          lookups,
          flowId,
          resourceId,
          subRecordMappingId,
          status: 'received',
          mappingsCopy: deepClone(mappings),
          lookupsCopy: deepClone(lookups),
        };
        break;
      case actionTypes.MAPPING.UPDATE_LAST_TOUCHED_FIELD:
        draft.mapping.lastModifiedRowKey = key;
        break;
      case actionTypes.MAPPING.DELETE: {
        const mappingToDelete = draft.mapping.mappings.find(m => m.key === key);

        if (mappingToDelete.lookupName) {
          // delete lookup
          draft.mapping.lookups = draft.mapping.lookups.filter(l => l.name !== mappingToDelete.lookupName);
        }
        draft.mapping.mappings = draft.mapping.mappings.filter(m => m.key !== key);
        if (draft.mapping.lastModifiedRowKey === key) delete draft.mapping.lastModifiedRowKey;

        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = mappingUtil.validateMappings(draft.mapping.mappings, draft.mapping.lookups);

        draft.mapping.validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }

      case actionTypes.MAPPING.PATCH_FIELD: {
        const index = draft.mapping.mappings.findIndex(m => m.key === key);

        if (draft.mapping.mappings[index]) {
          // in case parent mapping is displayed with subrecord mapping in future, this condition is to be modified to support that. Include isSubrecordMapping
          if (field === 'generate' && (draft.mapping.mappings[index].isRequired)) {
            return;
          }

          const mapping = draft.mapping.mappings[index];

          let inputValue = value;

          if (field === 'extract') {
            if (inputValue.indexOf('"') === 0) {
              if (inputValue.charAt(inputValue.length - 1) !== '"') inputValue += '"';
              delete mapping.extract;
              mapping.hardCodedValue = inputValue.substr(
                1,
                inputValue.length - 2
              );
            } else {
              delete mapping.hardCodedValue;
              mapping.extract = inputValue;
            }
          } else {
            mapping[field] = inputValue;

            if (
              !draft.mapping.isCsvOrXlsxResource &&
              inputValue.indexOf('[*].') === -1
            ) {
              if ('isKey' in mapping) {
                delete mapping.isKey;
              }

              if ('useFirstRow' in mapping) {
                delete mapping.useFirstRow;
              }
            }
          }

          draft.mapping.mappings[index] = mapping;
          draft.mapping.lastModifiedRowKey = mapping.key;
        } else if (value) {
          const newKey = shortid.generate();

          draft.mapping.mappings.push({
            [field]: value,
            key: newKey,
          });
          draft.mapping.lastModifiedRowKey = newKey;
        }

        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = mappingUtil.validateMappings(draft.mapping.mappings, draft.mapping.lookups);

        draft.mapping.validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }

      case actionTypes.MAPPING.PATCH_INCOMPLETE_GENERATES: {
        if (draft.mapping.incompleteGenerates) {
          const incompleteGeneObj = draft.mapping.incompleteGenerates.find(
            gen => gen.key === key
          );

          if (incompleteGeneObj) {
            incompleteGeneObj.value = value;
          } else {
            draft.mapping.incompleteGenerates.push({ key, value });
          }
        } else {
          draft.mapping.incompleteGenerates = [{ key, value }];
        }

        break;
      }

      case actionTypes.MAPPING.PATCH_SETTINGS: {
        const index = draft.mapping.mappings.findIndex(m => m.key === key);

        if (draft.mapping.mappings[index]) {
          const mapping = draft.mapping.mappings[index];

          Object.assign(mapping, value);

          // removing lookups
          if (!value.lookupName) {
            delete mapping.lookupName;
          }
          if (!value.conditional?.when) {
            delete mapping?.conditional?.when;
          }
          if (!value.conditional?.lookupName) {
            delete mapping?.conditional?.lookupName;
          }

          if ('hardCodedValue' in value) {
            delete mapping.extract;
          } else {
            delete mapping.hardCodedValue;
          }
          draft.mapping.mappings[index] = mapping;
          draft.mapping.lastModifiedRowKey = key;

          const {
            isSuccess,
            errMessage: validationErrMsg,
          } = mappingUtil.validateMappings(
            draft.mapping.mappings,
            draft.mapping.lookups
          );

          draft.mapping.validationErrMsg = isSuccess ? undefined : validationErrMsg;
        }

        break;
      }

      case actionTypes.MAPPING.SAVE:
        draft.mapping.saveStatus = 'requested';
        break;
      case actionTypes.MAPPING.SAVE_COMPLETE:
        draft.mapping.saveStatus = 'completed';
        draft.mapping.validationErrMsg = undefined;
        draft.mapping.mappingsCopy = deepClone(draft.mapping.mappings);
        draft.mapping.lookupsCopy = deepClone(draft.mapping.lookups);
        break;
      case actionTypes.MAPPING.SAVE_FAILED:
        draft.mapping.saveStatus = 'failed';
        draft.mapping.validationErrMsg = undefined;
        break;
      case actionTypes.MAPPING.PREVIEW_REQUESTED:
        if (draft.mapping.preview) {
          draft.mapping.preview.status = 'requested';
        } else {
          draft.mapping.preview = { status: 'requested' };
        }
        break;
      case actionTypes.MAPPING.PREVIEW_RECEIVED:
        draft.mapping.preview.data = value;
        draft.mapping.preview.status = 'received';
        break;
      case actionTypes.MAPPING.PREVIEW_FAILED:
        delete draft.mapping.preview.data;
        draft.mapping.preview.status = 'error';
        break;
      case actionTypes.MAPPING.SET_NS_ASSISTANT_FORM_LOADED:
        draft.mapping.isNSAssistantFormLoaded = value;
        break;
      case actionTypes.MAPPING.UPDATE_LIST:
        draft.mapping.mappings = mappings;
        break;
      case actionTypes.MAPPING.CLEAR:
        delete draft.mapping;
        break;
      case actionTypes.MAPPING.SHIFT_ORDER: {
        const itemIndex = draft.mapping.mappings.findIndex(m => m.key === key);
        const [removed] = draft.mapping.mappings.splice(itemIndex, 1);

        draft.mapping.mappings.splice(shiftIndex, 0, removed);
        break;
      }
      case actionTypes.MAPPING.ADD_LOOKUP:
        draft.mapping.lookups.push({...value, isConditionalLookup});
        break;
      case actionTypes.MAPPING.UPDATE_LOOKUP: {
        if (isConditionalLookup) {
          // case where user updates lookup name. The same is to be updated in all mapping items using it
          if (oldValue && oldValue.name !== newValue.name) {
            for (let i = 0; i < draft.mapping.mappings.length; i += 1) {
              if (draft.mapping.mappings[i]?.conditional?.lookupName === oldValue?.name) {
                draft.mapping.mappings[i].conditional.lookupName = newValue.name;
              }
            }
          }
        }
        if (oldValue?.name) {
          draft.mapping.lookups = draft.mapping.lookups.filter(l => l.name !== oldValue.name);
        }
        if (newValue) {
          draft.mapping.lookups.push({...newValue, isConditionalLookup});
        }
        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = mappingUtil.validateMappings(draft.mapping.mappings, draft.mapping.lookups);

        draft.mapping.validationErrMsg = isSuccess ? undefined : validationErrMsg;
        break;
      }

      default:
    }
  });
};

export const selectors = {};

// #region PUBLIC SELECTORS
selectors.mapping = state => {
  if (!state || !state.mapping) {
    return emptySet;
  }

  return state.mapping;
};

// #region PUBLIC SELECTORS
selectors.mappingChanged = state => {
  if (!state || !state.mapping) {
    return false;
  }

  const { mappings, mappingsCopy, lookups, lookupsCopy } = state.mapping;
  let isMappingsChanged = !isMappingEqual(mappings, mappingsCopy);

  if (!isMappingsChanged) {
    const lookupsDiff = differenceWith(lookupsCopy, lookups, isEqual);

    isMappingsChanged =
      lookupsCopy.length !== lookups.length || lookupsDiff.length;
  }

  return isMappingsChanged;
};

// #region PUBLIC SELECTORS
selectors.mappingSaveStatus = state => {
  if (!state || !state.mapping) {
    return emptyObj;
  }

  const { saveStatus } = state.mapping;

  return {
    saveTerminated: saveStatus === 'completed' || saveStatus === 'failed',
    saveCompleted: saveStatus === 'completed',
    saveInProgress: saveStatus === 'requested',
  };
};
