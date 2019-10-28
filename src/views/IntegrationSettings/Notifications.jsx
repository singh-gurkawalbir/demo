import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import * as selectors from '../../reducers';
import actions from '../../actions';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import LoadResources from '../../components/LoadResources';

export default function Notifications(props) {
  const { match } = props;
  const { integrationId, storeId } = match.params;
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const {
    connections = [],
    flows = [],
    connectionValues = [],
    flowValues = [],
  } =
    useSelector(state =>
      selectors.integrationResources(state, integrationId, storeId)
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
        label: 'Connections',
        defaultValue: connectionValues,
        options: [{ items: connectionOps }],
      },
      flows: {
        id: 'flows',
        name: 'flows',
        type: 'multiselect',
        valueDelimiter: ',',
        label: 'Job Errors:',
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

    if (flowList.includes(integrationId)) {
      notifications.push({ _integrationId: integrationId, subscribed: true });
    } else {
      notifications.push({ _integrationId: integrationId, subscribed: false });
    }

    flows.forEach(flow => {
      if (flowList.includes(flow._id)) {
        notifications.push({ _flowId: flow._id, subscribed: true });
      } else {
        notifications.push({ _flowId: flow._id, subscribed: false });
      }
    });
    connections.forEach(connection => {
      if (connList.includes(connection._id)) {
        notifications.push({ _connectionId: connection._id, subscribed: true });
      } else {
        notifications.push({
          _connectionId: connection._id,
          subscribed: false,
        });
      }
    });

    dispatch(actions.resource.notifications.update(notifications));
    setCount(count => count + 1);
  };

  return (
    <LoadResources required resources="notifications,flows,connections">
      <DynaForm fieldMeta={fieldMeta} key={count} render>
        <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
      </DynaForm>
    </LoadResources>
  );
}
