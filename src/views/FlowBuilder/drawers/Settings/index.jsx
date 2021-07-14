import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import DynaForm from '../../../../components/DynaForm';
import actions from '../../../../actions';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../components/drawer/Right/DrawerFooter';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import { selectors } from '../../../../reducers';
import { isJsonString } from '../../../../utils/string';
import { emptyObject, FORM_SAVE_STATUS, STANDALONE_INTEGRATION, USER_ACCESS_LEVELS } from '../../../../utils/constants';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import LoadResources from '../../../../components/LoadResources';
import getSettingsMetadata from './metadata';
import EditorDrawer from '../../../../components/AFE/Drawer';
import SaveAndCloseButtonGroupAuto from '../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';

const formKey = 'flowbuildersettings';

function Settings({
  flowId,
  integrationId,
  resourceType,
  resourceId,
  dataPublic,
}) {
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  )?.merged || emptyObject;
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
      dispatch(actions.resource.commitStaged('flows', flow._id, 'value', null, null, formKey));
    },
    [dispatch, integrationId, flow._id, isUserInErrMgtTwoDotZero, updateFlowNotification, hasFlowSettingsAccess]
  );

  const formValues = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const validateAndSubmit = useCallback(() => {
    if (Object.hasOwnProperty.call(formValues, 'settings')) {
      // dont submit the form if there is validation error
      // REVIEW: re-visit once Surya's form PR is merged
      if (formValues && formValues.settings && formValues.settings.__invalid) {
        return;
      }
    }
    handleSubmit(formValues);
  }, [formValues, handleSubmit]);

  useEffect(() => {
    setRemountKey(remountKey => remountKey + 1);
  }, [isFlowSubscribed]);

  const remountFn = useCallback(() => {
    setRemountKey(remountKey => remountKey + 1);
  }, []);

  useFormInitWithPermissions({
    fieldMeta,
    integrationId,
    resourceType,
    resourceId,
    validationHandler,
    formKey,
    remount: remountKey,
  });

  useEffect(() => {
    if (formKey && isUserInErrMgtTwoDotZero) {
      dispatch(
        actions.form.forceFieldState(formKey)('notifyOnFlowError', { disabled: false })
      );
    }
  }, [dispatch, isUserInErrMgtTwoDotZero]);

  return (
    <LoadResources required resources="notifications">
      <DrawerContent>
        <DynaForm dataPublic={dataPublic} formKey={formKey} />
      </DrawerContent>

      <DrawerFooter>
        <SaveAndCloseButtonGroupAuto
          formKey={formKey}
          onSave={validateAndSubmit}
          onClose={handleClose}
          remountAfterSaveFn={remountFn}
          />
      </DrawerFooter>
    </LoadResources>
  );
}

export default function SettingsDrawer(props) {
  const status = useSelector(state =>
    selectors.asyncTaskStatus(state, formKey));

  const disabled = status === FORM_SAVE_STATUS.LOADING;

  return (
    <RightDrawer
      path="settings"
      width="medium">
      <DrawerHeader title="Settings" disableClose={disabled} />
      <Settings {...props} />
      <EditorDrawer />
    </RightDrawer>
  );
}
