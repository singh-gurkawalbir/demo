import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import LoadResources from '../../../../../components/LoadResources';
import PanelHeader from '../../../../../components/PanelHeader';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';

const useStyles = makeStyles(theme => ({
  form: {
    paddingLeft: theme.spacing(2),
    '& > div': {
      padding: theme.spacing(3, 0),
    },
  },
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function NotificationsSection({ integrationId }) {
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const classes = useStyles();
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
        helpKey: 'notifications.connections',
        name: 'connections',
        type: 'multiselect',
        valueDelimiter: ',',
        label: 'Notify me when connection goes offline',
        defaultValue: connectionValues,
        options: [{ items: connectionOps }],
      },
      flows: {
        id: 'flows',
        helpKey: 'notifications.jobErrors',
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

    flows
      .filter(f => f._id !== integrationId)
      .forEach(flow => {
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

  const infoTextNotifications =
    'Get email notifications when your flows encounter any errors as well as whenever one of the connections your flows use goes offline, so you can fix the problem quickly. These notifications are only sent to you; each user will need to enable their own notifications.';
  const formKey = useFormInitWithPermissions({ fieldsMeta: fieldMeta });

  return (
    <div className={classes.root}>
      <PanelHeader title="Notifications" infoText={infoTextNotifications} />

      <LoadResources required resources="notifications,flows,connections">
        <div className={classes.form}>
          <DynaForm formKey={formKey} fieldMeta={fieldMeta} key={count} />

          <DynaSubmit formKey={formKey} onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </div>
      </LoadResources>
    </div>
  );
}
