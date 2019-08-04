import actionTypes from '../../../actions/types';

function generateNetsuiteOptions(data, metadataType, mode, filterKey) {
  let options = null;

  if (mode === 'webservices') {
    if (metadataType === 'recordTypes') {
      // {"internalId":"Account","label":"Account"}
      options = data.map(item => ({
        label: item.label,
        value: item.internalId.toLowerCase(),
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
        value: item.scriptId.toLowerCase(),
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
    connectionId,
    metadataType,
    mode,
    filterKey,
  } = action;
  let newState;

  switch (type) {
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
        filterKey
      );
      let key = metadataType;

      if (filterKey) {
        key = `${key}-${filterKey}`;
      }

      specificMode[connectionId] = {
        ...specificMode[connectionId],
        [key]: options,
      };

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
  mode
) => {
  const applicationResource = (state && state[applicationType]) || null;

  if (applicationType === 'netsuite') {
    return (
      (applicationResource &&
        applicationResource[mode] &&
        applicationResource[mode][connectionId] &&
        applicationResource[mode][connectionId][metadataType]) ||
      null
    );
  }

  return (
    (applicationResource &&
      applicationResource[connectionId] &&
      applicationResource[connectionId][metadataType]) ||
    null
  );
};
