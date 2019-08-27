import actionTypes from '../../../actions/types';

function generateNetsuiteOptions(
  data,
  metadataType,
  mode,
  filterKey,
  isFieldMetadata = false
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
    }
  }

  return options;
}

export default (
  state = { netsuite: { webservices: {}, suitescript: {} }, salesforce: {} },
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
    case actionTypes.METADATA.REQUEST: {
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

        // jsonpatch.applyPatch(connectionResource.merged, patchSet).newDocument;
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
        !!(selectField && recordType)
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

    // Error handler
    case actionTypes.METADATA.RECEIVED_ERROR: {
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

  return (
    (applicationResource &&
      applicationResource[connectionId] &&
      applicationResource[connectionId][metadataType]) ||
    null
  );
};

export const optionsMapFromMetadata = (
  state,
  connectionId,
  applicationType,
  recordType,
  selectField,
  optionsMap
) => {
  const options =
    optionsFromMetadata(
      state,
      connectionId,
      applicationType,
      'recordTypes',
      'suitescript',
      recordType,
      selectField
    ) || {};

  return {
    isLoading: options.status === 'requested',
    shouldReset: options.status === 'received',
    data: {
      optionsMap: [
        optionsMap[0],
        Object.assign({}, optionsMap[1], {
          options: options.data || optionsMap[1].options,
        }),
      ],
    },
  };
};
