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

export const NETSUITE_SUITEAPP_URL =
  '/suiteapp/ui/marketplace.nl?whence=#/app?id=com.celigo.integratorio';

export const PASSWORD_MASK = '******';

export const MAX_MOCK_DATA_SIZE = 1024 * 1024; /* 1 MB */
export const MAX_TEMPLATE_ZIP_SIZE = 1024 * 1024; /* 1 MB */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; /* 10 MB */
export const MAX_DATA_LOADER_FILE_SIZE = 100 * 1024 * 1024; /* 100 MB */
export const EMPTY_RAW_DATA = 'EMPTY RAW DATA';

export const ALLOWED_HTML_TAGS =
  ['p', 'pre', 's', 'b', 'a', 'small', 'i', 'font', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'br', 'big', 'center', 'del', 'em', 'strong', 'sub', 'sup', 'table', 'td', 'tr', 'th', 'tt', 'title'];
export const LICENSE_TRIAL_ISSUED_MESSAGE = 'Congratulations! Your trial of unlimited flows starts now - what will you integrate next?';
export const LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE = 'Your request has been received. We will contact you soon.';
export const REQUEST_UPGRADE_SUCCESS_MESSAGE = 'Your request to upgrade has been sent. Keep an eye out for an email from one of our associates soon.';
export const LICENSE_REACTIVATED_MESSAGE = 'Reactivation successful.';
export const AUTH_FAILURE_MESSAGE = 'Authentication Failure';
export const SIGN_UP_SUCCESS = 'Account successfully created. Please check your inbox for an account activation link.';
export const RESET_PASSWORD_SUCCESS = 'Reset successful! Please sign in.';
export const CHANGE_EMAIL_SUCCESS = 'invited successfully';
export const ACTIVE_SESSION_MESSAGE = 'You already have an active session running. Please signout from the account and try again.';
export const PASSWORD_STRENGTH_ERROR = 'Password should be minimum 8 letter , with at least a symbol, upper and lower case letters and a number';
export const NO_RESULT_SEARCH_MESSAGE = 'Your search didn’t return any matching results. Try expanding your search criteria.';

export const POLLING_STATUS = Object.freeze({
  SLOW: 'slow down polling',
  RESUME: 'resume polling',
  STOP: 'stop polling',
});
export const MFA_RESET_ASYNC_KEY = 'MFA_RESET_ASYNC_KEY';
export const MFA_OWNER_RESET_ASYNC_KEY = 'MFA_OWNER_RESET_ASYNC_KEY';
export const MFA_SETUP_ASYNC_KEY = 'MFA_SETUP_ASYNC_KEY';
export const MFA_ACCOUNT_SETTINGS_ASYNC_KEY = 'MFA_ACCOUNT_SETTINGS_ASYNC_KEY';
export const MFA_DELETE_DEVICE_ASYNC_KEY = 'MFA_DELETE_DEVICE_ASYNC_KEY';

export const TEMPLATE_ZIP_UPLOAD_ASYNC_KEY = 'TEMPLATE_ZIP_UPLOAD_ASYNC_KEY';

export const ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY = 'ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY';
export const MAX_DATA_RETENTION_PERIOD = 180;
export const MAX_BRANCHES = 25;
