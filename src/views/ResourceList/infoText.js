// make sure the dictionary key matches the "model plural" name.
export default {
  exports: `
    Exports are used to extract data from an application. 
    When building a data flow, defining the export is the 
    first step in the flow wizard. You can also invoke an export 
    standalone using the integrator.io API to pull data in real-time 
    into your own app.!`,
  imports: `
    Imports are used to insert data into an application. 
    When building a data flow, defining the import is the second 
    step in the wizard. You can also invoke an import standalone 
    using the integrator.io API to insert data into an application 
    in real-time from your own app.`,
  agents: `
    Agents are a small piece of software that you can install on 
    your machines to connect to data that is behind your firewall 
    if you don't want to whitelist integrator.io's IP addresses. 
    Each agent has an access token associated with it that should 
    be used when installing the software on your machine. The installed 
    agents connect to integrator.io and establish a reverse SSH tunnel 
    allowing secure communication through your firewall without any 
    need of whitelisting IPs in your firewall settings.`,
  connections: `
    Connections are used to store credentials, along with other 
    information needed to access an application via its API. 
    Connections can also be shared with other integrator.io users 
    to edit and create data flows that run in your integrator.io 
    account.`,
  recycleBin: `
    All deleted items will be kept in the Recycle Bin for up to 30 days 
    before being automatically purged. All Flows in Recycle Bin 
    are deactivated and will no longer run. You can restore any of the items 
    listed in Recycle Bin, or purge them manually, via Actions.`,
  scripts: `
    Scripts are written in JavaScript and represent a powerful 
    mechanism for customizing your integrator.io account. You can use 
    scripts to implement hooks, filters, transforms, and more. Feel free 
    to organize your scripts any way you like. For example, you could 
    have just one script record and put all your code in that one record, 
    or you could split your code across multiple different script records 
    (i.e. that different users are responsible for). Please note that 
    scripts can be referenced by any number of resources in your 
    integrator.io account and changing a script should always be done 
    with caution. Enjoy! `,
  stacks: `
    Stacks are simple server environments used to host code for hooks, 
    wrappers, Integration App installers and settings pages. Stacks can be 
    implemented in any programming language and are always invoked via HTTP. 
    Every stack is assigned a system token that should be used to 
    authenticate HTTP requests. You own the IP for all your stacks, 
    and can optionally choose to share a stack with other integrator.io users.`,
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
