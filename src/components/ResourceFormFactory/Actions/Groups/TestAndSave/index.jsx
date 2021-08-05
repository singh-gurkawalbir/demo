import React, { useEffect, useCallback, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers/index';
import useConfirmDialog from '../../../../ConfirmDialog';
import { PING_STATES } from '../../../../../reducers/comms/ping';
import TestButton, { PingMessage } from './TestButton';
// import useHandleSubmit from '../hooks/useHandleSubmit';
import useHandleClickWhenValid from '../hooks/useHandleClickWhenValid';
import { FORM_SAVE_STATUS } from '../../../../../utils/constants';
import SaveAndCloseResourceForm from '../../../../SaveAndCloseButtonGroup/SaveAndCloseResourceForm';
import { getParentResourceContext } from '../../../../DynaForm/fields/DynaHttpRequestBody_afe';

const ConfirmDialog = props => {
  const {
    formValues,
    handleCloseAndClearForm,
    handleSubmit,
    handleSaveCompleted,
    commErrorMessage,
  } = props;
  const { confirmDialog } = useConfirmDialog();

  useEffect(() => {
    if (commErrorMessage) {
      confirmDialog({
        title: 'Confirm save',
        message: `Are you sure you want to save this connection? Test connection failed with the following error: ${commErrorMessage}.`,
        buttons: [
          {
            label: 'Save',
            onClick: () => {
              handleSubmit(formValues);
              handleCloseAndClearForm();
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
            onClick: () => {
              handleSaveCompleted();
              handleCloseAndClearForm();
            },
          },
        ],
        onDialogClose: () => {
          handleSaveCompleted();
          handleCloseAndClearForm();
        },
      });
    } else confirmDialog(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    commErrorMessage,
  ]);

  return null;
};

function reducer(state, action) {
  const { type, erroredMessage, formValues, closeAfterSave} = action;
  const { savingForm } = state;

  switch (type) {
    case 'setFormValues':
      return { ...state, closeAfterSave, savingForm: true, formValues };
    case 'testInitiated':
      return { ...state, testInitiated: true };
    case 'clearFormData':
      return { savingForm };
    case 'testErrored':
      return { ...state, erroredMessage };
    case 'saveCompleted':
      return {};
    default:
      throw new Error();
  }
}
export default function TestSaveAndClose(props) {
  const [formState, dispatchLocalAction] = useReducer(reducer, {});
  const {
    resourceType,
    resourceId,
    disabled,
    formKey,
    onCancel,
  } = props;
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const formParentContext = useSelector(
    state => selectors.formParentContext(state, formKey),
    shallowEqual
  );
  const { flowId, integrationId } = formParentContext || {};
  const { parentType, parentId } = getParentResourceContext(match.url) || {};

  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  const { formValues, testInitiated, erroredMessage, savingForm, closeAfterSave } = formState;
  const handleSaveForm = useCallback(
    () => {
      const newValues = { ...values };

      if (!newValues['/_borrowConcurrencyFromConnectionId']) {
        newValues['/_borrowConcurrencyFromConnectionId'] = undefined;
      }
      dispatch(actions.resourceForm.submit(
        resourceType,
        resourceId,
        newValues,
        null,
        !closeAfterSave
      ));
    },
    [closeAfterSave, dispatch, resourceId, resourceType, values]
  );
  const handleTestConnection = useCallback(() => {
    const newValues = { ...values };

    if (!newValues['/_borrowConcurrencyFromConnectionId']) {
      newValues['/_borrowConcurrencyFromConnectionId'] = undefined;
    }
    dispatch(actions.resource.connections.test(resourceId, newValues, { flowId, integrationId, parentType, parentId }));
  }, [dispatch, flowId, integrationId, parentType, parentId, resourceId, values]);

  const testClear = useCallback(
    () => dispatch(actions.resource.connections.testClear(resourceId, true)),
    [dispatch, resourceId]
  );
  const testConnectionCommState = useSelector(state =>
    selectors.testConnectionCommState(state, resourceId)
  );
  const pingLoading = testConnectionCommState.commState === PING_STATES.LOADING;
  const { commState, message } = testConnectionCommState;

  const saveTerminated = useSelector(state =>
    selectors.resourceFormSaveProcessTerminated(state, resourceType, resourceId)
  );
  const handleSubmitForm = useHandleClickWhenValid(formKey, handleSaveForm);
  const handleTestForm = useHandleClickWhenValid(formKey, handleTestConnection);

  useEffect(() => {
    if (commState === PING_STATES.LOADING && formValues) {
      dispatchLocalAction({ type: 'testInitiated' });
    }
  }, [commState, formValues]);

  useEffect(() => {
    if (testInitiated && commState) {
      if (commState === PING_STATES.SUCCESS) {
        handleSubmitForm();
        dispatchLocalAction({ type: 'clearFormData' });
        testClear();
      } else if (
        (commState === PING_STATES.ERROR ||
          commState === PING_STATES.ABORTED) && message
      ) {
        dispatchLocalAction({
          type: 'testErrored',
          erroredMessage: message,
        });
        testClear();
      }
    }
  }, [
    commState,
    handleSubmitForm,
    message,
    testClear,
    testInitiated,
  ]);

  useEffect(() => {
    if (saveTerminated) {
      dispatchLocalAction({ type: 'saveCompleted' });
    }
  }, [saveTerminated]);

  const handleCloseAndClearForm = useCallback(() => {
    dispatchLocalAction({
      type: 'clearFormData',
    });
  }, []);

  const handleSaveCompleted = useCallback(() => {
    dispatchLocalAction({ type: 'saveCompleted' });
  }, []);

  const handleTestAndSave = useCallback(closeAfterSave => {
    testClear();
    handleTestForm();
    dispatchLocalAction({ type: 'setFormValues', closeAfterSave, formValues: values });
  }, [handleTestForm, testClear, values]);

  const formSaveStatus = (savingForm) ? FORM_SAVE_STATUS.LOADING : FORM_SAVE_STATUS.COMPLETE;

  return (
    <>
      <ConfirmDialog
        commErrorMessage={erroredMessage}
        formValues={formValues}
        handleCloseAndClearForm={handleCloseAndClearForm}
        handleSaveCompleted={handleSaveCompleted}
        handleSubmit={handleSubmitForm}
      />
      {/* Test button which hides the test button and shows the ping snackbar */}
      <PingMessage resourceId={resourceType} />
      {/* its a two step process we first test the connection then we save..therefore we disable testAndSave button during this period */}

      <SaveAndCloseResourceForm
        disableOnCloseAfterSave
        formKey={formKey}
        disabled={disabled || pingLoading}
        status={formSaveStatus}
        onClose={onCancel}
        onSave={handleTestAndSave}
  />
      <TestButton
        disabled={savingForm}
        resourceId={resourceId}
        formKey={formKey}
      />
    </>
  );
}
