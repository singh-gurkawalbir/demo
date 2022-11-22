import { MFA_URL, REVISIONS_GUIDE_URL } from '../constants';

const messages = {
  CONTACT_SALES_MESSAGE: 'We will contact you soon to schedule your demo and discuss your business needs. In the meantime,',
  INTEGRATION_DELETE_VALIDATE: 'All Flows within an integration tile must be removed before the integration tile can be deleted.',
  INTEGRATION_WITH_CONNECTORS_DELETE_VALIDATE: 'The integration is being actively used by an integration app. Please ensure no integration app resource is using the integration before deleting',
  FLOW_GROUP_DELETE_MESSAGE: 'Only the flow group will be deleted. Its flows will be moved into “Unassigned”.',
  LICENSE_UPGRADE_REQUEST: 'We will contact you to discuss your add-on request.',
  NO_PENDING_QUEUED_JOBS: 'This connection queue does not have any pending jobs. You can use the connection drop-down in the top right to see the status of a different connection queue.',
  LICENSE_EXPIRED: 'This account license has expired and the account has been converted to Free Edition with a single active flow. Please contact the account owner to renew subscription.',
  CANCEL_JOB: 'Are you sure you want to cancel?  Please note that canceling this job will discard all associated data currently queued for processing.',
  MARKETPLACE_HELPINFO: 'Jump-start your integrations with our Quickstart integration templates. Explore new or install your existing licensed integration apps.',
  REQUIRED_MESSAGE: 'A value must be provided',
  ALIAS_PANEL_HELPINFO: 'An alias provides an easy way to reference a specific resource in your integration when you\'re building scripts. For example, instead of referring to a flow ID in a script, you can use an alias for that flow instead. This makes your script portable across environments and prevents you from having to manually change the referenced ID later. Use the Aliases tab to see all aliases that have been defined for this integration\'s flows, connections, imports, and exports. You can also create a new alias (top right), or use the Actions menu to edit, copy, delete, or view details for an alias. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.',
  ALIAS_DELETE_CONFIRM_MESSAGE: 'Are you sure you want to delete this alias? Deleting an alias does not remove any references to it. Errors will occur and scripts will fail if the alias is referenced.',
  MANAGE_ALIASES_HELPINFO: 'Use this page to see all of your aliases for this flow, as well as any integration-level aliases (inherited aliases). You can create a new alias for this flow (top right), or use the Actions menu to edit, copy, delete, or view details for a flow-level alias.  Inherited aliases are passed down to the flow from the integration. However, keep in mind that if you reference both a flow-level alias and an integration-level alias for a resource in a script, the flow-level alias will take precedence. Use the Actions menu for Inherited aliases to copy an alias or view its details. To create, edit, or delete one of these aliases, navigate to the integration instead and use the Alias tab. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.',
  VIEW_ALIASES_HELPINFO: 'View the list of aliases defined for your resources (flows, connections, export, and imports).',
  ALIAS_COPIED_MESSAGE: 'Alias copied to clipboard.',
  ALIAS_SAVE_MESSAGE: 'You’ve successfully created an alias.',
  ALIAS_DELETE_MESSAGE: 'You’ve successfully deleted your alias.',
  EDIT_ALIAS_FORM_HELPINFO: 'Editing an alias is helpful when you\'ve built an improved flow or other resource and want all of the scripts that reference the alias to use the new resource. You can update any of the fields for an alias as needed, but keep in mind this may have implications on any scripts that currently reference the alias. <br><b>CAUTION:</b> *If you change the Alias ID (name), it is not updated in existing scripts. <br>*Only change the type and select a new resource matching that type only if you\'re certain this will not adversely impact any existing scripts that reference the alias. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.',
  CREATE_ALIAS_FORM_HELPINFO: 'An alias provides an easy way to reference a specific resource in your integration when you\'re building scripts. You can create aliases for flows, connections, imports, and exports.',
  NETSUITE_ASSISTANT_LAUNCH_ERROR: `Unable to load NetSuite Assistant for one of the following reasons:
• It is disabled in recent versions of Google Chrome, Firefox and Safari
• Newer NetSuite record types are not yet supported
We are currently working with NetSuite to resolve these problems.`,
  LICENSE_UPGRADE_SUCCESS_MESSAGE: `Thanks for your request! We will be in touch soon.

<a target="_blank" rel="noopener noreferrer"
href="/marketplace"><u>Check out our Marketplace</u></a> to jumpstart your integrations with integration apps & templates.`,
  REQUEST_UPGRADE_SUCCESS_MESSAGE: 'Your request to upgrade has been sent. Keep an eye out for an email from one of our associates soon.',
  LICENSE_TRIAL_ISSUED: `What will you integrate next?
  <br/><br/><a target="_blank" rel="noopener noreferrer"
href="/marketplace"><u>Check out our Marketplace</u></a> to jumpstart your  integrations with integration apps & templates.`,
  DIY_INSTALL_DISCLAIMER: 'By default, all integration flows will be disabled when first installed; you must enable each flow that you want to run. You can modify, delete, or extend any of the resources in this integration, but  updates to the original integration will not affect this new copy. This integration has not been reviewed by Celigo. Make sure you trust the author before installing, and carefully review all components in the integration before proceeding.',
  CELIGO_AUTHORED_TEMPLATE_DISCLAIMER: 'By default, all integration flows will be disabled when first installed; you must enable each flow that you want to run. You can modify, delete, or extend any of the components in this template, but unlike Integration apps, updates to the master integration template will not be propagated to your account.',
  THIRD_PARTY_TEMPLATE_DISCLAIMER: 'By default, all integration flows will be disabled when first installed; you must enable each flow that you want to run. You can modify, delete, or extend any of the components in this template, but unlike Integration apps, updates to the master integration template will not be propagated to your account. This template has not been reviewed by Celigo. Make sure you trust the publisher before installing, and carefully review all components in the integration before proceeding.',
  ROUTER_DELETE_CONFIRMATION_MESSAGE: `<p>Are you sure you want to delete this branching?</p>
  <p>In the first branch, all steps/branching routers will persist and become a linear flow.</p>
  <p>All other branches and all steps/branching routers inside 
  ({{configuredCount}} configured steps, {{unconfiguredCount}} unconfigured steps) will be removed.</p>`,
  BRANCH_DELETE_CONFIRMATION_MESSAGE: `<p>Are you sure you want to delete this branch?</p>
  <p>This will also remove all steps/branchings inside this branch 
  ({{configuredCount}} configured steps, {{unconfiguredCount}} unconfigured steps).</p>`,
  DELETE_LAST_BRANCH_MESSAGE: 'Branch cannot be deleted. Branching must have at least one branch.',
  SSO_LICENSE_UPGRADE_INFO: `<b>Upgrade your account to make signing in easier and more secure.</b> Advantages of SSO authentication include: <br>
  <ul><li>Improved security</li>
  <li>Reduced password fatigue</li>
  <li>Streamlined user experience</li></ul>`,
  FEATURE_LICENSE_UPGRADE_REQUESTED_TOOLTIP_MESSAGE: 'We have received your request and will be in touch soon.',
  // #Data retention messsages
  DATA_RETENTION_TAB_INFO: 'If you’re an <a href="https://docs.celigo.com/hc/en-us/articles/115003929872" target="_blank">account owner or administrator</a>, you can <a href="https://docs.celigo.com/hc/en-us/articles/6359380074779" target="_blank">access your integrator.io data for 30 or more days</a>. The data retention period varies based on your Celigo license, which you can upgrade anytime. You can also delete records these records. This functionality is compliant with <a href="https://www.celigo.com/security-privacy-compliance/" target="_blank">GDPR and CCPA rules.</a>',
  DATA_RETENTION_LICENSE_UPGRADE: '<b>More options available</b> - Upgrade your account for longer data retention periods. ',
  DATA_RETENTION_PERIOD_CHANGE_INFO: '<b><a href="https://docs.celigo.com/hc/en-us/articles/6359380074779-Access-data-for-more-than-30-days" target="_blank">Learn more about data retention</a></b> and consult with your security/privacy team before saving a new retention period.',
  DATA_RETENTION_PERIOD_UPDATE_CONFIRM: 'The new retention period of {{newDataRetentionPeriod}} days will apply only to new flow runs. All other data in your account will persist up until its current retention period of {{currentDataRetentionPeriod}} days. <br> <a href="https://docs.celigo.com/hc/en-us/articles/6359380074779-Access-data-for-more-than-30-days" target="_blank">Learn more about data retention</a> and consult with your security/privacy team before saving.',
  DATA_RETENTION_PERIOD_UPDATED: 'New data retention period successfully saved.',
  // #endregion
  // #region mapper2 messages
  MAPPER2_DELETE_ROW_WARNING: 'Are you sure you want to delete this parent record row? All its child rows will be deleted as well.',
  MAPPER2_DATA_TYPE_WARNING: `Since only an "object" or "[object]" data type can have child rows, 
  all of this parent record row's child rows will be deleted when your selected data type is applied. 
  <br><br>Are you sure you want to continue?`,
  MAPPER1_REFERENCE_INFO: 'Your 1.0 mappings are for reference only and will be ignored. Delete all 2.0 mappings to use 1.0 mappings instead.',
  MAPPER2_BANNER_WARNING: 'Any 2.0 mappings that you enter will be applied when you click <b>Save</b>, even if you toggle back to Mapper 1.0. To apply 1.0 mappings instead, delete all mappings from Mapper 2.0 and click <b>Save</b>. <b><a target="_blank" rel="noreferrer" href="https://docs.celigo.com/hc/en-us/articles/4536629083035-Mapper-2-0"> Learn about Mapper 2.0</a></b>',
  DYNAMIC_LOOKUP_SOURCE_TOOLTIP: 'Dynamic lookups do not provide source field list',
  HARD_CODED_SOURCE_TOOLTIP: 'Hard-coded values do not provide source field list',
  HANDLEBARS_SOURCE_TOOLTIP: 'Handlebars expression do not provide source field list',
  MAPPER2_AUTO_CREATE_STRUCTURE: 'Are you sure you want to auto-populate your destination fields?<br><b>This will replace all of your current destination fields and source fields.</b>',
  // #endregion
  // #region LCM
  REVISION_IN_PROGRESS_ERROR: 'You have a pull, snapshot, or revert in progress.',
  NO_CLONE_FAMILY_TO_PULL_FROM_ERROR: `You don't have any data to pull. Learn more about <a target='_blank' href=${REVISIONS_GUIDE_URL}> cloning and pulling your integrations</>.`,
  PULL_MERGE_SUCCESS: 'You\'ve successfully merged your pull.',
  REVERT_SUCCESS: 'You\'ve successfully reverted your changes.',
  SNAPSHOT_SUCCESS: 'You\'ve successfully created a snapshot.',
  // #endregion
  INCOMPLETE_FLOW_TOOLTIP: 'Configure all steps to allow running your flow',
  INCOMPLETE_FLOW_SCHEDULE_TOOLTIP: 'Configure all steps to allow scheduling your flow',
  BRANCH_EMPTY_FILTER_RECORD_PASS: 'No conditions defined. All records will flow through this branch.',
  BRANCH_EMPTY_FILTER: 'No conditions defined.',
  // #region MFA
  MFA_SETUP_SUCCESS: 'MFA enabled and device connected successfully.',
  MFA_ACCOUNT_SETTINGS_UPDATED: 'MFA account settings saved successfully.',
  MFA_ENABLED: 'MFA enabled successfully.',
  MFA_DISABLED: 'MFA disabled successfully.',
  MFA_PRIMARY_ACCOUNT_UPDATED: 'Primary account to reset updated successfully',
  MFA_RESET_SUCCESS: `Your MFA has been reset successfully and a new key has been regenerated. <b><a target="_blank" rel="noopener noreferrer"
  href="${MFA_URL}">Enable MFA</a></b> to use the new key with your account.`,
  DELETE_TRUSTED_DEVICE: "Are you sure you want to delete your trusted MFA device? You'll need to re-authenticate your account the next time you sign into integrator.io with the device.",
  RESET_MFA: "Are you sure you want to reset MFA? You'll need to re-associate your authenticator app and configure your device in integrator.io.",
  DELETE_DEVICE_SUCCESS: 'Device deleted successfully.',
  FEATURE_LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE: 'Thanks for your request! We will be in touch soon.',
  CONFIRM_LEAVE_MFA: 'Are you sure you want to leave? Your MFA settings will be disabled unless you connect your device successfully.',
  MFA_AUTH_FAILED: 'Verification failed. Please try again',
  SSO_LINKED_TO_ANOTHER_ACCOUNT_TOOLTIP: 'This user is already linked to another account’s SSO',
  ACCOUNT_SSO_OR_MFA_REQUIRED_TOOLTIP: 'You can’t require both MFA and SSO for a user.',
  MFA_OWNER_OTP_INFO: 'You are signing in from a new device. Enter your passcode to verify your account.',
  MFA_USER_OTP_INFO: 'Your account owner or admin has required you to sign in using multifactor authentication (MFA). Enter your passcode to verify your account.',
  MFA_USER_OTP_INFO_FOR_TRUSTED_NUMBER_OF_DAYS: 'Your account owner or admin has required you to sign in using multifactor authentication (MFA) after {{noOfDays}} days. Enter your passcode to verify your account.',
  // #endregion
  // #region EM2.0 messages
  SELECT_ERROR_HOVER_MESSAGE: 'Selected errors are added to a batch, on which you can perform bulk retry and resolve actions.',
  VIEW_ACTIONS_HOVER_MESSAGE: 'View actions for this error',
  RETRY_ACTION_HOVER_MESSAGE: 'Before retrying, you must save your edits for each error in the batch. Click “Save & next” on this error to continue.',
  // #endregion
  // #region Edit mock input
  MOCK_INPUT_REFRESH_SUCCESS: 'Successfully fetched latest input data.',
  DATALOADER_PP_MESSAGE: 'You can add a destination application once you complete the configuration of your data loader.',
  MAX_ROUTERS_LIMIT_REACHED: 'You have reached the maximum of 25 branchings in a flow',
  MAX_BRANCHES_LIMIT_REACHED: 'You have reached the maximum of 25 branches in a branching',
  TERMINAL_NODE_TOOLTIP: 'Drag to merge with other branch',
  MERGE_NODE_TOOLTIP: 'Merge point (records from branches are merged here)',
  TERMINAL_NODE_FROZEN_TOOLTIP: 'Merging to another branch is not possible here because your flow does not contain any branches or because there are no merge targets available. Add branching to your flow or modify your current flow layout to allow merging.',
  CLONE_DESCRIPTION: 'Cloning an integration enables you to keep an original integration unchanged while modifying the configuration settings for a duplicate version of it. <a href="https://docs.celigo.com/hc/en-us/articles/115000757512-Clone-integrations-and-flows" target="_blank">Learn more</a>',
  CREATE_SNAPSHOT_FORM_HELPINFO: 'A snapshot is a saved capture of your integration that you can use to revert your integration at any point.',
  CREATE_PULL_FORM_HELPINFO: 'Pulling changes from one linked integration to another lets you see conflicts, review changes, and merge them from one integration to another. You can only pull data from a direct clone or source integration.. For example, clone Integration A as Integration B, then B to C, and B to D. You can create a pull between integrations A and B, B and C, B and D; but not between A and C, or C and D',
  RETRIES_TAB_INFO: 'When you retry errors in a flow step, a new row in the <b>Retries</b> tab under that step will display its progress. When a retry results in errors in later flow steps, you can locate the new errors in their <b>Open errors tab</b>. <br>Here you will also find auto-retry runs. When retries were triggered by auto-retry, a single row will appear for each retry job in the <b>Retries</b> tab and the column <b>Retry started by</b> will contain <b>Auto-retried</b>.',
  CANCEL_RETRY_CONFIRM: 'Cancelling will abort the retrying of any errors not yet processed in this operation; those errors already processed will not be reverted, maintaining their current state (failed or resolved).',
  RETRIES_TAB_ERRORS_UPDATED_INFO: 'Retries that were initiated from previous steps in your flow cannot be shown on any subsequent steps whose errors/success were changed by the retries in a previous step.',
  AUDIT_LOGS_HAS_MORE_DOWNLOADS: 'Your downloaded file has exceeded the limit of 20,000 records. To narrow the results, try again after limiting the events\' dates, resource type, source, and so on.',
};

export default function messageStore(key, argsObj) {
  let str = messages[key];

  if (!str) return '';
  if (!argsObj || typeof argsObj !== 'object') return str;

  Object.keys(argsObj).forEach(arg => {
    str = str.replace(`{{${arg}}}`, argsObj[arg]);
  });

  return str;
}

export const NONE_TIER_USER_ERROR = 'Your username is not part of shared account access anymore. Please have the account owner invited you to this account.';
