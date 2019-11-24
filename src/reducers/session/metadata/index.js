import produce from 'immer';
import actionTypes from '../../../actions/types';
import metadataFilterMap from './metadataFilterMap';

export default (
  state = {
    application: {},
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

    case actionTypes.METADATA.ASSISTANT_PREVIEW_RECEIVED: {
      newState = { ...state };

      if (!newState.preview) {
        newState.preview = {};
      }

      newState.preview[resourceId] = previewData;

      return newState;
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

  const metaFilter = metadataFilterMap[filterKey || 'default'];
  const transformedData = metaFilter(data);

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

export function assistantPreviewData(state, { resourceId }) {
  if (!state || !state.preview) {
    return null;
  }

  return { ...state.preview[resourceId] };
}
