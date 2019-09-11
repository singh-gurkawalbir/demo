import { SEARCH_PARAMETER_TYPES } from '../../../../../../utils/assistant';

export default {
  'assistantMetadata.version': {
    type: 'assistantoptions',
    assistantFieldType: 'version',
    label: 'API Version',
    required: true,
  },
  'assistantMetadata.resource': {
    type: 'assistantoptions',
    assistantFieldType: 'resource',
    label: 'API Name',
    required: true,
  },
  'assistantMetadata.operation': {
    type: 'assistantoptions',
    assistantFieldType: 'operation',
    label: 'Operation',
    required: true,
  },
  'assistantMetadata.exportType': {
    type: 'assistantoptions',
    assistantFieldType: 'exportType',
    label: 'Export Type',
    required: true,
  },
  'assistantMetadata.queryParams': {
    type: 'assistantsearchparams',
    paramsType: SEARCH_PARAMETER_TYPES.QUERY,
  },
  'assistantMetadata.bodyParams': {
    type: 'assistantsearchparams',
    paramsType: SEARCH_PARAMETER_TYPES.BODY,
  },
};
