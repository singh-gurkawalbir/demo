export * from './integration';
export * from './resource';
export * from './resourceForm';
export * from './account';
export * from './suitescript';
export * from './jobs';
export * from './regex';
export * from './assistants';
export * from './urls';
export * from './flowbuilder';
export * from './analytics';

const PRODUCTION_CDN_BASE_URL = 'https://d2c59yixfx38rj.cloudfront.net/';
// eslint-disable-next-line no-undef
export const CDN_BASE_URL = CDN_BASE_URI || PRODUCTION_CDN_BASE_URL;
export const emptyList = Object.freeze([]);
export const emptyObject = Object.freeze({});

export const SALESFORCE_DA_PACKAGE_URL =
  'https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3m000000Y9kv';
export const NETSUITE_BUNDLE_URL =
  '/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV916910&domain=PRODUCTION&config=F&id=20038';

export const PASSWORD_MASK = '******';
export const MAX_FILE_SIZE = 10 * 1024 * 1024; /* 10 MB */
export const MAX_DATA_LOADER_FILE_SIZE = 100 * 1024 * 1024; /* 100 MB */
export const EMPTY_RAW_DATA = 'EMPTY RAW DATA';

export const ALLOWED_HTML_TAGS =
  ['p', 'pre', 's', 'b', 'a', 'small', 'i', 'font', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'br', 'big', 'center', 'del', 'em', 'strong', 'sub', 'sup', 'table', 'td', 'tr', 'th', 'tt', 'title'];
export const LICENSE_TRIAL_ISSUED_MESSAGE = 'Congratulations! Your trial of unlimited flows starts now - what will you integrate next?';
export const LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE = 'Your request has been received. We will contact you soon.';
export const LICENSE_REACTIVATED_MESSAGE = 'Reactivation successful.';
export const AUTH_FAILURE_MESSAGE = 'Authentication Failure';
export const NO_RESULT_SEARCH_MESSAGE = 'Your search didn’t return any matching results. Try expanding your search criteria.';

export const POLLING_STATUS = Object.freeze({
  SLOW: 'slow down polling',
  RESUME: 'resume polling',
  STOP: 'stop polling',
});
export const MFA_RESET_ASYNC_KEY = 'MFA_RESET_ASYNC_KEY';
export const MFA_SETUP_ASYNC_KEY = 'MFA_SETUP_ASYNC_KEY';
export const MFA_ACCOUNT_SETTINGS_ASYNC_KEY = 'MFA_ACCOUNT_SETTINGS_ASYNC_KEY';
export const MFA_DELETE_DEVICE_ASYNC_KEY = 'MFA_DELETE_DEVICE_ASYNC_KEY';

export const ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY = 'ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY';
export const MAX_DATA_RETENTION_PERIOD = 180;
