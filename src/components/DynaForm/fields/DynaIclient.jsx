import React, { useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DynaSelect from './DynaSelect';
import DynaSelectResource from './DynaSelectResource';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { isProduction } from '../../../forms/utils';

export default function DynaIclient(props) {
  const { connectionId, connectorId } = props;
  const dispatch = useDispatch();
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const iClients = (connection && connection.iClients) || [];

  useEffect(() => {
    if (!iClients.length && connectionId && connectorId) {
      dispatch(actions.resource.connections.requestIClients(connectionId));
    }
  }, [connectionId, connectorId, dispatch, iClients.length]);

  return (
    <Fragment>
      {connectorId && (
        <DynaSelect
          {...props}
          options={[
            {
              items: iClients.map(i => ({
                label: i.name,
                value: i._id,
              })),
            },
          ]}
        />
      )}
      {!isProduction() && !connectorId && <DynaSelectResource {...props} />}
    </Fragment>
  );
}
