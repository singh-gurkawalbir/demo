import produce from 'immer';
import actionTypes from '../../../actions/types';
import { stringCompare } from '../../../utils/sort';

const emptyObj = {};
const addSubHeaderElement = (acc, curr) => {
  if (acc.length === 0) {
    acc.push(...[{ subHeader: curr.vendor }, curr]);
  } else if (
    acc[acc.length - 1].vendor &&
    acc[acc.length - 1].vendor !== curr.vendor
  ) acc.push(...[{ subHeader: curr.vendor }, curr]);
  else acc.push(curr);

  return acc;
};

export function _generateFileDefinitionOptions({ definitions }) {
  if (!definitions || !definitions.length) return emptyObj;
  const categorizedDefinitionMap = {};
  const definitionOptions = definitions.map(({ name, _id, ...rest }) => ({
    ...rest,
    label: name,
    value: _id,
  }));
  // Sort based on Vendor and label for all formats
  const sortByKeys = ['vendor', 'label'];

  categorizedDefinitionMap.edi = definitionOptions
    .filter(definition => ['delimited/x12', 'delimited'].includes(definition.format))
    .sort(stringCompare(sortByKeys))
    .reduce(addSubHeaderElement, []);

  categorizedDefinitionMap.ediFact = definitionOptions
    .filter(definition => definition.format === 'delimited/edifact')
    .sort(stringCompare(sortByKeys))
    .reduce(addSubHeaderElement, []);

  categorizedDefinitionMap.fixed = definitionOptions
    .filter(definition => definition.format === 'fixed')
    .sort(stringCompare(sortByKeys))
    .reduce(addSubHeaderElement, []);

  return categorizedDefinitionMap;
}

export function _addDefinition(definitions, definitionId, definition) {
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
        draft.preBuiltFileDefinitions.data = _generateFileDefinitionOptions(
          fileDefinitions || {}
        );
        break;
      }

      case actionTypes.FILE_DEFINITIONS.DEFINITION.PRE_BUILT.RECEIVED: {
        draft.preBuiltFileDefinitions.data[format] = _addDefinition(
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

export const selectors = {};

selectors.preBuiltFileDefinitions = (state, format) => ({
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

selectors.fileDefinition = (state, definitionId, options = {}) => {
  const { format, resourceType } = options;

  if (!format || !definitionId || !resourceType) return;
  const definitions = state?.preBuiltFileDefinitions?.data?.[format] || [];
  const definition = definitions.find(def => def.value === definitionId);
  const { generate, parse } = definition?.template || {};

  // Exports use Parse rules and Imports use Generate rules
  return resourceType === 'exports' ? parse : generate;
};
