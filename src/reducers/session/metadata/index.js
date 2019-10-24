import produce from 'immer';
import actionTypes from '../../../actions/types';

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

function generateNetsuiteOptions(
  data,
  metadataType,
  mode,
  filterKey,
  isFieldMetadata,
  recordType,
  selectField
) {
  let options = null;

  if (mode === 'webservices') {
    if (metadataType === 'recordTypes') {
      // {"internalId":"Account","label":"Account"}
      options = data.map(item => ({
        label: item.label,
        value: item.internalId && item.internalId.toLowerCase(),
      }));
    } else if (filterKey === 'savedSearches') {
      // {internalId: "794", name: "New Account Search",
      // scriptId: "customsearch794"}
      options = data.map(item => ({
        label: item.name,
        value: item.internalId,
      }));
    } else if (filterKey === 'dateField') {
      // {fields: [{fieldId: 'tranDate', type: 'date', label: 'tranDate'}]}
      options =
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
      options =
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
      options = data.map(item => ({
        label: item.name,
        value: isFieldMetadata
          ? item.id
          : item.scriptId && item.scriptId.toLowerCase(),
      }));
    } else if (metadataType === 'savedSearches') {
      // {id: "2615", name: "1mb data"}
      options = data.map(item => ({ label: item.name, value: item.id }));
    } else if (metadataType.includes('sublists')) {
      options = data.map(item => ({ label: item.name, value: item.id }));
    } else if (filterKey === 'dateField') {
      options = data
        .filter(item => item.type === 'datetime' || item.type === 'datetimetz')
        .map(item => ({ label: item.name, value: item.id }));
    } else if (filterKey === 'booleanField') {
      options = data
        .filter(
          item =>
            item.type === 'checkbox' &&
            item.id.match(
              /^(custevent|custentity|custbody|custrecord|custitem)\w*$/
            ) &&
            item.id.indexOf('.') === -1
        )
        .map(item => ({ label: item.name, value: item.id }));
    } else if (recordType && selectField) {
      options = data.map(item => ({ label: item.name, value: item.id }));
    } else if (filterKey === 'searchColumns') {
      options = data.map(item => ({ label: item.name, value: item.id }));
    }
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
    metadataType,
    mode,
    filterKey,
    recordType,
    selectField,
  } = action;
  const key = filterKey ? `${metadataType}-${filterKey}` : metadataType;
  let newState;

  switch (type) {
    case actionTypes.METADATA.NETSUITE_REQUEST: {
      newState = { ...state.netsuite };
      newState[mode] = { ...state.netsuite[mode] };
      const specificMode = newState[mode];

      // Creates Object with status as 'requested' incase of New Request
      specificMode[connectionId] = {
        ...specificMode[connectionId],
        [key]: { status: 'requested' },
      };

      if (recordType && selectField) {
        specificMode[connectionId] = {
          ...specificMode[connectionId],
        };

        if (!specificMode[connectionId][recordType]) {
          specificMode[connectionId][recordType] = {};
        }

        if (!specificMode[connectionId][recordType][selectField]) {
          specificMode[connectionId][recordType][selectField] = {};
        }

        specificMode[connectionId][recordType][selectField] = {
          ...specificMode[connectionId][recordType][selectField],
          [key]: { status: 'requested' },
        };
      }

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

    case actionTypes.METADATA.REFRESH: {
      newState = { ...state.netsuite };
      newState[mode] = { ...state.netsuite[mode] };
      const specificMode = newState[mode];

      // Updates Object with status as 'requested' incase of Refresh Request
      if (selectField && recordType) {
        if (
          specificMode[connectionId] &&
          specificMode[connectionId][recordType] &&
          specificMode[connectionId][recordType][selectField] &&
          specificMode[connectionId][recordType][selectField][key] &&
          specificMode[connectionId][recordType][selectField][key].status
        ) {
          specificMode[connectionId][recordType][selectField][key].status =
            'refreshed';
        }
      } else if (
        specificMode[connectionId] &&
        specificMode[connectionId][key] &&
        specificMode[connectionId][key].status
      ) {
        specificMode[connectionId][key].status = 'refreshed';
      }

      return { ...state, ...{ netsuite: newState } };
    }

    // This is quiet a deep object...ensuring i am creating
    // new instances all the way to the children of the object.
    // This is to ensure that a react component listening
    // to just the root of the object realizes they are updates to
    // the children and subsequently rerenders.
    case actionTypes.METADATA.RECEIVED_NETSUITE: {
      newState = { ...state.netsuite };
      newState[mode] = { ...state.netsuite[mode] };
      const specificMode = newState[mode];
      const options = generateNetsuiteOptions(
        metadata,
        metadataType,
        mode,
        filterKey,
        !!(selectField || recordType),
        recordType,
        selectField
      );

      if (recordType && selectField) {
        if (!specificMode[connectionId][recordType]) {
          specificMode[connectionId][recordType] = {};
        }

        specificMode[connectionId][recordType][selectField] = {
          ...specificMode[connectionId][recordType][selectField],
          [key]: { status: 'received', data: options },
        };
      } else {
        specificMode[connectionId] = {
          ...specificMode[connectionId],
          [key]: { status: 'received', data: options },
        };
      }

      return { ...state, ...{ netsuite: newState } };
    }

    case actionTypes.METADATA.RECEIVED_SALESFORCE: {
      newState = { ...state.salesforce };
      const options = generateSalesforceOptions(
        metadata,
        recordType,
        selectField
      );

      if (recordType) {
        newState[connectionId] = {
          ...newState[connectionId],
          [recordType]: { status: 'received', data: options },
        };
      } else {
        newState[connectionId] = {
          ...newState[connectionId],
          [key]: { status: 'received', data: options },
        };
      }

      return { ...state, ...{ salesforce: newState } };
    }

    // Error handler
    case actionTypes.METADATA.RECEIVED_NETSUITE_ERROR: {
      newState = { ...state.netsuite };
      newState[mode] = { ...state.netsuite[mode] };
      const specificMode = newState[mode];
      const defaultError = 'Error occured';

      if (selectField && recordType) {
        if (
          specificMode[connectionId] &&
          specificMode[connectionId][recordType] &&
          specificMode[connectionId][recordType][selectField] &&
          specificMode[connectionId][recordType][selectField][key] &&
          specificMode[connectionId][recordType][selectField][key].status ===
            'refreshed'
        ) {
          specificMode[connectionId][recordType][selectField][key].status =
            'error';
          specificMode[connectionId][recordType][selectField][
            key
          ].errorMessage = metadataError || defaultError;
        } else {
          specificMode[connectionId][recordType][selectField] = {
            ...specificMode[connectionId][recordType][selectField],
            [key]: {
              status: 'error',
              data: [],
              errorMessage: metadataError || defaultError,
            },
          };
        }
      } else if (
        specificMode[connectionId] &&
        specificMode[connectionId][key] &&
        specificMode[connectionId][key].status === 'refreshed'
      ) {
        specificMode[connectionId][key].status = 'error';
        specificMode[connectionId][key].errorMessage =
          metadataError || defaultError;
      } else {
        specificMode[connectionId] = {
          ...specificMode[connectionId],
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

      if (selectField && recordType) {
        if (
          newState[connectionId] &&
          newState[connectionId][recordType] &&
          newState[connectionId][recordType].status === 'refreshed'
        ) {
          newState[connectionId][recordType].status = 'error';
          newState[connectionId][recordType].errorMessage =
            metadataError || defaultError;
        } else {
          newState[connectionId] = {
            ...newState[connectionId],
            [recordType]: {
              status: 'error',
              data: [],
              errorMessage: metadataError || defaultError,
            },
          };
        }
      } else if (
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

export const optionsFromMetadata = (
  state,
  connectionId,
  applicationType,
  metadataType,
  mode,
  recordType,
  selectField
) => {
  const applicationResource = (state && state[applicationType]) || null;

  if (applicationType === 'netsuite') {
    return recordType && selectField
      ? (applicationResource &&
          applicationResource[mode] &&
          applicationResource[mode][connectionId] &&
          applicationResource[mode][connectionId][recordType] &&
          applicationResource[mode][connectionId][recordType][selectField] &&
          applicationResource[mode][connectionId][recordType][selectField][
            metadataType
          ]) ||
          null
      : (applicationResource &&
          applicationResource[mode] &&
          applicationResource[mode][connectionId] &&
          applicationResource[mode][connectionId][metadataType]) ||
          null;
  }

  return recordType
    ? (applicationResource &&
        applicationResource[connectionId] &&
        applicationResource[connectionId][recordType]) ||
        null
    : (applicationResource &&
        applicationResource[connectionId] &&
        applicationResource[connectionId][metadataType]) ||
        null;
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
