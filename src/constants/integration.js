export const STANDALONE_INTEGRATION = Object.freeze({
  id: 'none',
  name: 'Standalone flows',
});
export const INSTALL_STEP_TYPES = Object.freeze({
  CONNECTION: 'Connection',
  INSTALL_PACKAGE: 'installPackage',
  STACK: 'Stack',
  FORM: 'form',
  URL: 'url',
  MERGE: 'merge',
  REVERT: 'revert',
});
export const UNINSTALL_STEP_TYPES = Object.freeze({
  FORM: 'form',
  URL: 'url',
  HIDDEN: 'hidden',
});
export const INTEGRATION_MODES = Object.freeze({
  INSTALL: 'install',
  UNINSTALL: 'uninstall',
  SETTINGS: 'settings',
});
export const REVISION_TYPES = Object.freeze({
  PULL: 'pull',
  REVERT: 'revert',
  SNAPSHOT: 'snapshot',
});
export const REVISION_STATUS = Object.freeze({
  IN_PROGRESS: 'inprogress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELED: 'canceled',
});
export const REVISION_CREATION_STATUS = Object.freeze({
  CREATION_IN_PROGRESS: 'creating',
  CREATION_ERROR: 'create_error',
  CREATED: 'created',
});
export const INTEGRATION_DEPENDENT_RESOURCES = ['exports', 'imports', 'connections', 'flows', 'tree/metadata'];
export const TILE_STATUS = Object.freeze({
  IS_PENDING_SETUP: 'is_pending_setup',
  UNINSTALL: 'uninstall',
  HAS_OFFLINE_CONNECTIONS: 'has_offline_connections',
  HAS_ERRORS: 'has_errors',
  SUCCESS: 'success',
});
export const CLONING_SUPPORTED_IAS = ['sfnsio'];

