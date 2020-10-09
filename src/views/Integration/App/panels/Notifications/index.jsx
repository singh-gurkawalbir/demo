import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import LoadResources from '../../../../../components/LoadResources';
import PanelHeader from '../../../../../components/PanelHeader';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { useGetFlowOps } from '../../../DIY/panels/Notifications';

const useStyles = makeStyles(theme => ({
  form: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '& > div': {
      padding: theme.spacing(3, 0),
    },
  },
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    paddingBottom: theme.spacing(1),
  },
}));

export default function NotificationsSection({ integrationId, storeId }) {
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
      selectors.integrationNotificationResources(state, integrationId, { storeId })
    ) || {};
  const flowHash = flowValues.sort().join('');
  const connHash = connectionValues.sort().join('');
  const connectionOps = connections.map(c => ({ value: c._id, label: c.name }));
  const flowOps = useGetFlowOps({integrationId, flows});

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
        selectAllIdentifier: integrationId,
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
    const resourcesToUpdate = { subscribedConnections: formVal.connections, subscribedFlows: formVal.flows};

    dispatch(actions.resource.notifications.updateTile(resourcesToUpdate, integrationId, { storeId }));
    setCount(count => count + 1);
  };

  const infoTextNotifications =
'Get notified via email if your flow encounters an error, or if a connection goes offline. These notifications will only be sent to you. If any other users in your account wish to receive the same notifications, then they will need to subscribe from their account.';
  const formKey = useFormInitWithPermissions({
    fieldMeta,
    remount: count,
    integrationId,
  });

  return (
    <div className={classes.root}>
      <PanelHeader title="Notifications" infoText={infoTextNotifications} />

      <LoadResources required resources="notifications,flows,connections">
        <div className={classes.form}>
          <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
          <DynaSubmit formKey={formKey} onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </div>
      </LoadResources>
    </div>
  );
}
