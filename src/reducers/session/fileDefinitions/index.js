import actionTypes from '../../../actions/types';

function generateFileDefinitionOptions({ definitions }) {
  if (!definitions || !definitions.length) return {};
  const categorizedDefinitionMap = {};
  const definitionOptions = definitions.map(({ name, _id, ...rest }) => ({
    ...rest,
    ...{ label: name, value: _id },
  }));

  definitionOptions.forEach(definition => {
    if (['delimited/x12', 'delimited'].includes(definition.format)) {
      categorizedDefinitionMap.edi = [
        ...(categorizedDefinitionMap.edi || []),
        definition,
      ];
    }

    if (definition.format === 'delimited/edifact') {
      categorizedDefinitionMap.ediFact = [
        ...(categorizedDefinitionMap.ediFact || []),
        definition,
      ];
    }

    if (definition.format === 'fixed') {
      categorizedDefinitionMap.fixed = [
        ...(categorizedDefinitionMap.fixed || []),
        definition,
      ];
    }
  });
  // TODO : Sort based on Vendor for all formats

  return categorizedDefinitionMap;
}

function addDefinition(definitions, definitionId, definition) {
  // Once finalized formats remove those conditions here and add default [] for formats

  if (!definitions || !definitions.length || !definitionId) return definitions;
  const definitionIndex = definitions.findIndex(
    def => def.value === definitionId
  );

  definitions.splice(definitionIndex, 1, {
    ...definitions[definitionIndex],
    ...{ template: definition },
  });

  return definitions;
}

export default (
  state = {
    supportedFileDefinitions: {},
    userSupportedFileDefinitions: {},
  },
  action
) => {
  const {
    type,
    fileDefinitions,
    format,
    definitionId,
    definition,
    metadataError,
  } = action;
  let newState;

  switch (type) {
    case actionTypes.FILE_DEFINITIONS.SUPPORTED.REQUEST: {
      newState = { ...state.supportedFileDefinitions };
      newState.status = 'requested';

      return { ...state, ...{ supportedFileDefinitions: newState } };
    }

    case actionTypes.FILE_DEFINITIONS.USER_SUPPORTED.REQUEST:
      newState = { ...state.userSupportedFileDefinitions };
      newState.status = 'requested';

      return { ...state, ...{ userSupportedFileDefinitions: newState } };

    case actionTypes.FILE_DEFINITIONS.SUPPORTED.RECEIVED: {
      newState = { ...state.supportedFileDefinitions };
      newState.status = 'received';
      newState.data = generateFileDefinitionOptions(fileDefinitions || {});

      return { ...state, ...{ supportedFileDefinitions: newState } };
    }

    case actionTypes.FILE_DEFINITIONS.USER_SUPPORTED.RECEIVED:
      newState = { ...state.userSupportedFileDefinitions };
      newState.status = 'received';
      newState.data = fileDefinitions || [];

      return { ...state, ...{ userSupportedFileDefinitions: newState } };

    case actionTypes.FILE_DEFINITIONS.DEFINITION.SUPPORTED.RECEIVED: {
      newState = { ...state.supportedFileDefinitions };
      newState.data = { ...state.supportedFileDefinitions.data };
      newState.data[format] = [...state.supportedFileDefinitions.data[format]];
      newState.data[format] = addDefinition(
        newState.data[format],
        definitionId,
        definition
      );

      return { ...state, ...{ supportedFileDefinitions: newState } };
    }

    case actionTypes.FILE_DEFINITIONS.DEFINITION.USER_SUPPORTED.RECEIVED: {
      newState = { ...state.userSupportedFileDefinitions };

      if (definitionId) {
        const definitionIndexToUpdate = newState.data.findIndex(
          def => def._id === definitionId
        );

        newState.data = [
          ...state.userSupportedFileDefinitions.data.slice(
            0,
            definitionIndexToUpdate
          ),
          definition,
          ...state.userSupportedFileDefinitions.data.slice(
            definitionIndexToUpdate + 1
          ),
        ];
      } else {
        newState.data = [
          ...state.userSupportedFileDefinitions.data,
          definition,
        ];
      }

      newState.status = 'received';

      return { ...state, ...{ userSupportedFileDefinitions: newState } };
    }

    // Error handlers for all the requested actions
    case actionTypes.FILE_DEFINITIONS.SUPPORTED.RECEIVED_ERROR: {
      newState = { ...state.supportedFileDefinitions };
      newState.status = 'error';
      newState.errorMessage = metadataError;

      return { ...state, ...{ supportedFileDefinitions: newState } };
    }

    case actionTypes.FILE_DEFINITIONS.USER_SUPPORTED.RECEIVED_ERROR:
      newState = { ...state.userSupportedFileDefinitions };
      newState.status = 'error';

      return { ...state, ...{ userSupportedFileDefinitions: newState } };
    default:
      return { ...state };
  }
};

export const getSupportedFileDefinitions = (state, format) => ({
  data:
    (state &&
      state.supportedFileDefinitions &&
      state.supportedFileDefinitions.data &&
      state.supportedFileDefinitions.data[format]) ||
    [],
  status:
    state &&
    state.supportedFileDefinitions &&
    state.supportedFileDefinitions.status,
});

export const getUserSupportedFileDefinitions = state => ({
  data:
    (state &&
      state.userSupportedFileDefinitions &&
      state.userSupportedFileDefinitions.data) ||
    [],
  status:
    state &&
    state.userSupportedFileDefinitions &&
    state.userSupportedFileDefinitions.status,
});

const getDefinitionTemplate = (state, format, definitionId, resourceType) => {
  if (!format || !definitionId || !resourceType) return undefined;
  const definitions =
    state &&
    state.supportedFileDefinitions &&
    state.supportedFileDefinitions.data &&
    state.supportedFileDefinitions.data[format];
  const definition = (definitions || []).find(
    def => def.value === definitionId
  );
  const { generate, parse } = (definition && definition.template) || {};

  // Exports use Parse rules and Imports use Generate rules
  return resourceType === 'exports' ? parse : generate;
};

const getUserSupportedDefinition = (state, definitionId) => {
  if (!definitionId || !state.userSupportedFileDefinitions.data)
    return undefined;

  return state.userSupportedFileDefinitions.data.find(
    def => def._id === definitionId
  );
};

export const getFileDefinition = (state, definitionId, options) => {
  const { format, resourceType, type } = options;

  if (type === 'user') {
    return getUserSupportedDefinition(state, definitionId);
  }

  return getDefinitionTemplate(state, format, definitionId, resourceType);
};
