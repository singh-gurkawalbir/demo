import React, { useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { makeStyles, Button } from '@material-ui/core';
import RightDrawer from '../../../drawer/Right';
import { selectors } from '../../../../reducers';
import { useGetFlowOps } from '../../../../views/Integration/DIY/panels/Notifications';
import notificationsMetadata from './metadata';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../../DynaForm/DynaSubmit';
import LoadResources from '../../../LoadResources';
import actions from '../../../../actions';
import useSaveStatusIndicator from '../../../../hooks/useSaveStatusIndicator';

const useStyles = makeStyles(theme => ({
  actionContainer: {
    display: 'flex',
  },
  footer: {
    padding: theme.spacing(1),
    position: 'absolute',
    bottom: 120,
    height: 60,
    width: '90%',
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
  actionButton: {
    marginRight: theme.spacing(1),
  },
}));

function ManageNotifications({ integrationId, storeId, onClose }) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { userEmail } = match.params;
  const users = useSelector(state => selectors.availableUsersList(state, integrationId));
  const notifications = useSelector(state =>
    selectors.integrationNotificationResources(state, integrationId, { storeId, userEmail }),
  shallowEqual
  );

  const { flowValues = [], connectionValues = [], flows, connections } = notifications;

  const isValidUserEmail = !!users.find(user => user.sharedWithUser.email === userEmail);

  if (!isValidUserEmail) {
    onClose();
  }

  const connectionOps = connections.map(c => ({ value: c._id, label: c.name }));
  const flowOps = useGetFlowOps({integrationId, flows});

  const fieldMeta = notificationsMetadata({
    connectionValues,
    connectionOps,
    flowValues,
    flowOps,
    integrationId,
  });

  const formKey = useFormInitWithPermissions({
    fieldMeta,
    integrationId,
  });

  const handleSubmit = useCallback(formVal => {
    const resourcesToUpdate = {
      subscribedConnections: formVal.connections,
      subscribedFlows: formVal.flows,
    };

    dispatch(actions.resource.notifications.updateTile(resourcesToUpdate, integrationId, { storeId, userEmail }));
  }, [dispatch, integrationId, storeId, userEmail]);

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: '/notifications',
      method: 'PUT',
      onSave: handleSubmit,
      onClose,
    }
  );

  return (
    <>
      <LoadResources required resources="notifications,flows,connections">
        <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
        <div className={classes.footer}>
          <DynaSubmit
            formKey={formKey}
            onClick={submitHandler()}
            color="primary"
            className={classes.actionButton}
            data-test="saveFlowSchedule"
            disabled={disableSave}>
            {defaultLabels.saveLabel}
          </DynaSubmit>
          <DynaSubmit
            formKey={formKey}
            onClick={submitHandler(true)}
            className={classes.actionButton}
            color="secondary"
            data-test="saveAndCloseFlowSchedule"
            disabled={disableSave}>
            {defaultLabels.saveAndCloseLabel}
          </DynaSubmit>
          <Button onClick={onClose} variant="text" color="primary">
            Cancel
          </Button>
        </div>
      </LoadResources>
    </>
  );
}

export default function ManageNotificationsDrawer({ integrationId, storeId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const handleClose = useCallback(() => history.replace(`${match.url}`), [history, match]);

  return (
    <RightDrawer
      path=":userEmail/manageNotifications"
      title="Manage notifications"
      variant="temporary"
      width="medium"
      hideBackButton>
      <ManageNotifications integrationId={integrationId} storeId={storeId} onClose={handleClose} />
    </RightDrawer>
  );
}
