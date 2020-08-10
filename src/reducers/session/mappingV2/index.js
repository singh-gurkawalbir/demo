import shortid from 'shortid';
import produce from 'immer';
import { differenceWith, isEqual } from 'lodash';
import actionTypes from '../../../actions/types';
import mappingUtil from '../../../utils/mapping';

const { deepClone } = require('fast-json-patch');

const emptySet = [];
const emptyObj = {};

export default (state = {}, action) => {
  const { type} = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.MAPPINGV2.INIT:
      {
        if (!draft.mapping) {
          draft.mapping = {
            status: 'requested',
          };
        } else {
          draft.mapping.status = 'requested';
        }

        break;
      }
      case actionTypes.MAPPINGV2.INIT_COMPLETE: {
        const {mappings, lookups, flowId, resourceId, subRecordMappingId} = action;

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
      }

      case actionTypes.MAPPINGV2.CHANGE_ORDER: {
        const {value} = action;

        draft.mapping.mappings = value;
        break;
      }
      case actionTypes.MAPPINGV2.UPDATE_LAST_TOUCHED_FIELD: {
        const {key} = action;

        draft.mapping.lastModifiedRowKey = key;
        break;
      }
      case actionTypes.MAPPINGV2.DELETE: {
        const {key} = action;

        draft.mapping.changeIdentifier += 1;
        const filteredMapping = draft.mapping.mappings.filter(m => m.key !== key);

        draft.mapping.mappings = filteredMapping;

        if (draft.mapping.lastModifiedRowKey === key) delete draft.mapping.lastModifiedRowKey;

        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = mappingUtil.validateMappings(draft.mapping.mappings, draft.mapping.lookups);

        draft.mapping.validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }

      case actionTypes.MAPPINGV2.PATCH_FIELD: {
        const {field, key, value} = action;

        draft.mapping.changeIdentifier += 1;
        const index = draft.mapping.mappings.findIndex(m => m.key === key);

        if (draft.mapping.mappings[index]) {
          // in case parent mapping is displayed with subrecord mapping in future, this condition is to be modified to support that. Include isSubrecordMapping
          if (field === 'generate' && (draft.mapping.mappings[index].isRequired)) {
            return;
          }

          const objCopy = { ...draft.mapping.mappings[index] };

          objCopy.rowIdentifier += 1;

          let inputValue = value;

          if (field === 'extract') {
            if (inputValue.indexOf('"') === 0) {
              if (inputValue.charAt(inputValue.length - 1) !== '"') inputValue += '"';
              delete objCopy.extract;
              objCopy.hardCodedValue = inputValue.substr(
                1,
                inputValue.length - 2
              );
              objCopy.hardCodedValueTmp = inputValue;
            } else {
              delete objCopy.hardCodedValue;
              delete objCopy.hardCodedValueTmp;
              objCopy.extract = inputValue;
            }
          } else {
            objCopy[field] = inputValue;

            if (
              !draft.mapping.isCsvOrXlsxResource &&
              inputValue.indexOf('[*].') === -1
            ) {
              if ('isKey' in objCopy) {
                delete objCopy.isKey;
              }

              if ('useFirstRow' in objCopy) {
                delete objCopy.useFirstRow;
              }
            }
          }

          draft.mapping.mappings[index] = objCopy;
          draft.mapping.lastModifiedRowKey = objCopy.key;
        } else if (value) {
          const newKey = shortid.generate();

          draft.mapping.mappings.push({
            [field]: value,
            rowIdentifier: 0,
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

      case actionTypes.MAPPINGV2.PATCH_INCOMPLETE_GENERATES: {
        const { key, value} = action;

        draft.mapping.changeIdentifier += 1;
        const incompleteGeneObj = draft.mapping.incompleteGenerates.find(
          gen => gen.key === key
        );

        if (incompleteGeneObj) {
          incompleteGeneObj.value = value;
        } else {
          draft.mapping.incompleteGenerates.push({ key, value });
        }

        break;
      }

      case actionTypes.MAPPINGV2.PATCH_SETTINGS: {
        const { key, value} = action;

        draft.mapping.changeIdentifier += 1;
        const index = draft.mapping.mappings.findIndex(m => m.key === key);

        if (draft.mapping.mappings[index]) {
          const {
            generate,
            extract,
            isNotEditable,
            isRequired,
            rowIdentifier,
            key,
          } = draft.mapping.mappings[index];
          const valueTmp = {
            generate,
            extract,
            isNotEditable,
            isRequired,
            rowIdentifier,
            key,
          };

          Object.assign(valueTmp, value);

          // removing lookups
          if (!value.lookupName) {
            delete valueTmp.lookupName;
          }

          valueTmp.rowIdentifier += 1;

          if ('hardCodedValue' in valueTmp) {
            // wrap anything expect '' and null ,

            if (valueTmp.hardCodedValue && valueTmp.hardCodedValue.length) valueTmp.hardCodedValueTmp = `"${valueTmp.hardCodedValue}"`;
            delete valueTmp.extract;
          }

          draft.mapping.mappings[index] = { ...valueTmp };
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

      case actionTypes.MAPPINGV2.UPDATE_LOOKUP: {
        const {lookups} = action;

        draft.mapping.lookups = lookups;
        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = mappingUtil.validateMappings(draft.mapping.mappings, draft.mapping.lookups);

        draft.mapping.validationErrMsg = isSuccess ? undefined : validationErrMsg;
        break;
      }

      case actionTypes.MAPPINGV2.SET_VISIBILITY: {
        const {value} = action;

        if (draft.mapping) draft.mapping.visible = value;
        break;
      }
      case actionTypes.MAPPINGV2.SAVE:
        draft.mapping.saveStatus = 'requested';
        break;
      case actionTypes.MAPPINGV2.SAVE_COMPLETE:
        draft.mapping.saveStatus = 'completed';
        draft.mapping.validationErrMsg = undefined;
        draft.mapping.mappingsCopy = deepClone(draft.mapping.mappings);
        draft.mapping.lookupsCopy = deepClone(draft.mapping.lookups);

        break;
      case actionTypes.MAPPINGV2.SAVE_FAILED:
        draft.mapping.saveStatus = 'failed';
        draft.mapping.validationErrMsg = undefined;

        break;
      case actionTypes.MAPPINGV2.PREVIEW_REQUESTED:
        if (draft.mapping.preview) {
          draft.mapping.preview.status = 'requested';
        } else {
          draft.mapping.preview = { status: 'requested' };
        }

        break;
      case actionTypes.MAPPINGV2.PREVIEW_RECEIVED: {
        const {value} = action;
        const { preview } = draft.mapping;

        preview.data = value;
        preview.status = 'received';
        break;
      }

      case actionTypes.MAPPINGV2.PREVIEW_FAILED: {
        const { preview } = draft.mapping;

        delete preview.data;
        preview.status = 'error';
        break;
      }

      case actionTypes.MAPPINGV2.SET_NS_ASSISTANT_FORM_LOADED: {
        const { value} = action;

        draft.mapping.isNSAssistantFormLoaded = value;
        break;
      }
      case actionTypes.MAPPINGV2.UPDATE_MAPPINGS: {
        const { mappings } = action;

        draft.mapping.changeIdentifier += 1;
        draft.mapping.mappings = mappings;
        break;
      }
      case actionTypes.MAPPINGV2.SET_SF_SUBLIST_FIELD_NAME: {
        const { value } = action;

        draft.mapping.sfSubListExtractFieldName = value;

        if (!value) {
          const key = draft.mapping.lastModifiedRowKey;

          if (key) {
            const index = draft.mapping.mappings.findIndex(m => m.key === key);

            draft.mapping.mappings[index].rowIdentifier += 1;
          } else {
            draft.mapping.changeIdentifier += 1;
          }
        }
        break;
      }
      case actionTypes.MAPPINGV2.CLEAR: {
        // delete draft.mapping;
        break;
      }

      default:
    }
  });
};

const isMappingObjEqual = (mapping1, mapping2) => {
  const {
    rowIdentifier: r1,
    key: key1,
    isNotEditable: e1,
    isRequired: req1,
    ...formattedMapping1
  } = mapping1;
  const {
    rowIdentifier: r2,
    key: key2,
    isNotEditable: e2,
    isRequired: req2,
    ...formattedMapping2
  } = mapping2;

  return isEqual(formattedMapping1, formattedMapping2);
};

export const selectors = {};

// #region PUBLIC SELECTORS
selectors.mappingV2 = state => {
  if (!state || !state.mapping) {
    return emptySet;
  }

  return state.mapping;
};

// #region PUBLIC SELECTORS
selectors.mappingV2Changed = state => {
  if (!state || !state.mapping) {
    return false;
  }

  const { mappings, mappingsCopy, lookups, lookupsCopy } = state.mapping;
  let isMappingsChanged = mappings.length !== mappingsCopy.length;

  // change of order of mappings is treated as Mapping change
  for (let i = 0; i < mappings.length && !isMappingsChanged; i += 1) {
    isMappingsChanged = !isMappingObjEqual(mappings[i], mappingsCopy[i]);
  }

  if (!isMappingsChanged) {
    const lookupsDiff = differenceWith(lookupsCopy, lookups, isEqual);

    isMappingsChanged =
      lookupsCopy.length !== lookups.length || lookupsDiff.length;
  }

  return isMappingsChanged;
};

selectors.mappingV2SaveStatus = state => {
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
