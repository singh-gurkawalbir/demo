import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import actions from '../../../../actions';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../components/drawer/Right/DrawerFooter';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import { selectors } from '../../../../reducers';
import { isJsonString } from '../../../../utils/string';
import useSaveStatusIndicator from '../../../../hooks/useSaveStatusIndicator';
import { STANDALONE_INTEGRATION, USER_ACCESS_LEVELS } from '../../../../utils/constants';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import ButtonGroup from '../../../../components/ButtonGroup';
import LoadResources from '../../../../components/LoadResources';
import getSettingsMetadata from './metadata';
import EditorDrawer from '../../../../components/AFE2/Drawer';

function Settings({
  flowId,
  integrationId,
  resourceType,
  resourceId,
}) {
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  ).merged;
  const dispatch = useDispatch();
  const history = useHistory();
  const [remountKey, setRemountKey] = useState(1);
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  // Note: This selector is used to determine when can user save settings fields
  // As incase of EM2.0 we have a notification toggle to be shown, in which case
  // we restrict calling settings api when not allowed
  const hasFlowSettingsAccess = useSelector(state => {
    const isMonitorLevelAccess = selectors.isFormAMonitorLevelAccess(state, integrationId);

    if (isMonitorLevelAccess) return false;
    const { accessLevel: accessLevelIntegration } = selectors.resourcePermissions(
      state,
      'integrations',
      integrationId
    );
    const isIntegrationApp = !!flow?._connectorId;

    if (!isIntegrationApp) {
      return true;
    }
    // Incase of Integration app, only owner, admin & manage users have cLocked fields to edit
    if ([USER_ACCESS_LEVELS.ACCOUNT_OWNER, USER_ACCESS_LEVELS.ACCOUNT_MANAGE, USER_ACCESS_LEVELS.ACCOUNT_ADMIN].includes(accessLevelIntegration)) {
      return true;
    }

    // IAs not accessible to other users
    return false;
  });
  const isFlowSubscribed = useSelector(state =>
    selectors.isFlowSubscribedForNotification(state, flow._id)
  );

  const nextDataFlows = useSelectorMemo(selectors.mkNextDataFlowsForFlow, flow);
  const handleClose = useCallback(() => history.goBack(), [history]);
  const fieldMeta = getSettingsMetadata({ flow, nextDataFlows, isFlowSubscribed, isUserInErrMgtTwoDotZero});
  const validationHandler = field => {
    // Incase of invalid json throws error to be shown on the field

    if (field && field.id === 'settings') {
      if (
        field.value &&
        typeof field.value === 'string' &&
        !isJsonString(field.value)
      ) {
        return 'Settings must be a valid JSON';
      }
    }
  };

  const updateFlowNotification = useCallback(notifyOnFlowError => {
    if (isFlowSubscribed !== notifyOnFlowError) {
      dispatch(actions.resource.notifications.updateFlow(flow._id, notifyOnFlowError));
    }
  }, [dispatch, isFlowSubscribed, flow._id]);

  const handleSubmit = useCallback(
    formVal => {
      if (isUserInErrMgtTwoDotZero) {
        const notifyOnFlowError = formVal.notifyOnFlowError === 'true';

        updateFlowNotification(notifyOnFlowError);
      }
      if (!hasFlowSettingsAccess) {
        return;
      }
      const patchSet = [
        {
          op: 'replace',
          path: '/name',
          value: formVal.name,
        },
        {
          op: 'replace',
          path: '/description',
          value: formVal.description,
        },
        {
          op: 'replace',
          path: '/_runNextFlowIds',
          value: formVal._runNextFlowIds,
        },
      ];

      if (integrationId && integrationId !== STANDALONE_INTEGRATION.id) {
        patchSet.push({
          op: 'replace',
          path: '/_integrationId',
          value: integrationId,
        });
      }

      if (Object.hasOwnProperty.call(formVal, 'settings')) {
        let value = formVal?.settings;

        if (isJsonString(value)) {
          value = JSON.parse(value);
        }
        patchSet.push({
          op: 'replace',
          path: '/settings',
          value,
        });
      }

      dispatch(actions.resource.patchStaged(flow._id, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flow._id, 'value'));
    },
    [dispatch, integrationId, flow._id, isUserInErrMgtTwoDotZero, updateFlowNotification, hasFlowSettingsAccess]
  );

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: (isUserInErrMgtTwoDotZero && !hasFlowSettingsAccess) ? '/notifications' : `/flows/${flow._id}`,
      onSave: handleSubmit,
      onClose: handleClose,
    }
  );

  const validateAndSubmit = useCallback(closeOnSave => formVal => {
    if (Object.hasOwnProperty.call(formVal, 'settings')) {
      // dont submit the form if there is validation error
      // REVIEW: re-visit once Surya's form PR is merged
      if (formVal && formVal.settings && formVal.settings.__invalid) {
        return;
      }
    }
    submitHandler(closeOnSave)(formVal);
  }, [submitHandler]);

  useEffect(() => {
    setRemountKey(remountKey => remountKey + 1);
  }, [isFlowSubscribed]);

  const formKey = useFormInitWithPermissions({
    fieldMeta,
    integrationId,
    resourceType,
    resourceId,
    validationHandler,
    remount: remountKey,
  });

  useEffect(() => {
    if (formKey && isUserInErrMgtTwoDotZero) {
      dispatch(
        actions.form.forceFieldState(formKey)('notifyOnFlowError', { disabled: false })
      );
    }
  }, [formKey, dispatch, isUserInErrMgtTwoDotZero]);

  return (
    <LoadResources required resources="notifications">
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>

      <DrawerFooter>
        <ButtonGroup>
          <DynaSubmit
            formKey={formKey}
            resourceType={resourceType}
            resourceId={resourceId}
            data-test="saveFlowSettings"
            onClick={validateAndSubmit()}
            disabled={disableSave}>
            {defaultLabels.saveLabel}
          </DynaSubmit>
          <DynaSubmit
            formKey={formKey}
            resourceType={resourceType}
            resourceId={resourceId}
            data-test="saveAndCloseFlowSettings"
            onClick={validateAndSubmit(true)}
            disabled={disableSave}
            color="secondary">
            {defaultLabels.saveAndCloseLabel}
          </DynaSubmit>
          <Button onClick={handleClose} variant="text" color="primary">
            Cancel
          </Button>
        </ButtonGroup>
      </DrawerFooter>
    </LoadResources>
  );
}

export default function SettingsDrawer(props) {
  return (
    <RightDrawer
      path="settings"
      width="medium">
      <DrawerHeader title="Settings" />
      <Settings {...props} />
      <EditorDrawer />
    </RightDrawer>
  );
}
