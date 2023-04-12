import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox, ListItemText, makeStyles, Typography } from '@material-ui/core';
import map from 'lodash/map';
import clsx from 'clsx';
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

const useStyles = makeStyles(theme => ({
  form: {
    padding: theme.spacing(0, 2, 2, 2),
    '& > div': {
      padding: theme.spacing(3, 0),
    },
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  flowName: {
    flex: 1,
  },
  optionFlowGroupName: {
    width: 200,
  },
  optionFlowGroupUnassigned: {
    fontStyle: 'italic',
  },
}));
const options = { ignoreUnusedConnections: true };
const SelectedOptionIml = ({ item, processedValue}) => {
  const classes = useStyles();

  return (
    <>
      {!item.disabled && (
        <Checkbox
          checked={processedValue.some(value => value === item.value)}
          color="primary"
        />
      )}
      <ListItemText primary={item.label || item.value} className={classes.flowName} />
      {item.groupName && (
        <Typography
          variant="body1"
          className={clsx(classes.optionFlowGroupName, item.groupName === UNASSIGNED_SECTION_NAME ? classes.optionFlowGroupUnassigned : '')}
        >
          {item.groupName}
        </Typography>
      )}
    </>
  );
};
export default function NotificationsSection({ integrationId, childId }) {
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const classes = useStyles();
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
    <div className={classes.root}>
      <PanelHeader title="Notifications" infoText={infoText.Notifications} contentId="notifications" />

      <LoadResources required integrationId={_integrationId} resources="notifications,flows,connections">
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
