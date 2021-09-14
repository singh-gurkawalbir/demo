import React, { useEffect, useCallback, useReducer } from 'react';
import { deepClone } from 'fast-json-patch';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers/index';
import useConfirmDialog from '../../../../../ConfirmDialog';
import { PING_STATES } from '../../../../../../reducers/comms/ping';
import TestButton, { PingMessage } from './TestButton';
import useHandleClickWhenValid from '../../../../../ResourceFormFactory/Actions/Groups/hooks/useHandleClickWhenValid';
import { FORM_SAVE_STATUS } from '../../../../../../utils/constants';
import SaveAndCloseResourceForm from '../../../../../SaveAndCloseButtonGroup/SaveAndCloseResourceForm';

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
  }, [
    commErrorMessage,
    confirmDialog,
    formValues,
    handleCloseAndClearForm,
    handleSaveCompleted,
    handleSubmit,
  ]);

  return null;
};

function reducer(state, action) {
  const { type, erroredMessage, formValues, closeAfterSave } = action;
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

// TODO @Raghu: Refactor this component and push complexity to sagas
export default function TestAndSave(props) {
  const [formState, dispatchLocalAction] = useReducer(reducer, {});
  const {
    resourceType,
    resourceId,
    disabled,
    formKey,
    ssLinkedConnectionId,
    onCancel,
  } = props;

  const dispatch = useDispatch();
  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const { formValues, testInitiated, erroredMessage, savingForm, closeAfterSave } = formState;

  const handleSaveForm = useCallback(
    () =>
      dispatch(actions.suiteScript.resourceForm.submit(
        ssLinkedConnectionId,
        undefined,
        resourceType,
        resourceId,
        values,
        undefined,
        !closeAfterSave,
        undefined,
      )),
    [closeAfterSave, dispatch, resourceId, resourceType, ssLinkedConnectionId, values]
  );
  const handleTestConnection = useCallback(() => {
    dispatch(actions.suiteScript.resource.connections.test(
      resourceId,
      values,
      ssLinkedConnectionId
    ));
  },
  [dispatch, resourceId, ssLinkedConnectionId, values]);
  const testClear = useCallback(
    () => dispatch(actions.suiteScript.resource.connections.testClear(
      resourceId,
      true,
      ssLinkedConnectionId
    )),
    [dispatch, resourceId, ssLinkedConnectionId]
  );
  const testConnectionCommState = useSelector(state =>
    selectors.suiteScriptTestConnectionCommState(
      state,
      resourceId,
      ssLinkedConnectionId
    )
  );
  const pingLoading = testConnectionCommState.commState === PING_STATES.LOADING;
  const { commState, message } = testConnectionCommState;
  const saveTerminated = useSelector(state =>
    selectors.suiteScriptResourceFormSaveProcessTerminated(state, {
      resourceType,
      resourceId,
      ssLinkedConnectionId,
    })
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
        handleSubmitForm(deepClone(formValues));
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
    formValues,
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

  const formSaveStatus = (savingForm || pingLoading) ? FORM_SAVE_STATUS.LOADING : FORM_SAVE_STATUS.COMPLETE;

  // TODO: @Surya Do we need to pass all props to DynaAction?
  // Please revisit after form refactor
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
        formKey={formKey}
        disableOnCloseAfterSave
        disabled={disabled}
        status={formSaveStatus}
        onClose={onCancel}
        onSave={handleTestAndSave}
        />
      <TestButton
        resourceId={resourceId}
        ssLinkedConnectionId={ssLinkedConnectionId}
        formKey={formKey}
      />
    </>
  );
}

