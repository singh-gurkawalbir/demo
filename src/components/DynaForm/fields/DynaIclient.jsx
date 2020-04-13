import React, { useMemo, useEffect, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DynaSelect from './DynaSelect';
import DynaSelectResource from './DynaSelectResource';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { isProduction } from '../../../forms/utils';

export default function DynaIclient(props) {
  const { connectionId, connectorId, connType, hideFromUI } = props;
  const dispatch = useDispatch();
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const [requestedOnLoad, setRequestedOnLoad] = useState(false);
  const iClients = useMemo(() => (connection && connection.iClients) || [], [
    connection,
  ]);

  useEffect(() => {
    if (!iClients.length && connectionId && connectorId && !requestedOnLoad) {
      setRequestedOnLoad(true);
      dispatch(actions.resource.connections.requestIClients(connectionId));
    }
  }, [connectionId, connectorId, dispatch, iClients.length, requestedOnLoad]);

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
