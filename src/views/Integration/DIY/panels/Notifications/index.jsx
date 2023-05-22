import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox, ListItemText, Typography, Box } from '@mui/material';
import map from 'lodash/map';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import LoadResources from '../../../../../components/LoadResources';
import PanelHeader from '../../../../../components/PanelHeader';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import useGetNotificationOptions from '../../../../../hooks/useGetNotificationOptions';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { UNASSIGNED_SECTION_NAME } from '../../../../../constants';
import infoText from '../infoText';
import customCloneDeep from '../../../../../utils/customCloneDeep';

const options = { ignoreUnusedConnections: true };
const SelectedOptionIml = ({ item, processedValue}) =>
  (
    <>
      {!item.disabled && (
        <Checkbox
          checked={processedValue.some(value => value === item.value)}
          color="primary"
        />
      )}
      <ListItemText primary={item.label || item.value} sx={{ flex: 1 }} />
      {item.groupName && (
        <Typography
          variant="body1"
          sx={{
            width: 200,
            ...(item.groupName === UNASSIGNED_SECTION_NAME && {
              fontStyle: 'italic',
            }),
          }}
       >
          {item.groupName}
        </Typography>
      )}
    </>
  );

export default function NotificationsSection({ integrationId, childId }) {
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const _integrationId = childId || integrationId;
  const notifications = useSelectorMemo(
    selectors.mkIntegrationNotificationResources,
    _integrationId, options);

  const { flowValues = [], connectionValues = [], flows, connections } = notifications;

  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const { flowOps, connectionOps } = useGetNotificationOptions({ integrationId: _integrationId, flows, connections });

  // TODO: Remove below hashing logic once mkIntegrationNotificationResources is optimised.
  const flowHash = customCloneDeep(flowValues).sort().join('');
  const connHash = customCloneDeep(connectionValues).sort().join('');
  const connOptionsHash = map(connectionOps, 'value').join('');
  const flowOptionsHash = map(flowOps, 'value').join('');

  const fieldMeta = {
    fieldMap: {
      flows: {
        id: 'flows',
        helpKey: 'notifications.jobErrors',
        noApi: true,
        name: 'flows',
        type: 'multiselect',
        valueDelimiter: ',',
        label: `Notify me of ${isUserInErrMgtTwoDotZero ? 'flow' : 'job'} error`,
        defaultValue: flowValues,
        options: [{ items: flowOps }],
        SelectedOptionIml,
        selectAllIdentifier: _integrationId,
      },
      connections: {
        id: 'connections',
        helpKey: 'notifications.connections',
        noApi: true,
        name: 'connections',
        type: 'multiselect',
        valueDelimiter: ',',
        label: 'Notify me when connection goes offline',
        defaultValue: connectionValues,
        options: [{ items: connectionOps }],
      },
    },
  };

  useEffect(() => {
    setCount(count => count + 1);
  }, [flowHash, connHash, connOptionsHash, flowOptionsHash]);

  const handleSubmit = useCallback(formVal => {
    const resourcesToUpdate = {
      subscribedConnections: formVal.connections,
      subscribedFlows: formVal.flows,
    };

    dispatch(actions.resource.notifications.updateTile(resourcesToUpdate, _integrationId));
    setCount(count => count + 1);
  }, [_integrationId, dispatch]);

  const formKey = useFormInitWithPermissions({
    fieldMeta,
    remount: count,
    skipMonitorLevelAccessCheck: true,
  });

  return (
    <Box
      sx={{
        backgroundColor: theme => theme.palette.background.paper,
        border: '1px solid',
        borderColor: theme => theme.palette.secondary.lightest,
      }}>
      <PanelHeader title="Notifications" infoText={infoText.Notifications} contentId="notifications" />

      <LoadResources required integrationId={_integrationId} resources="notifications,flows,connections">
        <Box
          sx={{
            padding: theme => theme.spacing(0, 2, 2, 2),
            '& > div': {
              padding: theme => theme.spacing(3, 0),
            },
          }}
          >
          <DynaForm formKey={formKey} />

          <DynaSubmit formKey={formKey} onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </Box>
      </LoadResources>
    </Box>
  );
}
