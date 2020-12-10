import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DynaSelect from './DynaSelect';
import DynaSelectResource from './DynaSelectResource';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { isProduction } from '../../../forms/formFactory/utils';

export const useLoadIClientOnce = ({ connectionId, disableLoad = false }) => {
  const iClients = useSelector(state =>
    selectors.iClients(state, connectionId)
  );
  const dispatch = useDispatch();
  const [requestedOnLoad, setRequestedOnLoad] = useState(disableLoad);

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
    <>
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
    </>
  );
}
