
export const SCRIPTS_IN_FLOW_RESOURCE = [
  'postResponseMap',
];
export const HOOKS_IN_IMPORT_EXPORT_RESOURCE = [
  // TODO CHECK for 'postResponseMap' if its present in import/export res
  // 'postResponseMap',
  'preSavePage',
  'preMap',
  'postMap',
  'postSubmit',
  'postAggregate',
  // 'transform',
  // 'filter',
];

export const SCRIPT_FUNCTION_TYPES = {
  PRE_SAVE_PAGE: 'preSavePage',
  PRE_MAP: 'preMap',
  POST_MAP: 'postMap',
  POST_SUBMIT: 'postSubmit',
  POST_AGGREGATE: 'postAggregate',
  POST_RESPONSE_MAP: 'postResponseMap',
  // TransformFilter
  FILTER: 'filter',
  TRANSFORM: 'transform',
  // Settings & Integration Form
  INIT_FORM: 'initForm',
  PRE_SAVE: 'preSave',
  UPDATE: 'update',
  STEP: 'step',
  INIT_CHILD: 'initChild',
  CHANGE_EDITION: 'changeEdition',
  // My API
  // HANDLE_REQUEST: 'handleRequest',
};
export const SCRIPT_FUNCTION_TYPES_FOR_FLOW = {
  PRE_SAVE_PAGE: 'preSavePage',
  PRE_MAP: 'preMap',
  POST_MAP: 'postMap',
  POST_SUBMIT: 'postSubmit',
  POST_AGGREGATE: 'postAggregate',
  POST_RESPONSE_MAP: 'postResponseMap',
  // TransformFilter
  FILTER: 'filter',
  TRANSFORM: 'transform',

  INIT_FORM: 'initForm',
  PRE_SAVE: 'preSave',
};

// Be cautious while changing the order of LOG_LEVELS. The same could effect their display order in UI
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};
