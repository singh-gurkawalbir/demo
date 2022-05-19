const messages = {
  CONTACT_SALES_MESSAGE: 'We will contact you soon to schedule your demo and discuss your business needs. In the meantime,',
  INTEGRATION_DELETE_VALIDATE: 'All Flows within an integration tile must be removed before the integration tile can be deleted.',
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
href="/marketplace"><u>Check out our Marketplace</u></a> to jumpstart your integrations with Integration Apps, Business Process Automation templates, and quickstart templates.`,
  DIY_INSTALL_DISCLAIMER: 'By default, all integration flows will be disabled when first installed; you must enable each flow that you want to run. You can modify, delete, or extend any of the resources in this integration, but  updates to the original integration will not affect this new copy. This integration has not been reviewed by Celigo. Make sure you trust the author before installing, and carefully review all components in the integration before proceeding.',
  CELIGO_AUTHORED_TEMPLATE_DISCLAIMER: 'By default, all integration flows will be disabled when first installed; you must enable each flow that you want to run. You can modify, delete, or extend any of the components in this template, but unlike Integration apps, updates to the master integration template will not be propagated to your account.',
  THIRD_PARTY_TEMPLATE_DISCLAIMER: 'By default, all integration flows will be disabled when first installed; you must enable each flow that you want to run. You can modify, delete, or extend any of the components in this template, but unlike Integration apps, updates to the master integration template will not be propagated to your account. This template has not been reviewed by Celigo. Make sure you trust the publisher before installing, and carefully review all components in the integration before proceeding.',
};

export default function messageStore(key, argsObj) {
  let str = messages[key];

  if (!str) return '';
  if (!argsObj || typeof argsObj !== 'object') return str;

  Object.keys(argsObj).forEach(key => {
    str = str.replace(`{{{${key}}}}`, argsObj[key]);
  });

  return str;
}

export const NONE_TIER_USER_ERROR = 'Your username is not part of shared account access anymore. Please have the account owner invited you to this account.';
