import React from 'react';
import { useGetConnectorName, useGetScriptName } from '../../CeligoTable/util';
import accesstokens from './accesstokens';
import agents from './agents';
import connections from './connections';
import connectors from './connectors';
import defaultResource from './default';
import exports from './exports';
import imports from './imports';
import scripts from './scripts';
import stacks from './stacks';
import apis from './apis';

export const ConnectorNameComp = ({ r }) => (
  <>{useGetConnectorName(r)}</>
);
export const ScriptName = ({id}) => (
  <>{useGetScriptName(id)}</>
);

const metadata = {
  agents,
  connections,
  exports,
  imports,
  scripts,
  stacks,
  connectors,
  accesstokens,
  apis,
};

export default function (resourceType) {
  return metadata[resourceType] || defaultResource(resourceType);
}
