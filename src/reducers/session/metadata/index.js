import produce from 'immer';
import actionTypes from '../../../actions/types';
import { getWSRecordId } from '../../../utils/metadata';
import commMetadataPathGen from '../../../utils/commMetadataPathGen';

function generateSalesforceOptions(data = {}, sObjectType, selectField) {
  let options = [];

  if (sObjectType) {
    if (selectField) {
      const field = (data.fields || []).find(f => f.name === selectField);

      if (field) {
        options = field.picklistValues.map(plv => ({
          label: plv.label,
          value: plv.value,
        }));
      }
    } else {
      options = data.fields.map(d => ({
        label: d.label,
        value: d.name,
        custom: d.custom,
        triggerable: d.triggerable,
        picklistValues: d.picklistValues,
        type: d.type,
      }));
    }
  } else {
    options = data.map(d => ({
      label: d.label,
      value: d.name,
      custom: d.custom,
      triggerable: d.triggerable,
    }));
  }

  return options;
}

export default (
  state = {
    netsuite: { webservices: {}, suitescript: {} },
    salesforce: {},
    assistants: { rest: {}, http: {} },
  },
  action
) => {
  const {
    type,
    metadata,
    metadataError,
    connectionId,
    recordType,
    selectField,
    commMetadataPath,
  } = action;
  const key = commMetadataPath;
  let newState;

  // DONE
  switch (type) {
    case actionTypes.METADATA.NETSUITE_REQUEST: {
      newState = { ...state.netsuite };

      newState[connectionId] = {
        ...newState[connectionId],
        [key]: { status: 'requested' },
      };

      return { ...state, ...{ netsuite: newState } };
    }

    case actionTypes.METADATA.SALESFORCE_REQUEST: {
      newState = { ...state.salesforce };

      // Creates Object with status as 'requested' incase of New Request

      if (recordType) {
        newState[connectionId] = {
          ...newState[connectionId],
          [recordType]: { status: 'requested' },
        };
      } else {
        newState[connectionId] = {
          ...newState[connectionId],
          [key]: { status: 'requested' },
        };
      }

      return { ...state, ...{ salesforce: newState } };
    }

    // DONE
    case actionTypes.METADATA.REFRESH: {
      newState = { ...state.netsuite };

      if (
        newState[connectionId] &&
        newState[connectionId][key] &&
        newState[connectionId][key].status
      ) {
        newState[connectionId][key].status = 'refreshed';
      }

      return { ...state, ...{ netsuite: newState } };
    }

    case actionTypes.METADATA.RECEIVED_NETSUITE: {
      newState = { ...state.netsuite };
      newState[connectionId] = {
        ...newState[connectionId],
        [key]: { status: 'received', data: metadata },
      };

      return { ...state, ...{ netsuite: newState } };
    }

    // DONE
    case actionTypes.METADATA.RECEIVED_SALESFORCE: {
      newState = { ...state.salesforce };
      const options = generateSalesforceOptions(
        metadata,
        recordType,
        selectField
      );

      newState[connectionId] = {
        ...newState[connectionId],
        [key]: { status: 'received', data: options },
      };

      return { ...state, ...{ salesforce: newState } };
    }

    // Error handler

    // DONE
    case actionTypes.METADATA.RECEIVED_NETSUITE_ERROR: {
      newState = { ...state.netsuite };
      const defaultError = 'Error occured';

      if (
        newState[connectionId] &&
        newState[connectionId][key] &&
        newState[connectionId][key].status === 'refreshed'
      ) {
        newState[connectionId][key].status = 'error';
        newState[connectionId][key].errorMessage =
          metadataError || defaultError;
      } else {
        newState[connectionId] = {
          ...newState[connectionId],
          [key]: {
            status: 'error',
            data: [],
            errorMessage: metadataError || defaultError,
          },
        };
      }

      return { ...state, ...{ netsuite: newState } };
    }

    case actionTypes.METADATA.RECEIVED_SALESFORCE_ERROR: {
      newState = { ...state.salesforce };
      const defaultError = 'Error occured';

      if (
        newState[connectionId] &&
        newState[connectionId][key] &&
        newState[connectionId][key].status === 'refreshed'
      ) {
        newState[connectionId][key].status = 'error';
        newState[connectionId][key].errorMessage =
          metadataError || defaultError;
      } else {
        newState[connectionId] = {
          ...newState[connectionId],
          [key]: {
            status: 'error',
            data: [],
            errorMessage: metadataError || defaultError,
          },
        };
      }

      return { ...state, ...{ salesforce: newState } };
    }

    case actionTypes.METADATA.ASSISTANT_RECEIVED: {
      const { adaptorType, assistant, metadata } = action;

      return produce(state, draft => {
        if (draft.assistants[adaptorType]) {
          // eslint-disable-next-line no-param-reassign
          draft.assistants[adaptorType][assistant] = metadata;
        }
      });
    }

    default:
      return state;
  }
};

export const optionsFromMetadata = ({
  state,
  applicationType,
  mode,
  connectionId,
  metadataType,
  recordType,
  filterKey,
  selectField,
}) => {
  const applicationResource = (state && state[applicationType]) || null;
  const path = commMetadataPathGen({
    applicationType,
    connectionId,
    metadataType,
    mode,
    recordType,
    selectField,
  });
  const { status, data, errorMessage } =
    (applicationResource &&
      applicationResource[connectionId] &&
      applicationResource[connectionId][path]) ||
    {};

  if (!data) {
    return { status, data, errorMessage };
  }

  let transformedData = data;

  if (mode === 'webservices') {
    if (metadataType === 'recordTypes') {
      transformedData = data.map(item => ({
        label: item.label,
        value: getWSRecordId(item),
      }));
    } else if (filterKey === 'savedSearches') {
      transformedData = data.map(item => ({
        label: item.name,
        value: item.internalId,
      }));
    } else if (filterKey === 'dateField') {
      // {fields: [{fieldId: 'tranDate', type: 'date', label: 'tranDate'}]}
      transformedData =
        (data.fields &&
          data.fields
            .filter(item => item.type === 'date')
            .map(item => ({
              label: item.label || item.fieldId,
              value: item.fieldId,
            }))) ||
        [];
    } else if (filterKey === 'booleanField') {
      // {fields: [{fieldId: 'field', type: '_checkbox', label: 'Field'}]}
      transformedData =
        (data.fields &&
          data.fields
            .filter(
              item =>
                item.type === '_checkBox' &&
                item.fieldId.match(
                  /^(custevent|custentity|custbody|custitem)\w*$/
                ) &&
                item.fieldId.indexOf('.') === -1
            )
            .map(item => ({
              label: item.label || item.fieldId,
              value: item.fieldId,
            }))) ||
        [];
    }
  } else if (mode === 'suitescript') {
    if (metadataType === 'recordTypes') {
      // {id: "account",name: "Account",
      // permissionId: "LIST_ACCOUNT",scriptId: "account",
      // scriptable: true,url: "/app/accounting/account/account.nl",
      // userPermission: "4"}
      transformedData = data.map(item => ({
        label: item.name,
        // value: isFieldMetadata
        //   ? item.id
        //   : item.scriptId && item.scriptId.toLowerCase(),
        value: item.id || (item.scriptId && item.scriptId.toLowerCase()),
      }));
    } else if (metadataType === 'savedSearches') {
      // {id: "2615", name: "1mb data"}
      transformedData = data.map(item => ({
        label: item.name,
        value: item.id,
      }));
    }
    // TODO
    else if (metadataType.includes('sublists')) {
      transformedData = data.map(item => ({
        label: item.name,
        value: item.id,
      }));
    } else if (filterKey === 'dateField') {
      transformedData = data
        .filter(item => item.type === 'datetime' || item.type === 'datetimetz')
        .map(item => ({ label: item.name, value: item.id }));
    } else if (filterKey === 'booleanField') {
      transformedData = data
        .filter(
          item =>
            item.type === 'checkbox' &&
            item.id.match(
              /^(custevent|custentity|custbody|custrecord|custitem)\w*$/
            ) &&
            item.id.indexOf('.') === -1
        )
        .map(item => ({ label: item.name, value: item.id }));
    } else if (filterKey === 'searchColumns') {
      transformedData = data.map(item => ({
        label: item.name,
        value: item.id,
      }));
    } else {
      transformedData = data.map(item => ({
        label: item.name,
        value: item.id,
      }));
    }
  }

  return { data: transformedData, status, errorMessage };
};

export const optionsMapFromMetadata = (
  state,
  connectionId,
  applicationType,
  recordType,
  selectField,
  optionsMap
) => {
  let options;

  if (applicationType === 'netsuite') {
    options =
      optionsFromMetadata(
        state,
        connectionId,
        applicationType,
        'recordTypes',
        'suitescript',
        recordType,
        selectField
      ) || {};
  } else {
    options =
      optionsFromMetadata(
        state,
        connectionId,
        applicationType,
        'sObjectTypes',
        null,
        recordType,
        selectField
      ) || {};
  }

  return {
    isLoading: options.status === 'requested',
    shouldReset: options.status === 'received',
    data: {
      optionsMap: [
        { ...optionsMap[0] },
        Object.assign({}, optionsMap[1], {
          options: options.data || optionsMap[1].options || [],
        }),
      ],
    },
  };
};

export function assistantData(state, { adaptorType, assistant }) {
  if (
    !state ||
    !state.assistants ||
    !state.assistants[adaptorType] ||
    !state.assistants[adaptorType][assistant]
  ) {
    return undefined;
  }

  return { ...state.assistants[adaptorType][assistant] };
}
