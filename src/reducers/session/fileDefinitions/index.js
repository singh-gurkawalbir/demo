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
    userSupportedFileDefinitions: [],
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
      return { ...state };

    case actionTypes.FILE_DEFINITIONS.SUPPORTED.RECEIVED: {
      newState = { ...state.supportedFileDefinitions };
      newState.status = 'received';
      newState.data = generateFileDefinitionOptions(fileDefinitions || {});

      return { ...state, ...{ supportedFileDefinitions: newState } };
    }

    case actionTypes.FILE_DEFINITIONS.USER_SUPPORTED.RECEIVED:
      return { ...state };

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

    // Error handlers for all the requested actions
    case actionTypes.FILE_DEFINITIONS.SUPPORTED.RECEIVED_ERROR: {
      newState = { ...state.supportedFileDefinitions };
      newState.status = 'error';
      newState.errorMessage = metadataError;

      return { ...state, ...{ supportedFileDefinitions: newState } };
    }

    case actionTypes.FILE_DEFINITIONS.USER_SUPPORTED.RECEIVED_ERROR:
      return { ...state };
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

export const getDefinitionTemplate = (
  state,
  format,
  definitionId,
  resourceType
) => {
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
  return resourceType === 'exports'
    ? Object.assign({}, parse)
    : Object.assign({}, generate);
};

// export const getUserSupportedFileDefinitions = (state, id) => {
//   console.log('TODO', id);
// };
