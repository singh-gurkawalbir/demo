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
};
