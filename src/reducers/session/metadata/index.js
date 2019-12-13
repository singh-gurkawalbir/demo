import produce from 'immer';
import actionTypes from '../../../actions/types';
import metadataFilterMap from './metadataFilterMap';

export default (
  state = {
    application: {},
    preview: {},
    assistants: { rest: {}, http: {} },
  },
  action
) => {
  const {
    type,
    metadata,
    metadataError,
    connectionId,
    commMetaPath,
    previewData,
    resourceId,
  } = action;
  const key = commMetaPath;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.METADATA.REQUEST:
        if (!draft.application[connectionId]) {
          draft.application[connectionId] = {};
        }

        draft.application[connectionId][key] = { status: 'requested' };
        break;
      case actionTypes.METADATA.ASSISTANT_PREVIEW_REQUESTED:
        if (!draft.preview[resourceId]) {
          draft.preview[resourceId] = {};
        }

        draft.preview[resourceId].status = 'requested';
        break;
      case actionTypes.METADATA.ASSISTANT_PREVIEW_RECEIVED:
        draft.preview[resourceId].status = 'received';
        draft.preview[resourceId].data = previewData;
        break;
      case actionTypes.METADATA.ASSISTANT_PREVIEW_RESET:
        delete draft.preview[resourceId];
        break;
      case actionTypes.METADATA.REFRESH:
        if (
          draft.application[connectionId] &&
          draft.application[connectionId][key] &&
          draft.application[connectionId][key].status
        ) {
          draft.application[connectionId][key].status = 'refreshed';
        }

        break;

      // This is quiet a deep object...ensuring i am creating
      // new instances all the way to the children of the object.
      // This is to ensure that a react component listening
      // to just the root of the object realizes they are updates to
      // the children and subsequently re-renders.
      case actionTypes.METADATA.RECEIVED: {
        let changeIdentifier = 1;

        if (!draft.application[connectionId]) {
          draft.application[connectionId] = {};
        } else if (
          draft.application[connectionId] &&
          draft.application[connectionId][key] &&
          draft.application[connectionId][key].changeIdentifier
        ) {
          changeIdentifier =
            draft.application[connectionId][key].changeIdentifier + 1;
        }

        draft.application[connectionId][key] = {
          status: 'received',
          data: metadata,
          changeIdentifier,
        };
        break;
      }

      // Error handler

      case actionTypes.METADATA.RECEIVED_ERROR: {
        const defaultError = 'Error occured';

        if (
          draft.application[connectionId] &&
          draft.application[connectionId][key] &&
          draft.application[connectionId][key].status === 'refreshed'
        ) {
          draft.application[connectionId][key].status = 'error';
          draft.application[connectionId][key].errorMessage =
            metadataError || defaultError;
        } else {
          draft.application[connectionId][key] = {
            status: 'error',
            data: [],
            errorMessage: metadataError || defaultError,
          };
        }

        break;
      }

      case actionTypes.METADATA.ASSISTANT_RECEIVED: {
        const { adaptorType, assistant, metadata } = action;

        if (draft.assistants[adaptorType]) {
          draft.assistants[adaptorType][assistant] = metadata;
        }

        break;
      }

      default:
    }
  });
};

export const optionsFromMetadata = ({
  state,
  connectionId,
  commMetaPath,
  filterKey,
}) => {
  const applicationResource = (state && state.application) || null;
  const path = commMetaPath;
  const { status, data, errorMessage, changeIdentifier } =
    (applicationResource &&
      applicationResource[connectionId] &&
      applicationResource[connectionId][path]) ||
    {};

  if (!data) {
    return { status, data, errorMessage };
  }

  const metaFilter = metadataFilterMap[filterKey || 'default'];
  const transformedData = metaFilter(data, {
    applicationResource,
    connectionId,
  });

  return { data: transformedData, status, errorMessage, changeIdentifier };
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

export function assistantPreviewData(state, resourceId) {
  if (!state || !state.preview) {
    return null;
  }

  return state.preview[resourceId];
}
