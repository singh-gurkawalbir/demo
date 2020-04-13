import React, { useEffect, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DynaSelect from './DynaSelect';
import DynaSelectResource from './DynaSelectResource';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { isProduction } from '../../../forms/utils';

export default function DynaIclient(props) {
  const { connectionId, connectorId, connType, hideFromUI, resourceId } = props;
  const dispatch = useDispatch();
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const { patch: allPatches } = useSelector(state =>
    selectors.stagedResource(state, resourceId)
  );
  let integrationDoc;

  if (
    allPatches &&
    allPatches.find(item => item.path === '/newIA') &&
    allPatches.find(item => item.path === '/newIA').value
  ) {
    integrationDoc = {
      id: (allPatches.find(item => item.path === '/_integrationId') || {})
        .value,
      connectionType: (allPatches.find(item => item.path === '/type') || {})
        .value,
      assistant: (allPatches.find(item => item.path === '/assistant') || {})
        .value,
    };
  }

  const [requested, setRequested] = useState(false);
  const iClients = (connection && connection.iClients) || [];

  useEffect(() => {
    if (!iClients.length && connectionId && connectorId && !requested) {
      setRequested(true);
      dispatch(
        actions.resource.connections.requestIClients(
          connectionId,
          integrationDoc
        )
      );
    }
  }, [
    connectionId,
    connectorId,
    dispatch,
    iClients.length,
    integrationDoc,
    requested,
  ]);

  return hideFromUI ? null : (
    <Fragment>
      {connectorId && (
        <DynaSelect
          {...props}
          options={[
            {
              items: iClients.map(i => ({
                label: i.name || i._id,
                value: i._id,
              })),
            },
          ]}
        />
      )}
      {connType !== 'ebay' &&
        (connType !== 'netsuite' || !isProduction()) &&
        !connectorId && <DynaSelectResource {...props} />}
    </Fragment>
  );
}
