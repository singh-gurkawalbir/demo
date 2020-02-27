import shortid from 'shortid';
import produce from 'immer';
import { differenceWith, isEqual } from 'lodash';
import actionTypes from '../../../actions/types';
import mappingUtil from '../../../utils/mapping';
import lookupUtil from '../../../utils/lookup';

const { deepClone } = require('fast-json-patch');

const emptySet = [];

// TODO: Change index to use uId
export default function reducer(state = {}, action) {
  const {
    id,
    type,
    generateFields,
    lookups,
    value,
    field,
    dragIndex,
    hoverIndex,
    uId,
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
            salesforceMasterRecordTypeId,
            netsuiteRecordType,
            showSalesforceNetsuiteAssistant,
            subRecordMappingId,
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

          const initChangeIdentifier =
            (draft[id] && draft[id].initChangeIdentifier) || 0;

          // uId would be unique property associated with each mapping.
          draft[id] = {
            mappings: formattedMappings.map(m => ({
              ...m,
              rowIdentifier: 0,
              uId: shortid.generate(),
            })),
            incompleteGenerates: [],
            lookups: lookups || [],
            initChangeIdentifier: initChangeIdentifier + 1,
            application,
            resource: resourceData,
            adaptorType,
            generateFields,
            visible: true,
            isGroupedSampleData,
            flowSampleData: undefined,
            netsuiteRecordType,
            subRecordMappingId,
            salesforceMasterRecordTypeId,
            showSalesforceNetsuiteAssistant,
            // lastModifiedUId helps to set generate field when any field in salesforce mapping assistant is clicked
            lastModifiedUId: '',
          };
          draft[id].mappingsCopy = deepClone(draft[id].mappings);
          draft[id].lookupsCopy = deepClone(draft[id].lookups);
        }

        break;
      case actionTypes.MAPPING.CHANGE_ORDER: {
        const mappingsCopy = [...draft[id].mappings];
        const dragItem = draft[id].mappings[dragIndex];

        mappingsCopy.splice(dragIndex, 1);
        mappingsCopy.splice(hoverIndex, 0, dragItem);
        // refresh mappings effected by move
        const refreshStartIndex =
          dragIndex < hoverIndex ? dragIndex : hoverIndex;
        const refreshEndIndex = dragIndex > hoverIndex ? dragIndex : hoverIndex;

        for (let i = refreshStartIndex; i <= refreshEndIndex; i += 1) {
          mappingsCopy[i].rowIdentifier += 1;
        }

        draft[id].mappings = mappingsCopy;
        break;
      }

      case actionTypes.MAPPING.DELETE: {
        draft[id].initChangeIdentifier += 1;
        const _mappings = [...draft[id].mappings];
        const filteredMapping = _mappings.filter(m => m.uId !== uId);

        draft[id].mappings = filteredMapping;

        if (draft[id].lastModifiedUId === uId) draft[id].lastModifiedUId = '';

        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = mappingUtil.validateMappings(draft[id].mappings, draft[id].lookups);

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
            uId: incompleteGenUId,
          } = generateObj;
          const incompleteGenIndex = draft[id].mappings.findIndex(
            m => m.uId === incompleteGenUId
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
        const index = draft[id].mappings.findIndex(m => m.uId === uId);

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
            uId: shortid.generate(),
          });
        }

        draft[id].lastModifiedUId = uId;
        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = mappingUtil.validateMappings(draft[id].mappings, draft[id].lookups);

        draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }

      case actionTypes.MAPPING.PATCH_INCOMPLETE_GENERATES: {
        const incompleteGeneObj = draft[id].incompleteGenerates.find(
          gen => gen.uId === uId
        );

        if (incompleteGeneObj) {
          incompleteGeneObj.value = value;
        } else {
          draft[id].incompleteGenerates.push({ uId, value });
        }

        break;
      }

      case actionTypes.MAPPING.PATCH_SETTINGS: {
        const index = draft[id].mappings.findIndex(m => m.uId === uId);

        if (draft[id].mappings[index]) {
          const {
            generate,
            extract,
            isNotEditable,
            isRequired,
            rowIdentifier,
            uId,
          } = draft[id].mappings[index];
          const valueTmp = {
            generate,
            extract,
            isNotEditable,
            isRequired,
            rowIdentifier,
            uId,
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
          draft[id].lastModifiedUId = uId;
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
        draft[id].submitCompleted = false;
        draft[id].submitFailed = false;
        break;
      case actionTypes.MAPPING.SAVE_COMPLETE:
        draft[id].submitCompleted = true;
        draft[id].validationErrMsg = undefined;
        draft[id].mappingsCopy = deepClone(draft[id].mappings);
        draft[id].lookupsCopy = deepClone(draft[id].lookups);

        break;
      case actionTypes.MAPPING.SAVE_FAILED:
        draft[id].submitFailed = true;
        draft[id].validationErrMsg = undefined;

        break;
      case actionTypes.MAPPING.UPDATE_FLOW_DATA:
        draft[id].flowSampleData = value;

        break;

      case actionTypes.MAPPING.PREVIEW_REQUESTED:
        if (draft[id].previewData) {
          draft[id].previewData.status = 'requested';
        } else {
          draft[id].previewData = { status: 'requested' };
        }

        break;
      case actionTypes.MAPPING.PREVIEW_RECEIVED: {
        let val;

        if (value && Array.isArray(value) && value.length) {
          const [_val] = value;

          val = _val;
        } else {
          val = value;
        }

        const { previewData } = draft[id];

        previewData.data = val;
        previewData.status = 'received';

        break;
      }

      case actionTypes.MAPPING.PREVIEW_FAILED: {
        const { previewData } = draft[id];

        delete previewData.data;
        previewData.status = 'error';
        break;
      }

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

  return {
    saveTerminated: !!(submitFailed || submitCompleted),
    saveCompleted: !!submitCompleted,
  };
}

const isMappingObjEqual = (mapping1, mapping2) => {
  const {
    rowIdentifier: r1,
    uId: uId1,
    isNotEditable: e1,
    isRequired: req1,
    ...formattedMapping1
  } = mapping1;
  const {
    rowIdentifier: r2,
    uId: uId2,
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
      lookupsCopy.length !== lookups.length || !lookupsDiff.length;
  }

  return isMappingsChanged;
}
