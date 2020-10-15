import React from 'react';
import { useSelector } from 'react-redux';
import DynaSelectResource from './DynaSelectResource';
import { selectors } from '../../../reducers';
import { getReplaceConnectionExpression } from '../../../utils/connections';

const emptyObj = {};
export default function DynaReplaceConnection(props) {
  const {connectionId, connectorId} = props;
  let {integrationId} = props;
  let childId;
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );

  const connection = useSelector(
    state =>
      selectors.resource(state, 'connections', connectionId) ||
      emptyObj
  );

  const parentIntegration = useSelector(state =>
    selectors.resource(state, 'integrations', integration?._parentId)
  );

  if (parentIntegration?._id) {
    childId = integrationId;
    integrationId = parentIntegration._id;
  }
  const options = getReplaceConnectionExpression(connection, !!childId, childId, integrationId, connectorId, false);

  return <DynaSelectResource {...props} options={options} />;
}

