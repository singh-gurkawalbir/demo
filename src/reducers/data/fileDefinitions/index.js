import produce from 'immer';
import { sortBy } from 'lodash';
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
  // Sort based on Vendor and label for all formats
  const sortByKeys = ['vendor', 'label'];

  categorizedDefinitionMap.edi = sortBy(
    categorizedDefinitionMap.edi,
    sortByKeys
  );
  categorizedDefinitionMap.ediFact = sortBy(
    categorizedDefinitionMap.ediFact,
    sortByKeys
  );
  categorizedDefinitionMap.fixed = sortBy(
    categorizedDefinitionMap.fixed,
    sortByKeys
  );

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

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FILE_DEFINITIONS.PRE_BUILT.REQUEST: {
        draft.preBuiltFileDefinitions.status = 'requested';
        break;
      }

      case actionTypes.FILE_DEFINITIONS.PRE_BUILT.RECEIVED: {
        draft.preBuiltFileDefinitions.status = 'received';
        draft.preBuiltFileDefinitions.data = generateFileDefinitionOptions(
          fileDefinitions || {}
        );
        break;
      }

      case actionTypes.FILE_DEFINITIONS.DEFINITION.PRE_BUILT.RECEIVED: {
        draft.preBuiltFileDefinitions.data[format] = addDefinition(
          draft.preBuiltFileDefinitions.data[format],
          definitionId,
          definition
        );
        break;
      }

      case actionTypes.FILE_DEFINITIONS.PRE_BUILT.RECEIVED_ERROR: {
        draft.preBuiltFileDefinitions.status = 'error';
        draft.preBuiltFileDefinitions.errorMessage = error;
        break;
      }

      default:
    }
  });
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
