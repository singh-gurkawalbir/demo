import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import LoadResources from '../../../../../components/LoadResources';
import PanelHeader from '../../../../../components/PanelHeader';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import useGetNotificationOptions from '../../../../../hooks/useGetNotificationOptions';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

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

export default function NotificationsSection({ integrationId, childId }) {
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const classes = useStyles();

  const notificationsConfig = useMemo(() => ({ childId, ignoreUnusedConnections: true }), [childId]);
  const notifications = useSelectorMemo(
    selectors.mkIntegrationNotificationResources,
    integrationId,
    notificationsConfig);

  const { flowValues = [], connectionValues = [], flows, connections } = notifications;

  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const { flowOps, connectionOps } = useGetNotificationOptions({ integrationId, flows, connections });

  const fieldMeta = {
    fieldMap: {
      flows: {
        id: 'flows',
        helpKey: 'notifications.jobErrors',
        name: 'flows',
        type: 'multiselect',
        valueDelimiter: ',',
        label: `Notify me on ${isUserInErrMgtTwoDotZero ? 'flow' : 'job'} error`,
        defaultValue: flowValues,
        options: [{ items: flowOps }],
        selectAllIdentifier: integrationId,
      },
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
    },
    layout: {
      fields: ['flows', 'connections'],
    },
  };

  useEffect(() => {
    setCount(count => count + 1);
  }, [flowValues, connectionValues, flows, connections]);

  const handleSubmit = useCallback(formVal => {
    const resourcesToUpdate = { subscribedConnections: formVal.connections, subscribedFlows: formVal.flows};

    dispatch(actions.resource.notifications.updateTile(resourcesToUpdate, integrationId, { childId }));
    setCount(count => count + 1);
  }, [integrationId, dispatch, childId]);

  const infoTextNotifications =
'Get notified via email if your flow encounters an error, or if a connection goes offline. These notifications will only be sent to you. If any other users in your account wish to receive the same notifications, then they will need to subscribe from their account.';
  const formKey = useFormInitWithPermissions({
    fieldMeta,
    remount: count,
    skipMonitorLevelAccessCheck: true,
  });

  return (
    <div className={classes.root}>
      <PanelHeader title="Notifications" infoText={infoTextNotifications} />

      <LoadResources required resources="notifications,flows,connections,exports,imports">
        <div className={classes.form}>
          <DynaForm formKey={formKey} />
          <DynaSubmit formKey={formKey} onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </div>
      </LoadResources>
    </div>
  );
}
