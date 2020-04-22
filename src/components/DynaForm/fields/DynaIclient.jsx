import React, { useEffect, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DynaSelect from './DynaSelect';
import DynaSelectResource from './DynaSelectResource';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { isProduction } from '../../../forms/utils';

export const useLoadIClientOnce = ({ connectionId, disableLoad = false }) => {
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const dispatch = useDispatch();
  const [requestedOnLoad, setRequestedOnLoad] = useState(disableLoad);
  const iClients = (connection && connection.iClients) || [];

  useEffect(() => {
    if (!iClients.length && connectionId && !requestedOnLoad) {
      setRequestedOnLoad(true);
      dispatch(actions.resource.connections.requestIClients(connectionId));
    }
  }, [iClients.length, connectionId, requestedOnLoad, dispatch]);

  return { iClients };
};

export default function DynaIclient(props) {
  const { connectionId, connectorId, connType, hideFromUI } = props;
  const { iClients } = useLoadIClientOnce({
    connectionId,
    disableLoad: !connectorId,
  });

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
