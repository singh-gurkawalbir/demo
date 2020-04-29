// make sure the dictionary key matches the "model plural" name.
export default {
  exports: `Exports are used to extract data from an application. You can create and configure exports here or when you are building your flow. You can even invoke a stand-alone export using the integrator.io API to pull data in real-time into your own app.`,
  imports: `Imports are used to insert data into an application. You can create and configure exports here or when you are building your flow. You can even invoke a stand-alone import using the integrator.io API to insert data in real-time into an application from your own app.`,
  agents: `Agents are small applications that you can install on your computers to connect to data that is behind your firewall if you don't want to whitelist integrator.io's IP addresses. Each agent has an access token associated with it that should be used when installing the software on your computer. The installed agents connect to integrator.io and establish a reverse SSH tunnel allowing secure communication through your firewall without any need of whitelisting IPs in your firewall settings.`,
  connections: `Connections store credentials and other information needed to access an application via its API. When you share an integration with other integrator.io users, they are able to create, edit, or run a flow using the connection resource that you specified within the shared integration. <br />Check out our <a href='https://celigosuccess.zendesk.com/hc/en-us/categories/360002670492' target='_blank'>Connector solutions articles</a> for information on connecting each supported app.`,
  recycleBin: `All deleted items will be kept in the Recycle bin for up to 30 days before being automatically purged. All Flows in Recycle bin are deactivated and will no longer run. You can restore any of the items listed in Recycle bin, or purge them manually via Actions.`,
  scripts: `You can write scripts in JavaScript to customize your integrations, enabling you to implement hooks, filters, transforms, and more. You can organize your scripts however you’d like, such as having just one script record with all of your code or splitting your code across multiple script records, even if different users are responsible for them. Scripts can be used by any number of resources in your integrator.io account, so use caution when modifying a script.`,
  stacks: `You can use stacks to host code for hooks, wrappers, connector installers and settings pages. Stacks are simple server environments which can be implemented in any coding language and are always invoked via HTTP. Every stack is assigned a system token that should be used to authenticate HTTP requests. You own the IP for all of your stacks, and can optionally choose to share a stack with other integrator.io users.`,
  templates: `
    This is a special page enabled only for select partners. 
    Please use this page to publish templates to the integration marketplace. 
    You can also use this page to do all the standard template functionality 
    (i.e. install new integration, generate template zip file, etc...).`,
  connectors: `
    Integration apps represent fully functional pre-built integrations that any 
    user can install into their Integrator account, directly from the 
    Integrator Marketplace. Integration apps include an installer, uninstaller, 
    and a settings interface. Integration App developers can push updates 
    at any time for their Integration App to their entire install base. 
    A Integration App can create any number of components in a user's account.`,
  licenses: `
    From this page you can provision and also manage license records 
    for your Integration App product. License records control who can install 
    a new instance of your Integration App, and also when that instance should expire. 
    You can also create multiple license records for the same user to enable 
    multiple installs in their account (i.e. for parallel environments like 
    sandbox and production). The license data here is also available 
    via the integrator.io API, and you can use the API to sync this data 
    with your subscription and billing software to fully automate a 
    provisioning process.`,
  accesstokens: `
    API tokens are required to access the integrator.io API, which can be used 
    to perform CRUD operations on any resource in your account, or to synchronously 
    get data in and out of any application that integrator.io can connect with.
    API tokens can be provisioned with full or minimal access. API tokens can be
    revoked or reactivated at any time. Tokens can be regenerated 
    (as a security best practice to rotate the secret keys being stored externally).
    
    IMPORTANT: it may take up to one minute for API token changes to propagate 
    and take effect.`,
};
