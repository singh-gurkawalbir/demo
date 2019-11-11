import produce from 'immer';
import actionTypes from '../../../actions/types';
import { getWSRecordId } from '../../../utils/metadata';

export default (
  state = {
    application: {},
    // salesforce: {},
    assistants: { rest: {}, http: {} },
  },
  action
) => {
  const { type, metadata, metadataError, connectionId, commMetaPath } = action;
  const key = commMetaPath;
  let newState;

  switch (type) {
    case actionTypes.METADATA.REQUEST: {
      newState = { ...state.application };

      newState[connectionId] = {
        ...newState[connectionId],
        [key]: { status: 'requested' },
      };

      return { ...state, ...{ application: newState } };
    }

    case actionTypes.METADATA.REFRESH: {
      newState = { ...state.application };

      if (
        newState[connectionId] &&
        newState[connectionId][key] &&
        newState[connectionId][key].status
      ) {
        newState[connectionId][key].status = 'refreshed';
      }

      return { ...state, ...{ application: newState } };
    }

    // This is quiet a deep object...ensuring i am creating
    // new instances all the way to the children of the object.
    // This is to ensure that a react component listening
    // to just the root of the object realizes they are updates to
    // the children and subsequently re-renders.
    case actionTypes.METADATA.RECEIVED: {
      newState = { ...state.application };
      newState[connectionId] = {
        ...newState[connectionId],
        [key]: { status: 'received', data: metadata },
      };

      return { ...state, ...{ application: newState } };
    }

    // Error handler

    case actionTypes.METADATA.RECEIVED_ERROR: {
      newState = { ...state.application };
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

      return { ...state, ...{ application: newState } };
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
  connectionId,
  commMetaPath,
  filterKey,
}) => {
  const applicationResource = (state && state.application) || null;
  const path = commMetaPath;
  const { status, data, errorMessage } =
    (applicationResource &&
      applicationResource[connectionId] &&
      applicationResource[connectionId][path]) ||
    {};

  if (!data) {
    return { status, data, errorMessage };
  }

  let transformedData = data;

  switch (filterKey) {
    case 'suitescript-recordTypes':
      transformedData = data.map(item => ({
        label: item.name,
        value: item.scriptId && item.scriptId.toLowerCase(),
      }));
      break;
    case 'suitescript-dateField':
      transformedData = data
        .filter(item => item.type === 'datetime' || item.type === 'datetimetz')
        .map(item => ({ label: item.name, value: item.id }));
      break;
    case 'suitescript-booleanField':
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
      break;
    case 'webservices-recordTypes':
      transformedData = data.map(item => ({
        label: item.label,
        value: getWSRecordId(item),
      }));
      break;

    case 'webservices-savedSearches':
      transformedData = data.map(item => ({
        label: item.name,
        value: item.internalId,
      }));
      break;
    case 'webservices-dateField':
      transformedData =
        (data.fields &&
          data.fields
            .filter(item => item.type === 'date')
            .map(item => ({
              label: item.label || item.fieldId,
              value: item.fieldId,
            }))) ||
        [];
      break;
    case 'webservices-booleanField':
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
      break;
    // case 'salesforce-recordType':
    //   transformedData = data.map(d => ({
    //     label: d.label,
    //     value: d.name,
    //     custom: d.custom,
    //     triggerable: d.triggerable,
    //   }));
    //   break;
    case 'salesforce-sObjects':
      transformedData = data.map(d => ({
        label: d.label,
        value: d.name,
        custom: d.custom,
        triggerable: d.triggerable,
      }));
      break;
    case 'salesforce-recordType':
      transformedData = data.fields.map(d => ({
        label: d.label,
        value: d.name,
        custom: d.custom,
        triggerable: d.triggerable,
        picklistValues: d.picklistValues,
        type: d.type,
      }));
      break;

    default:
      transformedData = data.map(item => ({
        label: item.name,
        value: item.id,
      }));
  }

  // if (filterKey)
  // if (mode === "webservices") {
  //   if (metadataType === "recordTypes") {
  //     transformedData = data.map(item => ({
  //       label: item.label,
  //       value: getWSRecordId(item)
  //     }));
  //   } else if (filterKey === "savedSearches") {
  //     transformedData = data.map(item => ({
  //       label: item.name,
  //       value: item.internalId
  //     }));
  //   } else if (filterKey === "dateField") {
  //     // {fields: [{fieldId: 'tranDate', type: 'date', label: 'tranDate'}]}
  //     transformedData =
  //       (data.fields &&
  //         data.fields
  //           .filter(item => item.type === "date")
  //           .map(item => ({
  //             label: item.label || item.fieldId,
  //             value: item.fieldId
  //           }))) ||
  //       [];
  //   } else if (filterKey === "booleanField") {
  //     // {fields: [{fieldId: 'field', type: '_checkbox', label: 'Field'}]}
  //     transformedData =
  //       (data.fields &&
  //         data.fields
  //           .filter(
  //             item =>
  //               item.type === "_checkBox" &&
  //               item.fieldId.match(
  //                 /^(custevent|custentity|custbody|custitem)\w*$/
  //               ) &&
  //               item.fieldId.indexOf(".") === -1
  //           )
  //           .map(item => ({
  //             label: item.label || item.fieldId,
  //             value: item.fieldId
  //           }))) ||
  //       [];
  //   }
  // } else if (mode === "suitescript") {
  //   if (metadataType === "recordTypes") {
  //     // {id: "account",name: "Account",
  //     // permissionId: "LIST_ACCOUNT",scriptId: "account",
  //     // scriptable: true,url: "/app/accounting/account/account.nl",
  //     // userPermission: "4"}
  //     transformedData = data.map(item => ({
  //       label: item.name,
  //       // value: isFieldMetadata
  //       //   ? item.id
  //       //   : item.scriptId && item.scriptId.toLowerCase(),
  //       value: item.id || (item.scriptId && item.scriptId.toLowerCase())
  //     }));
  //   } else if (metadataType === "savedSearches") {
  //     // {id: "2615", name: "1mb data"}
  //     transformedData = data.map(item => ({
  //       label: item.name,
  //       value: item.id
  //     }));
  //   }
  //   // TODO
  //   else if (metadataType.includes("sublists")) {
  //     transformedData = data.map(item => ({
  //       label: item.name,
  //       value: item.id
  //     }));
  //   } else if (filterKey === "dateField") {
  //     transformedData = data
  //       .filter(item => item.type === "datetime" || item.type === "datetimetz")
  //       .map(item => ({ label: item.name, value: item.id }));
  //   } else if (filterKey === "booleanField") {
  //     transformedData = data
  //       .filter(
  //         item =>
  //           item.type === "checkbox" &&
  //           item.id.match(
  //             /^(custevent|custentity|custbody|custrecord|custitem)\w*$/
  //           ) &&
  //           item.id.indexOf(".") === -1
  //       )
  //       .map(item => ({ label: item.name, value: item.id }));
  //   } else if (filterKey === "searchColumns") {
  //     transformedData = data.map(item => ({
  //       label: item.name,
  //       value: item.id
  //     }));
  //   } else {
  //     transformedData = data.map(item => ({
  //       label: item.name,
  //       value: item.id
  //     }));
  //   }
  // }

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
