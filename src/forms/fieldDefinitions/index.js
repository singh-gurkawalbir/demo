import connections from './resources/connection';
import exports from './resources/exports';
import imports from './resources/imports';
import scripts from './resources/script';
import stacks from './resources/stack';
import connectors from './resources/connector';
import templates from './resources/template';
import accesstokens from './resources/accesstoken';
import connectorLicenses from './resources/connectorLicense';
import integrations from './resources/integration';
import asyncHelpers from './resources/asyncHelpers';
import iClients from './resources/iClient';
import eventreports from './resources/eventreport';
import suiteScript from './suiteScript';
import iClientHttpFramework from './resources/iClientHttpFramework';

export default {
  connections,
  exports,
  iClients,
  imports,
  connectors,
  scripts,
  templates,
  asyncHelpers,
  stacks,
  accesstokens,
  connectorLicenses,
  integrations,
  eventreports,
  iClientHttpFramework,
  ...suiteScript,
};
