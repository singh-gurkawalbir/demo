export const CONTACT_SALES_MESSAGE =
  'We will contact you soon to learn more about your needs. Meanwhile, please checkout';
export const MULTIPLE_INSTALLS =
  'Looks like this Integration App is already installed in your account. If you would like to install another instance please provide a unique tag name so that we can help you differentiate this install from the others.';
export const INTEGRATION_DELETE_VALIDATE =
  'All Flows within an integration tile must be removed before the integration tile can be deleted.';
export const FLOW_GROUP_DELETE_MESSAGE =
  'Only the flow group will be deleted. Its flows will be moved into “Unassigned”.';
export const LICENSE_UPGRADE_REQUEST_RECEIVED =
'Thanks for your interest! We’ll be in touch shortly to get your license upgraded.';
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
export const FLOW_LIMIT_REACHED =
  'Sorry, you have reached your integration flow limit. In order to create additional integration flows you can disable one or more existing flows, or you can go to subscription page and upgrade to your subscription.';
export const LICENSE_TRIAL_EXPIRED =
  'This account trial license has expired. In order to create additional integration flows you can disable one or more existing flows, or you can go to subscription page and upgrade to your subscription.';
export const LICENSE_TRIAL_NOT_STARTED =
  'You must have a subscription in order to create integration flows and orchestrations. Start a 30 day free trial to experience the full capacity of integrator.io. At the end of the trial, you get to keep one active flow at no cost as a Free edition subscriber.';
export const CANCEL_JOB =
  'Are you sure you want to cancel?  Please note that canceling this job will discard all associated data currently queued for processing.';

// #region form messages
export const REQUIRED_MESSAGE = 'A value must be provided';
// #endregion form messages

export const NETSUITE_ASSISTANT_LAUNCH_ERROR = `Unable to load NetSuite Assistant for one of the following reasons:
• It is disabled in recent versions of Google Chrome (and available in other browsers)
• Newer NetSuite record types are not yet supported 
We are currently working with NetSuite to resolve these problems.`;
