export const CONTACT_SALES_MESSAGE =
  'We will contact you soon to schedule your demo and discuss your business needs. In the meantime,';
export const MULTIPLE_INSTALLS =
  'Looks like this Integration App is already installed in your account. If you would like to install another instance please provide a unique tag name so that we can help you differentiate this install from the others.';
export const INTEGRATION_DELETE_VALIDATE =
  'All Flows within an integration tile must be removed before the integration tile can be deleted.';
export const FLOW_GROUP_DELETE_MESSAGE =
  'Only the flow group will be deleted. Its flows will be moved into “Unassigned”.';
export const LICENSE_UPGRADE_REQUEST_RECEIVED =
'Thanks for your request! We will be in touch soon.';
export const LICENSE_UPGRADE_REQUEST = 'We will contact you to discuss your add-on request.';
export const LICENSE_UPGRADE_SUCCESS_MESSAGE = `${LICENSE_UPGRADE_REQUEST_RECEIVED}
      
<a target="_blank" rel="noopener noreferrer"
href="/marketplace"><u>Check out our Marketplace</u></a> to jumpstart your integrations with Integration Apps, Business Process Automation templates, and quickstart templates.`;

export default {
  CONTACT_SALES_MESSAGE,
  MULTIPLE_INSTALLS,
  INTEGRATION_DELETE_VALIDATE,
};
export const CLONE_DESCRIPTION = `
Cloning can be used to create a copy of a flow, export, import, orchestration, or an entire integration. Cloning is useful for testing changes without affecting your production integrations (i.e. when you clone something you can choose a different set of connection records). Cloning supports both sandbox and production environments.`;

export const NO_PENDING_QUEUED_JOBS =
  'This connection queue does not have any pending jobs. You can use the connection drop-down in the top right to see the status of a different connection queue.';
export const LICENSE_EXPIRED =
  'This account license has expired and the account has been converted to Free Edition with a single active flow. Please contact the account owner to renew subscription.';
export const CANCEL_JOB =
  'Are you sure you want to cancel?  Please note that canceling this job will discard all associated data currently queued for processing.';
export const MARKETPLACE_HELPINFO = 'Jump-start your integrations with our Quickstart integration templates. Explore new or install your existing licensed integration apps.';

// #region form messages
export const REQUIRED_MESSAGE = 'A value must be provided';
// #endregion form messages

export const ALIAS_PANEL_HELPINFO = 'An alias provides an easy way to reference a specific resource in your integration when you\'re building scripts. For example, instead of referring to a flow ID in a script, you can use an alias for that flow instead. This makes your script portable across environments and prevents you from having to manually change the referenced ID later. Use the Aliases tab to see all aliases that have been defined for this integration\'s flows, connections, imports, and exports. You can also create a new alias (top right), or use the Actions menu to edit, copy, delete, or view details for an alias. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.';
export const ALIAS_DELETE_CONFIRM_MESSAGE = 'Are you sure you want to delete your alias? If you delete it, then any resources that reference the alias will now reference the ID. You’ll need to update the resource with a new or existing alias if you want to reference a different alias.';
export const MANAGE_ALIASES_HELPINFO = 'Use this page to see all of your aliases for this flow, as well as any integration-level aliases (inherited aliases). You can create a new alias for this flow (top right), or use the Actions menu to edit, copy, delete, or view details for a flow-level alias.  Inherited aliases are passed down to the flow from the integration. However, keep in mind that if you reference both a flow-level alias and an integration-level alias for a resource in a script, the flow-level alias will take precedence. Use the Actions menu for Inherited aliases to copy an alias or view its details. To create, edit, or delete one of these aliases, navigate to the integration instead and use the Alias tab. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.';
export const VIEW_ALIASES_HELPINFO = 'View the list of aliases defined for your resources (flows, connections, export, and imports).';

export const NETSUITE_ASSISTANT_LAUNCH_ERROR = `Unable to load NetSuite Assistant for one of the following reasons:
• It is disabled in recent versions of Google Chrome (and available in other browsers)
• Newer NetSuite record types are not yet supported 
We are currently working with NetSuite to resolve these problems.`;
