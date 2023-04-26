import { get } from 'lodash';
import { MFA_URL, MOCK_OUTPUT_CANONICAL_FORMAT_LINK, REVISIONS_GUIDE_URL } from '../constants';

const AGREE_TOS_AND_PP = 'Review and agree to the following terms of use to start using your integrator.io account, Celigo services, and products.';
const REQUIRED_MESSAGE = 'A value must be provided';
const INVALID_DATE = 'Invalid date format';
const REVERT_NOT_ALLOWED = 'Your revert is not allowed. Your operation is already on the same revision you\'re trying to revert to.';
const INSTALL_ZIP_FILE = 'Your installation will begin after choosing a zip file.';
const AUDIT_LOGS_HAS_MORE_DOWNLOADS = 'Your downloaded file has exceeded the limit of 20,000 records. To narrow the results, try again after limiting the events\' dates, resource type, source, and so on.';
const SURE_UNINSTALL = 'Are you sure you want to uninstall?';
const SEND_SAP_CONCUR_MODULE = 'Great news! Now you can send your SAP Concur {{module}} through Celigo integrator.io.';
const CONFIRM_CANCEL_RUN = 'You have unsaved changes that will be lost if you continue. Canceling this job will delete all associated data currently queued for processing.';
const NONE_TIER_USER_ERROR = 'Your username is not part of shared account access anymore. Please have the account owner invited you to this account.';
const NO_RESULT = 'You don\'t have any {{message}}.';
const DEFAULT_ERROR = 'No data to show - application responded with an error';
const FORM_PREVIEW = 'A preview of your settings form will appear once you add some valid form metadata or add an init hook.';
const CLEAR_HTTP_FIELDS = 'This will clear some of the http field values and populate them with the default values for the selected operation. Are you sure want to proceed?';
const NETSUITE_ASSISTANT_LAUNCH_ERROR = `Unable to load NetSuite Assistant for one of the following reasons=
• It is disabled in recent versions of Google Chrome, Firefox and Safari
• Newer NetSuite record types are not yet supported
We are currently working with NetSuite to resolve these problems.`;
const APP_CRASH = 'Oops! Something caused our app to crash. <br /> To resume working, please reload.';
const API_TOKENS_NOT_EXIST = 'No API tokens yet exist for this integration.';
const CHANGES_IN_RESOURCE = `The following changes have been made to this resource. We have
attempted to automatically merge these changes, but this resolution
was not successful. Please click the refresh button to refresh your
browser.`;
const CONNECTION_OFFLINE = 'The connection associated with this resource is currently offline and configuration is limited.';
const ROUTER_DELETE_CONFIRMATION_MESSAGE = `<p>Are you sure you want to delete this branching?</p>
  <p>In the first branch, all steps/branching routers will persist and become a linear flow.</p>
  <p>All other branches and all steps/branching routers inside
  ({{configuredCount}} configured steps, {{unconfiguredCount}} unconfigured steps) will be removed.</p>`;

const CONFIRM_REMOVE = 'Are you sure you want to remove this resource?';
const NO_DEBUG_LOG = 'You don’t have any debug log entries.';
const COMPONENT_INFO = 'The following components are created with this integration:';
const KEY_COLUMN_DEPRECATION = 'You’re using a deprecated option “Key Columns” to group your records. Use the new and improved option in the “How would you like to sort and group records” section. Your group settings may be affected when you use the new sorting and grouping option.';
const PREVIEW_FAILED = 'Failed to fetch preview data.';

const MARKETPLACE = {
  HELPINFO: 'Jump-start your integrations with our Quickstart integration templates. Explore new or install your existing licensed integration apps.',
  MULTIPLE_INSTALLS: 'Are you sure you want to install this integration app?  This integration app is already installed in your account.',
  ALREADY_TRIAL_LICENCE: 'Click <b>Request demo</b> to have someone contact you to learn more about your needs.',
  REQUEST_DEMO: 'Have a solutions consultant contact me to demonstrate how this Integration App will automate my business processes.',
  TRIAL_PLAN: 'Click <b>Start free trial</b> to start your free trial of {{connectorName}} Integration App.',
};
// region Resource
const RESOURCE = {
  NOT_USED: 'This resource is not being used anywhere',
  DELETED: `This {{resourceTypeLabel}}
                is referenced by the resources below. Only resources
                that have no references can be deleted.`,
};
// region DISCLAIMER

const DISCLAIMER = {
  DIY_INSTALL_DISCLAIMER: 'By default, all integration flows will be disabled when first installed; you must enable each flow that you want to run. You can modify, delete, or extend any of the resources in this integration, but  updates to the original integration will not affect this new copy. This integration has not been reviewed by Celigo. Make sure you trust the author before installing, and carefully review all components in the integration before proceeding.',
  CELIGO_AUTHORED_TEMPLATE_DISCLAIMER: 'By default, all integration flows will be disabled when first installed, you must enable each flow that you want to run. You can modify, delete, or extend any of the components in this template, but unlike Integration apps, updates to the master integration template will not be propagated to your account.',
  THIRD_PARTY_TEMPLATE_DISCLAIMER: 'By default, all integration flows will be disabled when first installed; you must enable each flow that you want to run. You can modify, delete, or extend any of the components in this template, but unlike Integration apps, updates to the master integration template will not be propagated to your account. This template has not been reviewed by Celigo. Make sure you trust the publisher before installing, and carefully review all components in the integration before proceeding.',
};

// end region
//
const CONNECTION = {
  PING_STATES_ERROR: 'Your test was not successful. Check your information and try again',
  CONFIRM_REPLACE_CONNECTION: 'Are you sure you want to replace the connection for this flow? Replacing a connection will cancel all jobs currently running.',
  FIX: ' Review and test this form to bring your connections back online.',
  NOT_FIXED: 'The connection is currently offline. Review and test this form to bring your connection back online.',
  OFFLINE_LIMITED: 'The connection associated with this export is currently offline and configuration is limited',
  SAVE_FAILED: 'Are you sure you want to save this connection? Test connection failed with the following error:',
};
//

// region INTEGRATIONs

const INTEGRATION = {
  DELETE_INTEGRATION: 'Are you sure you want to delete this integration?',
  INTEGRATION_DELETE_VALIDATE: 'All Flows within an integration tile must be removed before the integration tile can be deleted.',
  INTEGRATION_WITH_CONNECTORS_DELETE_VALIDATE: 'The integration is being actively used by an integration app. Please ensure no integration app resource is using the integration before deleting',
  CONTACT_OWNER: 'Contact your account owner to uninstall this integration app.',
  UNINSTALL_SELECT_STORE: 'To uninstall, please navigate to Admin → Uninstall inside the Integration App and select the desired store.',
  CLONE_DESCRIPTION: 'Cloning an integration enables you to keep an original integration unchanged while modifying the configuration settings for a duplicate version of it. <a href="https://docs.celigo.com/hc/en-us/articles/115000757512-Clone-integrations-and-flows" target="_blank">Learn more</a>',
  UNINSTALL_APP_CHILD: 'Complete the below steps to uninstall your integration app child {{childName}}',
  UNINSTALL: 'Complete the below steps to uninstall your integration app.',
  LEARN_PREMIUM: 'Learn more about integrator.io premium packages',

};
// end region
// region Transfers
const TRANSFERS = {
  TRANSFER_INTEGRATIONS: 'Transfer individual integrations between integrator.io accounts.Send integrations by specifying the email of the owner of the integrator.io account you want to send the integration to. The receiving account owner needs to accept the transfer. Once accepted, the integration will be removed from your account and instead reside in the receiver’s account. Note: the receiver needs to be an account owner and cannot be part of the same organization as the sender.',
  INFO_TRANSFERS: ' Important! As part of the transfer process, all your currently in-progress flows will be allowed to complete, and new flows will not be started. If there are any webhook based flows, then they will stop accepting new data until the transfer is complete. Once the in-progress flows have finished processing, all the flows will be transferred to the new user. Jobs and related retry data will not be transferred, and this information will be lost for any in-progress jobs that have errors. If you are concerned about this data loss then please first disable the flows manually, and then retry/resolve all open errors, and then initiate the transfer process again.',

};
// end region

const PLAYGROUND = {
  EXPLORE: 'Alternatively, use the Integration explorer to drill into your flows to find and manage your resources.',
  SELECT_EDITOR: 'Get started by selecting an editor example on the left.',
};

// region SIGN IN
const USER_SIGN_IN = {
  NEW_USER_IO: 'If you are a new user and do not have an integrator.io account, click ',
  CHANGE_PASSWORD_INFO: 'Please note that clicking \'Change Password\' will sign you out of the application, and you will need to sign back in with your new password.',
  FORGOT_PASSWORD_DEFAULT: 'Enter your email address and we will send you a link to reset your password.',
  FORGOT_PASSWORD_USER_EXIST: 'If {{email}} exists in our system, you will receive a password recovery email soon.',
  RESET_PASSWORD_CONCUR: 'Please note that after you reset your password, you have to go back to the Concur App Center and connect again to the Celigo app.',
  WANT_TO_LEAVE_ACCOUNT: 'Are you sure you want to leave this account? You will no longer have access to the account after you leave.',
  SESSION_ABOUT_TO_EXPIRE: 'Your session is about to expire. Do you want to stay signed in?',
  INVITE: 'Please accept or decline this invitation.',
  SESSION_EXPIRED: 'For your security, we automatically sign you out after more than an hour of inactivity. Sign in again to resume your session.',
  CACHED: 'It looks like your browser has cached an older version of our app.Click \'Reload\' to refresh the page.',
  OWNER_ACCOUNT: 'You are now the owner of this account. Go to <em>My account &gt; Users</em> to invite and manage permissions for other users in this account.',
  SIGNIN_FAILED: 'Sign in failed. Please try again.',
  SIGNIN_REQUIRED: '{{label}} is required.',
  INVALID_FIRST_LAST_NAME: 'Please enter your first and last name.',
  INVALID_EMAIL: 'Please enter a valid email address',
};
// end region

// region FLOW BUILDER BRANCHES
const FLOWBUILDER = {
  DATALOADER_PP_MESSAGE: 'You can add a destination application once you complete the configuration of your data loader.',
  MAX_ROUTERS_LIMIT_REACHED: 'You have reached the maximum of 25 branchings in a flow',
  TERMINAL_NODE_TOOLTIP: 'Drag to merge with other branch',
  MERGE_NODE_TOOLTIP: 'Merge point (records from branches are merged here)',
  TERMINAL_NODE_FROZEN_TOOLTIP: 'Merging to another branch is not possible here because your flow does not contain any branches or because there are no merge targets available. Add branching to your flow or modify your current flow layout to allow merging.',
  DATA_LOADER_HELP: 'You can add a destination application once you complete the configuration of your data loader.',
};
// end region

// region RETRY
const RETRY = {
  ERRORS_RETRIEVE: 'Errors can be retried from the Open errors and Resolved errors tabs.',
  RETRIES_TAB_INFO: 'When you retry errors in a flow step, a new row in the <b>Retries</b> tab under that step will display its progress. When a retry results in errors in later flow steps, you can locate the new errors in their <b>Open errors tab</b>. <br>Here you will also find auto-retry runs. When retries were triggered by auto-retry, a single row will appear for each retry job in the <b>Retries</b> tab and the column <b>Retry started by</b> will contain <b>Auto-retried</b>.',
  CANCEL_RETRY_CONFIRM: 'Cancelling will abort the retrying of any errors not yet processed in this operation; those errors already processed will not be reverted, maintaining their current state (failed or resolved).',
  RETRIES_TAB_ERRORS_UPDATED_INFO: 'Retries that were initated from previous steps in your flow cannot be shown on any subsequent steps whose errors/success were changed by the retries in a previous step.',
  INVALID_JSON: 'Your retry data is not a valid JSON object.',
};
// emd region

// region Purge
const PURGE = {
  ERROR_PURGE_CONFIRM_MESSAGE: 'Are you sure you want to purge the selected resolved error? This cannot be undone.',
  MULTIPLE_ERROR_PURGE_CONFIRM_MESSAGE: 'Are you sure you want to purge the selected resolved error(s)? This cannot be undone.',
  ERROR_PURGE_SUCCESS_MESSAGE: 'Error purged',
  MULTIPLE_ERROR_PURGE_SUCCESS_MESSAGE: 'Error(s) purged',
  FILE_PURGE_CONFIRM_MESSAGE: 'Are you sure you want to purge all files related to this run? This cannot be undone.',
  FILE_PURGE_SUCCESS_MESSAGE: 'All run files purged.',
  SCRIPT_LOG_CONFIRM_MESSAGE: 'Are you sure you want to purge all logs of this script? This cannot be undone.',
  SCRIPT_LOG_SUCCESS_MESSAGE: 'All logs of this script successfully purged.',
};
// end region

// #region ALIAS
const ALIAS = {
  PANEL_HELPINFO: 'An alias provides an easy way to reference a specific resource in your integration when you\'re building scripts. For example, instead of referring to a flow ID in a script, you can use an alias for that flow instead. This makes your script portable across environments and prevents you from having to manually change the referenced ID later. Use the Aliases tab to see all aliases that have been defined for this integration\'s flows, connections, imports, and exports. You can also create a new alias (top right), or use the Actions menu to edit, copy, delete, or view details for an alias. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.',
  DELETE_CONFIRM_MESSAGE: 'Are you sure you want to delete this alias? Deleting an alias does not remove any references to it. Errors will occur and scripts will fail if the alias is referenced.',
  MANAGE_ALIASES_HELPINFO: 'Use this page to see all of your aliases for this flow, as well as any integration-level aliases (inherited aliases). You can create a new alias for this flow (top right), or use the Actions menu to edit, copy, delete, or view details for a flow-level alias.  Inherited aliases are passed down to the flow from the integration. However, keep in mind that if you reference both a flow-level alias and an integration-level alias for a resource in a script, the flow-level alias will take precedence. Use the Actions menu for Inherited aliases to copy an alias or view its details. To create, edit, or delete one of these aliases, navigate to the integration instead and use the Alias tab. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.',
  VIEW_ALIASES_HELPINFO: 'View the list of aliases defined for your resources (flows, connections, export, and imports).',
  VIEW_DETAILS_HELPINFO: 'View information about the alias and the resource it references',
  COPIED_MESSAGE: 'Alias copied to clipboard.',
  SAVE_MESSAGE: 'You’ve successfully created an alias.',
  DELETE_MESSAGE: 'You’ve successfully deleted your alias.',
  EDIT_ALIAS_FORM_HELPINFO: 'Editing an alias is helpful when you\'ve built an improved flow or other resource and want all of the scripts that reference the alias to use the new resource. You can update any of the fields for an alias as needed, but keep in mind this may have implications on any scripts that currently reference the alias. <br><b>CAUTION:</b> *If you change the Alias ID (name), it is not updated in existing scripts. <br>*Only change the type and select a new resource matching that type only if you\'re certain this will not adversely impact any existing scripts that reference the alias. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.',
  CREATE_ALIAS_FORM_HELPINFO: 'An alias provides an easy way to reference a specific resource in your integration when you\'re building scripts. You can create aliases for flows, connections, imports, and exports.',
  NO_ALIAS_RESOURCE_MESSAGE: 'A value must be provided. Create a {{{label}}} if you don’t have any {{{resourceType}}} configured.',
  NO_ALIASES_MESSAGE: 'You don’t have any aliases.',
  NO_CUSTOM_ALIASES_MESSAGE: 'You don’t have any custom aliases.',
  NO_INHERITED_ALIASES_MESSAGE: 'You don’t have any inherited aliases.',
  DUPLICATE_ALIAS_ERROR_MESSAGE: 'An alias with the same ID already exists. Provide a different ID.',
  VALIDATION_ERROR_MESSAGE: 'Aliases can only contain alphanumeric, hyphen (-), or underscore (_) characters.',
};
// #endregion

// #Data retention messsages
const DATA_RETENTION = {
  TAB_INFO: 'If you’re an <a href="https://docs.celigo.com/hc/en-us/articles/115003929872" target="_blank">account owner or administrator</a>, you can <a href="https://docs.celigo.com/hc/en-us/articles/6359380074779" target="_blank">access your integrator.io data for 30 or more days</a>. The data retention period varies based on your Celigo license, which you can upgrade anytime. You can also delete these records. This functionality is compliant with <a href="https://www.celigo.com/security-privacy-compliance/" target="_blank">GDPR and CCPA rules.</a>',
  LICENSE_UPGRADE: '<b>More options available</b> - Upgrade your account for longer data retention periods. ',
  PERIOD_CHANGE_INFO: '<b><a href:"https=//docs.celigo.com/hc/en-us/articles/6359380074779-Access-data-for-more-than-30-days" target="_blank">Learn more about data retention</a></b> and consult with your security/privacy team before saving a new retention period.',
  PERIOD_UPDATE_CONFIRM: 'Changing the retention period will apply to new data only. Data retained before this retention period change will continue to expire based on the retention period defined at the time of retention.',
  PERIOD_UPDATED: 'New data retention period successfully saved.',
};
// #endregion

// #region mapper2 messages
const MAPPER2 = {
  DELETE_ROW_WARNING: 'Are you sure you want to delete this parent record row? All its child rows will be deleted as well.',
  DATA_TYPE_WARNING: `Since only an "object" or "[object]" data type can have child rows,
    all of this parent record row's child rows will be deleted when your selected data type is applied.
    <br><br>Are you sure you want to continue?`,
  MAPPER1_REFERENCE_INFO: 'Your 1.0 mappings are for reference only and will be ignored. Delete all 2.0 mappings to use 1.0 mappings instead.',
  BANNER_WARNING: 'Any 2.0 mappings that you enter will be applied when you click <b>Save</b>, even if you toggle back to Mapper 1.0. To apply 1.0 mappings instead, delete all mappings from Mapper 2.0 and click <b>Save</b>. <b><a target="_blank" rel="noreferrer" href="https://docs.celigo.com/hc/en-us/articles/4536629083035-Mapper-2-0"> Learn about Mapper 2.0</a></b>',
  DYNAMIC_LOOKUP_SOURCE_TOOLTIP: 'Dynamic lookups do not provide source field list',
  HARD_CODED_SOURCE_TOOLTIP: 'Hard-coded values do not provide source field list',
  HANDLEBARS_SOURCE_TOOLTIP: 'Handlebars expression do not provide source field list',
  AUTO_CREATE_STRUCTURE: 'Are you sure you want to auto-populate your destination fields?<br><b>This will replace all of your current destination fields and source fields.</b>',
  DUPLICATE_SOURCE_FIELD_VALUES: 'You cannot have duplicate source field values: {{duplicateKeys}}',
  ATLEAST_MAPPED_ONE_VALUE: 'You need to map at least one value.',
  FILTER_BY_MAPPED_FIELDS: 'Filtered by mapped fields (clear filter to enable editing)',
  FILTER_BY_REQUIRED_AND_MAPPED_FIELDS: 'Filtered by mapped fields and required fields (clear filter to enable editing)',
  FILTER_BY_REQUIRED_FIELDS: 'Filtered by required fields (clear filter to enable editing)',
  DISABLE_TAB: 'No matching fields in this tab',
  SHOULD_NOT_DISABLE_TAB: 'No fields need to be configured because this source has the setting "Copy an object array from the source as-is" set to "Yes".',
  FAILED_TO_LOAD_MAPPING: 'Failed to load mapping.',
  LEARN_MORE_MAPPER2: 'Click <b>Learn about Mapper 2.0</b> above for more info on auto-population.',
  AUTO_POPULATE_LEARN_MORE: 'Auto-populate is not available for this connector.<br><br>Click <b>Learn about Mapper 2.0</b> above for more info on auto-population.',
  CONTAINS_SUBRECORDS: 'This import contains subrecord imports, select which import you would like to edit the mapping for.',
};
// #endregion

// #region LCM
const LCM = {
  REVISION_IN_PROGRESS_ERROR: 'You have a pull, snapshot, or revert in progress.',
  NO_CLONE_FAMILY_TO_PULL_FROM_ERROR: `You don't have any data to pull. Learn more about <a target='_blank' href=${REVISIONS_GUIDE_URL}> cloning and pulling your integrations</>.`,
  PULL_MERGE_SUCCESS: 'You\'ve successfully merged your pull.',
  PULL_MERGE_ERROR: 'The merge of your pull was unsuccessful. Try your pull again.',
  REVERT_SUCCESS: 'You\'ve successfully reverted your changes.',
  REVERT_ERROR: 'Your revert was unsuccessful. Try reverting again.',
  SNAPSHOT_SUCCESS: 'You\'ve successfully created a snapshot.',
  CREATE_SNAPSHOT_FORM_HELPINFO: 'A snapshot is a saved capture of your integration that you can use to revert your integration at any point.',
  CREATE_PULL_FORM_HELPINFO: 'Pulling changes from one linked integration to another lets you see conflicts, review changes, and merge them from one integration to another. You can only pull data from a direct clone or source integration.. For example, clone Integration A as Integration B, then B to C, and B to D. You can create a pull between integrations A and B, B and C, B and D; but not between A and C, or C and D',

};
// #endregion

// # region FLOWS messages
const FLOWS = {
  INCOMPLETE_FLOW_TOOLTIP: 'Configure all steps to allow running your flow',
  INCOMPLETE_FLOW_SCHEDULE_TOOLTIP: 'Remove or configure all unconfigured flow steps to edit the flow schedule',
  NO_DRAG_FLOW_BRANCHING_INFO: 'You cannot reorder steps in a branched flow.<br/>Remove all branching to be able to drag and drop flow steps.',
  FLOW_GROUP_DELETE_MESSAGE: 'Only the flow group will be deleted. Its flows will be moved into “Unassigned”.',
  UPGRADE_AND_KEEP_FLOWS_RUNNING: 'Great idea. Who wants to stop the magic?.We`ll be in touch shortly to get you upgraded!',
  YOU_CANNOT_ENABLE_MORE_THAN_ONE_FLOW: 'You cannot enable more than one flow at a time with your current free subscription plan. Upgrade to unlock your data integration potential with more flows.',
  DELETE_FLOW: 'Are you sure you want to delete this flow? Deleting a flow will cancel the run that is currently running.',
  DETACH: 'Are you sure you want to detach this flow? The flow will be moved to the standalone flows tile.',
};
// #endregion

// #region afe editor panels router
const AFE_EDITOR_PANELS_INFO = {
  DRAWER_ACTIONS_RIBBON_LENGTH: 'Only 1 menu action is allowed. Found {{length}}',
  BRANCH_EMPTY_FILTER_RECORD_PASS: 'No conditions defined. All records will flow through this branch.',
  BRANCH_EMPTY_FILTER: 'No conditions defined.',
  MAX_BRANCHES_LIMIT_REACHED: 'You have reached the maximum of 25 branches in a branching',
  BRANCH_NAME_LENGTH_INFO: 'You have reached the maximum amount of characters for this field.',
  BRANCH_DELETE_CONFIRMATION_MESSAGE: `<p>Are you sure you want to delete this branch?</p>
  <p>This will also remove all steps/branchings inside this branch
  ({{configuredCount}} configured steps, {{unconfiguredCount}} unconfigured steps).</p>`,
  DELETE_LAST_BRANCH_MESSAGE: 'Branch cannot be deleted. Branching must have at least one branch.',
  FILTER_APPLIED: 'You can\'t search while a filter is applied. Clear your filter to allow searching.',
  EDITOR_PREVIEW_DISABLED: 'Cannot preview when there are errors.',
};
// #endregion

// #region MFA
const MFA = {
  SETUP_SUCCESS: 'MFA enabled and device connected successfully.',
  ACCOUNT_SETTINGS_UPDATED: 'MFA account settings saved successfully.',
  ENABLED: 'MFA enabled successfully.',
  DISABLED: 'MFA disabled successfully.',
  REAUTHENTICATE_ACCOUNT: '    Re-authenticate your account <br /> Enter your account password to confirm if you want to reset MFA.',
  PRIMARY_ACCOUNT_UPDATED: 'Primary account to reset updated successfully',
  RESET_SUCCESS: `Your MFA has been reset successfully and a new key has been regenerated. <b><a target="_blank" rel="noopener noreferrer"
  href="${MFA_URL}">Enable MFA</a></b> to use the new key with your account.`,
  DELETE_TRUSTED_DEVICE: "Are you sure you want to delete your trusted MFA device? You'll need to re-authenticate your account the next time you sign into integrator.io with the device.",
  RESET_MFA: "Are you sure you want to reset MFA? You'll need to re-associate your authenticator app and configure your device in integrator.io.",
  DELETE_DEVICE_SUCCESS: 'Device deleted successfully.',
  CONFIRM_LEAVE_MFA: 'Are you sure you want to leave? Your MFA settings will be disabled unless you connect your device successfully.',
  MFA_AUTH_FAILED: 'Verification failed. Please try again',
  SSO_LINKED_TO_ANOTHER_ACCOUNT_TOOLTIP: 'This user is already linked to another account’s SSO',
  ACCOUNT_SSO_OR_MFA_REQUIRED_TOOLTIP: 'You can’t require both MFA and SSO for a user.',
  OWNER_OTP_INFO: 'You are signing in from a new device. Enter your passcode to verify your account.',
  USER_OTP_INFO: 'Your account owner or admin has required you to sign in using multifactor authentication (MFA). Enter your passcode to verify your account.',
  USER_OTP_INFO_FOR_TRUSTED_NUMBER_OF_DAYS: 'Your account owner or admin has required you to sign in using multifactor authentication (MFA) after {{noOfDays}} days. Enter your passcode to verify your account.',
  SSO_SIGN_UP: 'This is an SSO sign-up. Make sure you have access to <a className="link" href=ssoLink>this</a> SSO provider',
  INSTALL_AUTHENTICATOR: 'Install any authenticator app that supports TOTP protocol or time-based one time password.',
  SCAN_QR: ' Scan the QR code below with your verification app. Once your app reads the QR code, you\'ll get a 6-digit code.',
  CANNOT_SCAN: 'Can\'t scan your QR code? Authenticate with your account and secret key.',

};
// #endregion

// #region EM2.0 messages
const ERROR_MANAGEMENT_2 = {
  SELECT_ERROR_HOVER_MESSAGE: 'Selected errors are added to a batch, on which you can perform bulk retry and resolve actions.',
  VIEW_ACTIONS_HOVER_MESSAGE: 'View actions for this error',
  RETRY_ACTION_HOVER_MESSAGE: 'Before retrying, you must save your edits for each error in the batch. Click “Save & next” on this error to continue.',
  CONFIRM_UPGRADE_ERROR_MANAGEMENT: 'Just as a reminder, you won\'t be able to switch back to the current error management platform.',
  ERROR_MANAGEMENT_DASHBOARD_INFO: 'Use this dashboard to visualize the stats of an integration flow – for example, how many successes vs. errors did my integration experience over the last 30 days? The dashboard shows graphs of total stats (success, error, ignore count) produced in the flow steps, helping you to see trends and identify performance issues or unexpected spikes in integration activity. Integration flow stats are available for up to one year.',
  ERROR_DETAILS: `Click an error row to view its details <br />
            or select the checkboxes for batch actions.`,

};
// #endregion

// #region Edit mock input
const MOCK_INPUT_REFRESH = {
  SUCCESS: 'Successfully fetched latest input data.',
  FAILED: 'Failed to fetch latest input data.',
  INVALID_JSON: 'Mock input must be valid JSON',
  INVALID_FORMAT: `Mock input must be in integrator.io canonical format. <a href=${MOCK_OUTPUT_CANONICAL_FORMAT_LINK} target="_blank" rel="noreferrer">Learn more.</a>`,
  // #endregion

};
// #endregion

// #region populate with preview data
const POPULATE_WITH_PREVIEW_DATA = {
  FAILED: 'Failed to generate or populate {{fieldName}} data.',
  SUCCESS: '{{fieldName}} field successfully populated with {{dataType}}.',
  DISABLED: 'Connection must be online to enable this action.',
};

// #endregion

// #region shopify landing page

const SHOPIFY_LANDING_PAGE = {
  OFFLINE_CONNECTION_MESSAGE: 'Save & authorize offline connections to bring them back online.',
  CONNECTION_TYPE_CHANGE_INFO: 'Saving this connection will change its current "{{type}}" auth type to "OAuth 2.0".',
  IA_NAME_MESSAGE: 'You don’t have a {{appLabel}} integration app installed in integrator.io. Install a {{appLabel}} integration app and then refresh this page to select it.',
};

// #endregion

// #region FILTER PANEL
const FILTER_PANEL = {
  INVALID_EXPRESSION: 'Please enter a valid expression.',
  INVALID_EXPRESSION_JSON: 'Expression should be a valid JSON.',
  INVALID_DATATYPES_OPERANDS: 'Data types of both the operands should match.',
  SELECT_LEFT_OPERAND: 'Please select left operand.',
  SELECT_RIGHT_OPERAND: 'Please select right operand.',
  INVALID_DATATYPE: 'Value should have correct data type.',
  INVALID_BOOLEAN_CONVERSION_FOR_NUMBER: 'Number must be 0 or 1.',
  INVALID_BOOLEAN_CONVERSION_FOR_STRING: 'String must be ["true", "t", "1","false", "f", "0"] one of these.',
};

// #endregion

// #region SUBSCRIPTION AND LISCENCE

const SUBSCRIPTION = {
  UPGRADE_YOUR_SUBSCRIPTION: 'You are currently on the Free Edition of integrator.io, which gives you one active flow at any given time. Upgrade to one of our paid subscriptions and unlock multiple flow activation to fulfill all your integration needs.',
  CONTACT_ACCOUNT_MANAGER: 'Your subscription gives you access to install and run one instance (tile) of this Integration App. Contact your Account Manager for more info.',
  CONTACT_TO_RENEW: 'We will contact you to renew your subscription.',
  CONTACT_TO_BUY: 'We will contact you to buy your subscription.',
  TRUST_DEVICE: 'Trust this device you\'ve used to sign into integrator.io',
  LICENSE_TRIAL_ISSUED: `What will you integrate next?
    <br/><br/><a target="_blank" rel="noopener noreferrer"
  href="/marketplace"><u>Check out our Marketplace</u></a> to jumpstart your  integrations with integration apps & templates.`,
  CONTACT_FOR_BUSINESS_NEEDS: 'We will contact you to discuss your business needs and recommend an {{plan}} subscription plan.',
  FREE_ONE_ACTIVE_FLOW_FOREEVER: ' Start a 30 day free trial to explore the full capabilities of integrator.io. At the end of the trial, you get to keep one active flow forever.',
  REACHED_ENTITLEMENT_ENDPOINTS: 'You have reached the entitlement of endpoints for your free subscription. Upgrade to unlock your data integration potential with more endpoints.',
  LICENSE_UPGRADE_SUCCESS_MESSAGE: `Thanks for your request! We will be in touch soon.

  <a target="_blank" rel="noopener noreferrer"
  href="/marketplace"><u>Check out our Marketplace</u></a> to jumpstart your integrations with integration apps & templates.`,
  TRY_FULL_ACCESS: 'Try full access free for 30 days',
  UNLIMITED_FLOWS_START: 'Congratulations! Your unlimited flows trial starts now.',
  REQUEST_UPGRADE_SUCCESS_MESSAGE: 'Your request to upgrade has been sent. Keep an eye out<br>for an email from one of our associates soon.',
  UPGRADE_TO_NEXT_PLAN: 'Upgrade to a {{nextPlan}} plan. Upgrades might require additional install steps to complete. If there are multiple accounts tied to this integration app, those accounts will begin installing once the subscription upgrade is complete.',
  LICENSE_EXPIRED: 'This account license has expired and the account has been converted to Free Edition with a single active flow. Please contact the account owner to renew subscription.',
  PARENT_WITHOUT_CHILD_UPGRADE_MESSAGE: 'You’ve successfuly upgraded to a {{plan}} plan. Additional plans<br>are available for request from the admin tab if you need it later on.',
  PARENT_WITHOUT_CHILD_UPGRADE_MESSAGE_WITH_NO_FURTHER_PLANS: 'You’ve successfuly upgraded to a {{plan}} plan.',
  PARENT_WITH_CHILD_UPGRADE_MESSAGE: 'You’ve successfuly upgraded to a {{plan}} plan. Moving onto<br> upgrading the accounts tied to this integration app.',
  PARENT_DRAWER_SAVE_MESSAGE: 'Your upgrade has been saved. Select the active upgrade button in the Subscription<br>details when you are ready to continue with your setup.',
  CHILD_DRAWER_SAVE_MESSAGE: 'Your upgrade has been saved. Select the active upgrade buttons under<br>{{displayName}} when you are ready to continue with your setup.',
  CHILD_UPGRADE_LEFT_MESSAGE: 'There are accounts tied to this integration app that requires additional information.<br>Go ahead and begin to upgrade the accounts that are still active.',
  PARENT_AND_CHILD_FINAL_MESSAGE: 'You’ve successfuly upgraded the accounts tied to this integration app to a {{plan}} <br>plan. Additional plans are available for request from the admin tab if you need it later on.',
  PARENT_AND_CHILD_FINAL_MESSAGE_WITH_NO_FURTHER_PLANS: 'You’ve successfuly upgraded the accounts tied to this integration app to a {{plan}} <br>plan.',
  LEFTOUT_CHILD_UPGRADE_MESSAGE: 'The {{childName}} acount has successfully upgraded to a {{nextPlan}} plan',
  PARENT_UPGRADE_ERROR_MESSAGE: 'The upgrade to a {{plan}} plan has failed. {{errorMessage}}. Select the active upgrade button when you are ready to continue with your setup.',
  CHILD_UPGRADE_ERROR_MESSAGE: 'The upgrade for {{childName}} has failed. {{errorMessage}}. Select the active upgrade button when you are ready to continue with your setup.',
  FEATURE_LICENSE_UPGRADE_REQUESTED_TOOLTIP_MESSAGE: 'We have received your request and will be in touch soon.',
  FEATURE_LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE: 'Thanks for your request! We will be in touch soon.',
  SSO_LICENSE_UPGRADE_INFO: `<b>Upgrade your account to make signing in easier and more secure.</b> Advantages of SSO authentication include: <br>
  <ul><li>Improved security</li>
  <li>Reduced password fatigue</li>
  <li>Streamlined user experience</li></ul>`,
  CONTACT_SALES_MESSAGE: 'We will contact you soon to schedule your demo and discuss your business needs. In the meantime,',
  LICENSE_UPGRADE_REQUEST: 'We will contact you to discuss your add-on request.',
  RECEIVE_FOLLOW_UP_EMAIL: 'You’ll receive a follow-up email from an associate shortly to discuss different plan options, resources & features available in each plan, and pricing.',
  UNINSTALL_INSTANCE: ' Use this page to uninstall this instance (i.e. this tile) of the Integration App. Uninstalling an Integration App will remove all components, including the integration tile, from your integrator.io account. After uninstalling you can re-install from the marketplace as long as you have a valid subscription. Please be very certain that you want to uninstall as this action cannot be undone.',
  UNINSTALL_INFO: 'Once you uninstall this Integration App there is no going back. Please be certain.',
  REQUEST_RECEIVED_VAN: '<a href="https://docs.celigo.com/hc/en-us/articles/12532590542107-What-is-a-value-added-network-VAN-connection-" rel="noreferrer" target="_blank">VAN connector</a> (Value-added network) is not included in your account’s current subscription plan.<b> Request access to VAN to securely exchange EDI messages with your trading partners.</b>',
  VAN_LICENSE_APPROVED: '<b>Additional action required after saving</b><p>You must contact Celigo to gain access to our VAN customer portal to configure and manage your VAN service. After saving this connection, email us at <b>VANsetup@celigo.com</b> and we will reach out with more information.</p>',
  VAN_LICENSE_UPGRADE_TOOLTIP_MESSAGE: 'We have received your request and will be in touch soon.',
};
// #endregion

//
const ADDONS = {
  NOT_EXIST: ' You don’t have any add-ons yet. Add-ons let you customize subscription to meet your specific business requirements.',
  CUSTOMIZE: 'Add-ons let you customize your subscription to meet your specific business requirements. They will expire when your Integration App subscription expires.',
};
//
// region JOBS
const JOBS = {
  NO_PENDING_QUEUED_JOBS: 'This connection queue does not have any pending jobs. You can use the connection drop-down in the top right to see the status of a different connection queue.',
  CANCEL_JOB: 'Are you sure you want to cancel?  Please note that canceling this job will discard all associated data currently queued for processing.',
  CHILD_JOBS_IN_PROGRESS: 'Child jobs are still in progress and the errors will be shown as soon as the child jobs are completed.',
  LOAD_CHILD_JOBS: 'Loading child jobs...',
  CONFIRM_UPLOAD: 'Are you sure you want to proceed with this upload? The name of the file you are uploading does not match the name of the latest file associated with this job. We strongly recommend that you always work from the most recent file.',
};
// end region

// Todo (Categorize on the basis of views, eg: CONTACT_TO_RENEW: message.regionLiscence.CONTACT_TO_RENEW, {{}})

const messages = {
  AGREE_TOS_AND_PP,
  INTEGRATION,
  REVERT_NOT_ALLOWED,
  MARKETPLACE,
  INSTALL_ZIP_FILE,
  API_TOKENS_NOT_EXIST,
  REQUIRED_MESSAGE,
  INVALID_DATE,
  DEFAULT_ERROR,
  AUDIT_LOGS_HAS_MORE_DOWNLOADS,
  SURE_UNINSTALL,
  NONE_TIER_USER_ERROR,
  SEND_SAP_CONCUR_MODULE,
  CONFIRM_CANCEL_RUN,
  RESOURCE,
  ADDONS,
  KEY_COLUMN_DEPRECATION,
  PREVIEW_FAILED,
  CONNECTION,
  NO_RESULT,
  PLAYGROUND,
  APP_CRASH,
  COMPONENT_INFO,
  NO_DEBUG_LOG,
  CHANGES_IN_RESOURCE,
  CONNECTION_OFFLINE,
  FORM_PREVIEW,
  CLEAR_HTTP_FIELDS,
  ALIAS,
  NETSUITE_ASSISTANT_LAUNCH_ERROR,
  DISCLAIMER,
  ROUTER_DELETE_CONFIRMATION_MESSAGE,
  CONFIRM_REMOVE,
  DATA_RETENTION,
  MAPPER2,
  FLOWS,
  AFE_EDITOR_PANELS_INFO,
  MFA,
  ERROR_MANAGEMENT_2,
  MOCK_INPUT_REFRESH,
  POPULATE_WITH_PREVIEW_DATA,
  SHOPIFY_LANDING_PAGE,
  SUBSCRIPTION,
  FILTER_PANEL,
  PURGE,
  RETRY,
  FLOWBUILDER,
  LCM,
  USER_SIGN_IN,
  TRANSFERS,
  JOBS,
};
export const message = messages;
export default function messageStore(key, argsObj) {
  let str = get(messages, key);

  if (!str) return '';
  if (!argsObj || typeof argsObj !== 'object') return str;

  Object.keys(argsObj).forEach(arg => {
    str = str.replaceAll(`{{${arg}}}`, argsObj[arg]);
  });

  return str;
}

