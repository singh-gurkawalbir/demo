import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';
import { COMM_STATES } from '../../comms/networkComms';
import metadataFilterMap from './metadataFilterMap';

const emptyObject = {};
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
    validationError,
    connectionId,
    commMetaPath,
    previewData,
    resourceId,
  } = action;
  const key = commMetaPath;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.METADATA.REQUEST:
      case actionTypes.METADATA.SET_REQUEST_STATUS:
        if (!draft.application[connectionId]) {
          draft.application[connectionId] = {};
        }
        if (!draft.application[connectionId][key]) {
          draft.application[connectionId][key] = {};
        }
        draft.application[connectionId][key].status = 'requested';
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

        // In some case we are calling sagas directly from another sagas. And it will not route through REQUEST reducer action
        if (!draft.application[connectionId]) {
          draft.application[connectionId] = {};
        }
        if (
          draft.application[connectionId][key] &&
            draft.application[connectionId][key].status === 'refreshed'
        ) {
          draft.application[connectionId][key].status = COMM_STATES.ERROR;
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

      case actionTypes.METADATA.VALIDATION_ERROR: {
        if (
          draft.application[connectionId] &&
            draft.application[connectionId][key] &&
            draft.application[connectionId][key].status === 'refreshed'
        ) {
          draft.application[connectionId][key].status = COMM_STATES.ERROR;
          draft.application[connectionId][
            key
          ].validationError = validationError;
        } else {
          draft.application[connectionId][key] = {
            status: COMM_STATES.ERROR,
            data: [],
            validationError,
          };
        }

        break;
      }
      case actionTypes.METADATA.ASSISTANT_PREVIEW_REQUESTED:
        if (!draft.preview[resourceId]) {
          draft.preview[resourceId] = {};
        }

        draft.preview[resourceId].status = 'requested';
        break;
      case actionTypes.METADATA.ASSISTANT_PREVIEW_FAILED:
        if (!draft.preview[resourceId]) {
          draft.preview[resourceId] = {};
        }

        draft.preview[resourceId].status = COMM_STATES.ERROR;
        break;
      case actionTypes.METADATA.ASSISTANT_PREVIEW_RECEIVED:
        if (!draft.preview[resourceId]) {
          draft.preview[resourceId] = {};
        }

        draft.preview[resourceId].status = 'received';
        draft.preview[resourceId].data = previewData;
        break;
      case actionTypes.METADATA.ASSISTANT_PREVIEW_RESET:
        delete draft.preview[resourceId];
        break;

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

const optionsFromMetadataTransformFunct = (
  applicationResource,
  connectionId,
  commMetaPath,
  filterKey,
) => {
  const path = commMetaPath;
  const { status, data, errorMessage, validationError, changeIdentifier } =
    (applicationResource &&
      applicationResource[connectionId] &&
      applicationResource[connectionId][path]) ||
    {};

  if (!data) {
    return { status, data, errorMessage, validationError };
  }

  const metaFilter = metadataFilterMap[filterKey || 'default'];
  const transformedData =
    data &&
    metaFilter(data, {
      applicationResource,
      connectionId,
      commMetaPath,
    });

  return {
    data: transformedData,
    status,
    errorMessage,
    validationError,
    changeIdentifier,
  };
};

// TODO: deprecate this function and use the makeOptionsFromMetadata
export const selectors = {};

selectors.makeOptionsFromMetadata = () => createSelector(
  state => state?.application,
  (_1, connectionId) => connectionId,
  (_1, _2, commMetaPath) => commMetaPath,
  (_1, _2, _3, filterKey) => filterKey,
  optionsFromMetadataTransformFunct
);
selectors.optionsFromMetadata = selectors.makeOptionsFromMetadata();

selectors.assistantData = (state, { adaptorType, assistant }) => {
  if (
    !state ||
    !state.assistants ||
    !state.assistants[adaptorType] ||
    !state.assistants[adaptorType][assistant]
  ) {
    return undefined;
  }

  return { ...state.assistants[adaptorType][assistant] };
};
// selectors.mkAssistantData = () => createSelector(
//   state => state?.assistants,
//   (_, options = emptyObject) => options.adaptorType,
//   (_, options = emptyObject) => options.assistant,
//   (assistants, adaptorType, assistant) => ({ ...assistants[adaptorType][assistant] })
// );
// selectors.assistantData = selectors.mkAssistantData();

selectors.assistantPreviewData = (state, resourceId) => {
  if (!state || !state.preview || !state.preview[resourceId]) {
    return emptyObject;
  }

  return state.preview[resourceId];
};
