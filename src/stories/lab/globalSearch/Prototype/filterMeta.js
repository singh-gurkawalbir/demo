export const filterMap = {
  integrations:
    { shortcut: 'in', type: 'integrations', label: 'Integrations', isResource: true },
  flows:
    { shortcut: 'f', type: 'flows', label: 'Flows', isResource: true },
  connections:
    { shortcut: 'c', type: 'connections', label: 'Connections', isResource: true },
  imports:
    { shortcut: 'i', type: 'imports', label: 'Imports', isResource: true },
  exports:
    { shortcut: 'e', type: 'exports', label: 'Exports', isResource: true },
  scripts:
    { shortcut: 's', type: 'scripts', label: 'Scripts', isResource: true },
  agents:
    { shortcut: 'a', type: 'agents', label: 'Agents', isResource: true },
  stacks:
    { shortcut: 'st', type: 'stacks', label: 'Stacks', isResource: true },
  apis:
    { shortcut: 'api', type: 'apis', label: 'My APIs', isResource: true },
  accesstokens:
    { shortcut: 'token', type: 'accesstokens', label: 'API tokens', isResource: true },
  templates:
    { shortcut: 't', type: 'templates', label: 'Templates', isResource: true },
  connectors:
    { shortcut: 'ia', type: 'connectors', label: 'Integration apps', isResource: true },
  recycleBin:
    { shortcut: 'r', type: 'recycleBin', label: 'Recycle bin', isResource: true },
  marketplaceTemplates:
    { shortcut: 'mt', type: 'marketplaceTemplates', label: 'Templates', isResource: false },
  marketplaceConnectors:
    { shortcut: 'mia', type: 'marketplaceConnectors', label: 'Integration apps', isResource: false },
};

export const shortcutMap = {};

Object.keys(filterMap).forEach(filter => { shortcutMap[filterMap[filter].shortcut] = filter; });
