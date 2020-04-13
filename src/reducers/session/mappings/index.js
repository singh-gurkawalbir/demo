import shortid from 'shortid';
import produce from 'immer';
import { differenceWith, isEqual } from 'lodash';
import actionTypes from '../../../actions/types';
import mappingUtil from '../../../utils/mapping';
import lookupUtil from '../../../utils/lookup';

const { deepClone } = require('fast-json-patch');

const emptySet = [];
const emptyObj = {};

export default function reducer(state = {}, action) {
  const { id, type, lookups, value, field, key, options = {} } = action;

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
            connection,
            isGroupedSampleData,
            salesforceMasterRecordTypeId,
            netsuiteRecordType,
            showSalesforceNetsuiteAssistant,
            subRecordMappingId,
            importSampleData = [],
            ...additionalOptions
          } = options;
          let formattedMappings;
          let lookups;

          // In case of subrecord mapping, extract mapping and lookups from subRecord
          if (subRecordMappingId) {
            const subRecordMappingObj = mappingUtil.generateSubrecordMappingAndLookup(
              resourceData,
              subRecordMappingId,
              isGroupedSampleData,
              netsuiteRecordType,
              additionalOptions
            );
            const {
              mappings: subrecordMapping,
              lookups: subrecordLookups = [],
            } = subRecordMappingObj || {};

            formattedMappings = subrecordMapping;
            lookups = subrecordLookups;
          } else {
            formattedMappings = mappingUtil.getMappingFromResource(
              resourceData,
              false,
              isGroupedSampleData,
              netsuiteRecordType,
              additionalOptions
            );
            lookups = lookupUtil.getLookupFromResource(resourceData);
          }

          // key would be unique property associated with each mapping.
          const tmp = {
            mappings: formattedMappings.map(m => ({
              ...m,
              rowIdentifier: 0,
              key: shortid.generate(),
            })),
            incompleteGenerates: [],
            lookups: lookups || [],
            changeIdentifier: 0,
            application,
            resource: resourceData,
            adaptorType,
            importSampleData,
            visible: true,
            isGroupedSampleData,
            flowSampleData: undefined,
            netsuiteRecordType,
            subRecordMappingId,
            salesforceMasterRecordTypeId,
            showSalesforceNetsuiteAssistant,
            // lastModifiedKey helps to set generate field when any field in salesforce mapping assistant is clicked
            lastModifiedKey: '',
          };

          tmp.mappingsCopy = deepClone(tmp.mappings);
          tmp.lookupsCopy = deepClone(tmp.lookups);

          if (
            resourceData._integrationId &&
            resourceData.http &&
            (resourceData.http.requestMediaType === 'xml' ||
              connection.http.mediaType === 'xml')
          ) {
            tmp.httpAssistantPreview = {
              rule:
                resourceData && resourceData.http && resourceData.http.body[0],
            };
          }

          draft[id] = tmp;
        }

        break;
      case actionTypes.MAPPING.CHANGE_ORDER: {
        draft[id].mappings = value;
        break;
      }

      case actionTypes.MAPPING.DELETE: {
        draft[id].changeIdentifier += 1;
        const filteredMapping = draft[id].mappings.filter(m => m.key !== key);

        draft[id].mappings = filteredMapping;

        if (draft[id].lastModifiedKey === key) draft[id].lastModifiedKey = '';

        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = mappingUtil.validateMappings(draft[id].mappings, draft[id].lookups);

        draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }

      case actionTypes.MAPPING.UPDATE_IMPORT_SAMPLE_DATA: {
        draft[id].changeIdentifier += 1;
        draft[id].importSampleData = value;
        const generateFields = mappingUtil.getFormattedGenerateData(
          value,
          draft[id].application
        );
        const { incompleteGenerates } = draft[id];

        // Special case for salesforce
        incompleteGenerates.forEach(generateObj => {
          const {
            value: incompleteGenValue,
            key: incompleteGenKey,
          } = generateObj;
          const incompleteGenIndex = draft[id].mappings.findIndex(
            m => m.key === incompleteGenKey
          );
          const childSObject =
            generateFields &&
            generateFields.find(
              field => field.id.indexOf(`${incompleteGenValue}[*].`) > -1
            );

          if (childSObject) {
            const objCopy = { ...draft[id].mappings[incompleteGenIndex] };

            objCopy.generate = childSObject.id;
            objCopy.rowIdentifier += 1;
            draft[id].mappings[incompleteGenIndex] = objCopy;
          }
        });

        draft[id].mappingsCopy = deepClone(draft[id].mappings);
        draft[id].lookupsCopy = deepClone(draft[id].lookups);
        break;
      }

      case actionTypes.MAPPING.PATCH_FIELD: {
        draft[id].changeIdentifier += 1;
        const index = draft[id].mappings.findIndex(m => m.key === key);

        if (draft[id].mappings[index]) {
          const objCopy = { ...draft[id].mappings[index] };

          objCopy.rowIdentifier += 1;

          let inputValue = value;

          if (field === 'extract') {
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
              delete objCopy.hardCodedValueTmp;
              objCopy.extract = inputValue;
            }
          } else {
            objCopy[field] = inputValue;

            if (
              !mappingUtil.isCsvOrXlsxResource(draft[id].resource) &&
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

          draft[id].mappings[index] = objCopy;
        } else if (value) {
          draft[id].mappings.push({
            [field]: value,
            rowIdentifier: 0,
            key: shortid.generate(),
          });
        }

        draft[id].lastModifiedKey = key;
        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = mappingUtil.validateMappings(draft[id].mappings, draft[id].lookups);

        draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }

      case actionTypes.MAPPING.PATCH_INCOMPLETE_GENERATES: {
        draft[id].changeIdentifier += 1;
        const incompleteGeneObj = draft[id].incompleteGenerates.find(
          gen => gen.key === key
        );

        if (incompleteGeneObj) {
          incompleteGeneObj.value = value;
        } else {
          draft[id].incompleteGenerates.push({ key, value });
        }

        break;
      }

      case actionTypes.MAPPING.PATCH_SETTINGS: {
        draft[id].changeIdentifier += 1;
        const index = draft[id].mappings.findIndex(m => m.key === key);

        if (draft[id].mappings[index]) {
          const {
            generate,
            extract,
            isNotEditable,
            isRequired,
            rowIdentifier,
            key,
          } = draft[id].mappings[index];
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

            if (valueTmp.hardCodedValue && valueTmp.hardCodedValue.length)
              valueTmp.hardCodedValueTmp = `"${valueTmp.hardCodedValue}"`;
            delete valueTmp.extract;
          }

          draft[id].mappings[index] = { ...valueTmp };
          draft[id].lastModifiedKey = key;
          const {
            isSuccess,
            errMessage: validationErrMsg,
          } = mappingUtil.validateMappings(
            draft[id].mappings,
            draft[id].lookups
          );

          draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;
        }

        break;
      }

      case actionTypes.MAPPING.UPDATE_LOOKUP: {
        draft[id].lookups = lookups;
        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = mappingUtil.validateMappings(draft[id].mappings, draft[id].lookups);

        draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;
        break;
      }

      case actionTypes.MAPPING.SET_VISIBILITY:
        if (draft[id]) draft[id].visible = value;
        break;
      case actionTypes.MAPPING.SAVE:
        draft[id].saveStatus = 'requested';
        break;
      case actionTypes.MAPPING.SAVE_COMPLETE:
        draft[id].saveStatus = 'completed';
        draft[id].validationErrMsg = undefined;
        draft[id].mappingsCopy = deepClone(draft[id].mappings);
        draft[id].lookupsCopy = deepClone(draft[id].lookups);

        break;
      case actionTypes.MAPPING.SAVE_FAILED:
        draft[id].saveStatus = 'failed';
        draft[id].validationErrMsg = undefined;

        break;
      case actionTypes.MAPPING.UPDATE_FLOW_DATA:
        draft[id].flowSampleData = value;

        break;

      case actionTypes.MAPPING.PREVIEW_REQUESTED:
        if (draft[id].preview) {
          draft[id].preview.status = 'requested';
        } else {
          draft[id].preview = { status: 'requested' };
        }

        break;
      case actionTypes.MAPPING.PREVIEW_RECEIVED: {
        const { preview } = draft[id];

        preview.data = value;
        preview.status = 'received';
        break;
      }

      case actionTypes.MAPPING.PREVIEW_FAILED: {
        const { preview } = draft[id];

        delete preview.data;
        preview.status = 'error';
        break;
      }

      default:
    }
  });
}

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

// #region PUBLIC SELECTORS
export function mapping(state, id) {
  if (!state) {
    return emptySet;
  }

  const mappings = state[id];

  if (!mappings) return emptySet;

  return mappings;
}

// #region PUBLIC SELECTORS
export function mappingsChanged(state, id) {
  if (!state || !state[id]) {
    return false;
  }

  const { mappings, mappingsCopy, lookups, lookupsCopy } = state[id];
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
}

export function mappingsSaveStatus(state, id) {
  if (!state || !state[id]) {
    return emptyObj;
  }

  const { saveStatus } = state[id];

  return {
    saveTerminated: saveStatus === 'completed' || saveStatus === 'failed',
    saveCompleted: saveStatus === 'completed',
    saveInProgress: saveStatus === 'requested',
  };
}
