import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import LoadResources from '../../../../../components/LoadResources';

export default function NotificationsSection({ integrationId }) {
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const {
    connections = [],
    flows = [],
    connectionValues = [],
    flowValues = [],
  } =
    useSelector(state =>
      selectors.integrationResources(state, integrationId)
    ) || {};
  const flowHash = flowValues.sort().join('');
  const connHash = connectionValues.sort().join('');
  const connectionOps = connections.map(c => ({ value: c._id, label: c.name }));
  const flowOps = flows.map(c => ({ value: c._id, label: c.name }));
  const fieldMeta = {
    fieldMap: {
      connections: {
        id: 'connections',
        name: 'connections',
        type: 'multiselect',
        valueDelimiter: ',',
        label: 'Notify me when connection goes offline',
        defaultValue: connectionValues,
        options: [{ items: connectionOps }],
      },
      flows: {
        id: 'flows',
        name: 'flows',
        type: 'multiselect',
        valueDelimiter: ',',
        label: 'Notify me on job error',
        defaultValue: flowValues,
        options: [{ items: flowOps }],
      },
    },
    layout: {
      fields: ['flows', 'connections'],
    },
  };

  useEffect(() => {
    setCount(count => count + 1);
  }, [flowHash, connHash]);

  const handleSubmit = formVal => {
    const { connections: connList, flows: flowList } = formVal;
    const notifications = [];

    notifications.push({
      _integrationId: integrationId,
      subscribed: flowList.includes(integrationId),
    });

    flows.forEach(flow => {
      notifications.push({
        _flowId: flow._id,
        subscribed: flowList.includes(flow._id),
      });
    });
    connections.forEach(connection => {
      notifications.push({
        _connectionId: connection._id,
        subscribed: connList.includes(connection._id),
      });
    });

    dispatch(actions.resource.notifications.update(notifications));
    setCount(count => count + 1);
  };

  return (
    <Fragment>
      <Typography>Notifications</Typography>

      <LoadResources required resources="notifications,flows,connections">
        <DynaForm fieldMeta={fieldMeta} key={count} render>
          <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
        </DynaForm>
      </LoadResources>
    </Fragment>
  );
}
