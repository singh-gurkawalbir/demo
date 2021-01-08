
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
  HANDLE_REQUEST: 'handleRequest',
};

export const LOG_LEVELS = {
  ERROR: 'error',
  INFO: 'info',
  DEBUG: 'debug',
  WARN: 'warn',
};
