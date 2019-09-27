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
    preBuiltFileDefinitions: {},
    userDefinedFileDefinitions: {},
  },
  action
) => {
  const {
    type,
    fileDefinitions,
    format,
    definitionId,
    definition,
    error,
  } = action;
  let newState;

  switch (type) {
    case actionTypes.FILE_DEFINITIONS.PRE_BUILT.REQUEST: {
      newState = { ...state.preBuiltFileDefinitions };
      newState.status = 'requested';

      return { ...state, ...{ preBuiltFileDefinitions: newState } };
    }

    case actionTypes.FILE_DEFINITIONS.USER_DEFINED.REQUEST:
      newState = { ...state.userDefinedFileDefinitions };
      newState.status = 'requested';

      return { ...state, ...{ userDefinedFileDefinitions: newState } };

    case actionTypes.FILE_DEFINITIONS.PRE_BUILT.RECEIVED: {
      newState = { ...state.preBuiltFileDefinitions };
      newState.status = 'received';
      newState.data = generateFileDefinitionOptions(fileDefinitions || {});

      return { ...state, ...{ preBuiltFileDefinitions: newState } };
    }

    case actionTypes.FILE_DEFINITIONS.USER_DEFINED.RECEIVED:
      newState = { ...state.userDefinedFileDefinitions };
      newState.status = 'received';
      newState.data = fileDefinitions || [];

      return { ...state, ...{ userDefinedFileDefinitions: newState } };

    case actionTypes.FILE_DEFINITIONS.DEFINITION.PRE_BUILT.RECEIVED: {
      newState = { ...state.preBuiltFileDefinitions };
      newState.data = { ...state.preBuiltFileDefinitions.data };
      newState.data[format] = [...state.preBuiltFileDefinitions.data[format]];
      newState.data[format] = addDefinition(
        newState.data[format],
        definitionId,
        definition
      );

      return { ...state, ...{ preBuiltFileDefinitions: newState } };
    }

    case actionTypes.FILE_DEFINITIONS.DEFINITION.USER_DEFINED.RECEIVED: {
      newState = { ...state.userDefinedFileDefinitions };

      if (definitionId) {
        const definitionIndexToUpdate = newState.data.findIndex(
          def => def._id === definitionId
        );

        newState.data = [
          ...state.userDefinedFileDefinitions.data.slice(
            0,
            definitionIndexToUpdate
          ),
          definition,
          ...state.userDefinedFileDefinitions.data.slice(
            definitionIndexToUpdate + 1
          ),
        ];
      } else {
        newState.data = [...state.userDefinedFileDefinitions.data, definition];
      }

      newState.status = 'received';

      return { ...state, ...{ userDefinedFileDefinitions: newState } };
    }

    // Error handlers for all the requested actions
    case actionTypes.FILE_DEFINITIONS.PRE_BUILT.RECEIVED_ERROR: {
      newState = { ...state.preBuiltFileDefinitions };
      newState.status = 'error';
      newState.errorMessage = error;

      return { ...state, ...{ preBuiltFileDefinitions: newState } };
    }

    case actionTypes.FILE_DEFINITIONS.USER_DEFINED.RECEIVED_ERROR:
      newState = { ...state.userDefinedFileDefinitions };
      newState.status = 'error';
      newState.errorMessage = error;

      return { ...state, ...{ userDefinedFileDefinitions: newState } };
    default:
      return { ...state };
  }
};

export const getSupportedFileDefinitions = (state, format) => ({
  data:
    (state &&
      state.preBuiltFileDefinitions &&
      state.preBuiltFileDefinitions.data &&
      state.preBuiltFileDefinitions.data[format]) ||
    [],
  status:
    state &&
    state.preBuiltFileDefinitions &&
    state.preBuiltFileDefinitions.status,
});

export const getUserSupportedFileDefinitions = state => ({
  data:
    (state &&
      state.userDefinedFileDefinitions &&
      state.userDefinedFileDefinitions.data) ||
    [],
  status:
    state &&
    state.userDefinedFileDefinitions &&
    state.userDefinedFileDefinitions.status,
});

const getDefinitionTemplate = (state, format, definitionId, resourceType) => {
  if (!format || !definitionId || !resourceType) return undefined;
  const definitions =
    state &&
    state.preBuiltFileDefinitions &&
    state.preBuiltFileDefinitions.data &&
    state.preBuiltFileDefinitions.data[format];
  const definition = (definitions || []).find(
    def => def.value === definitionId
  );
  const { generate, parse } = (definition && definition.template) || {};

  // Exports use Parse rules and Imports use Generate rules
  return resourceType === 'exports' ? parse : generate;
};

const getUserDefinedDefinition = (state, definitionId) => {
  if (!definitionId || !state.userDefinedFileDefinitions.data) return undefined;

  return state.userDefinedFileDefinitions.data.find(
    def => def._id === definitionId
  );
};

export const getFileDefinition = (state, definitionId, options) => {
  const { format, resourceType, type } = options;

  if (type === 'user') {
    return getUserDefinedDefinition(state, definitionId);
  }

  return getDefinitionTemplate(state, format, definitionId, resourceType);
};
