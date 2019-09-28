import actionTypes from '../../../actions/types';

function generateFileDefinitionOptions({ definitions }) {
  if (!definitions || !definitions.length) return {};
  const categorizedDefinitionMap = {};
  const definitionOptions = definitions.map(({ name, _id, ...rest }) => ({
    ...rest,
    label: name,
    value: _id,
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

    case actionTypes.FILE_DEFINITIONS.PRE_BUILT.RECEIVED: {
      newState = { ...state.preBuiltFileDefinitions };
      newState.status = 'received';
      newState.data = generateFileDefinitionOptions(fileDefinitions || {});

      return { ...state, ...{ preBuiltFileDefinitions: newState } };
    }

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

    // Error handlers for all the requested actions
    case actionTypes.FILE_DEFINITIONS.PRE_BUILT.RECEIVED_ERROR: {
      newState = { ...state.preBuiltFileDefinitions };
      newState.status = 'error';
      newState.errorMessage = error;

      return { ...state, ...{ preBuiltFileDefinitions: newState } };
    }

    default:
      return { ...state };
  }
};

export const getPreBuiltFileDefinitions = (state, format) => ({
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

export const getFileDefinition = (state, definitionId, options) => {
  const { format, resourceType } = options;

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
