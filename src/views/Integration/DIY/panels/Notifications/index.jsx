import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import LoadResources from '../../../../../components/LoadResources';
import PanelHeader from '../../../../../components/PanelHeader';
import { STANDALONE_INTEGRATION } from '../../../../../utils/constants';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';

const useStyles = makeStyles(theme => ({
  form: {
    padding: theme.spacing(0, 2, 2, 2),
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

export const useGetFlowOps = ({integrationId, flows}) => useMemo(() => {
  const initialValue = integrationId !== STANDALONE_INTEGRATION.id ? [{ value: integrationId, label: 'All flows' }] : [];

  return flows.reduce((finalOps, f) => {
    finalOps.push({ value: f._id, label: f.name });

    return finalOps;
  }, initialValue);
}, [integrationId, flows]);

export default function NotificationsSection({ integrationId, childId }) {
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const classes = useStyles();
  const _integrationId = childId || integrationId;
  const {
    connections = [],
    flows = [],
    connectionValues = [],
    flowValues = [],
  } =
    useSelector(state =>
      selectors.integrationNotificationResources(state, _integrationId),
    shallowEqual
    );

  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  const flowHash = flowValues.sort().join('');
  const connHash = connectionValues.sort().join('');
  const connectionOps = connections.map(c => ({ value: c._id, label: c.name }));
  const flowOps = useGetFlowOps({integrationId: _integrationId, flows});

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
        label: `Notify me on ${isUserInErrMgtTwoDotZero ? 'flow' : 'job'} error`,
        defaultValue: flowValues,
        options: [{ items: flowOps }],
        selectAllIdentifier: _integrationId,
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
    const resourcesToUpdate = {
      subscribedConnections: formVal.connections,
      subscribedFlows: formVal.flows,
    };

    dispatch(actions.resource.notifications.updateTile(resourcesToUpdate, _integrationId));

    setCount(count => count + 1);
  };

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
