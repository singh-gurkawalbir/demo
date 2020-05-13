import { Fragment } from 'react';
import { useGetConnectorName } from '../../CeligoTable/util';
import accesstokens from './accesstokens';
import agents from './agents';
import connections from './connections';
import connectors from './connectors';
import defaultResource from './default';
import exports from './exports';
import imports from './imports';
import scripts from './scripts';
import stacks from './stacks';

export const ConnectorNameComp = ({ r }) => (
  <Fragment>{useGetConnectorName(r)}</Fragment>
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
};

export default function(resourceType) {
  return metadata[resourceType] || defaultResource(resourceType);
}
