import { SEARCH_PARAMETER_TYPES } from '../../../../../../utils/assistant';

export default {
  'assistantMetadata.version': {
    type: 'assistantoptions',
    assistantFieldType: 'version',
    label: 'API Version',
  },
  'assistantMetadata.resource': {
    type: 'assistantoptions',
    assistantFieldType: 'resource',
    label: 'API Name',
  },
  'assistantMetadata.operation': {
    type: 'assistantoptions',
    assistantFieldType: 'operation',
    label: 'Operation',
  },
  'assistantMetadata.exportType': {
    type: 'assistantoptions',
    assistantFieldType: 'exportType',
    label: 'Export Type',
  },
  'assistantMetadata.queryParams': {
    type: 'assistantsearchparams',
    paramsType: SEARCH_PARAMETER_TYPES.QUERY,
  },
};
