import React, { useEffect, useCallback, useReducer } from 'react';
import { deepClone } from 'fast-json-patch';
import { withStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers/index';
import useConfirmDialog from '../../../ConfirmDialog';
import DynaAction from '../../../DynaForm/DynaAction';
import { PING_STATES } from '../../../../reducers/comms/ping';
import { PingMessage } from './TestButton';
import { useLoadingSnackbarOnSave } from '.';

const styles = theme => ({
  actions: {
    textAlign: 'right',
  },
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
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
        title: 'Confirm',
        message: `Test failed for this connection with the following error. ${commErrorMessage}. Do you want to save this connection regardless (i.e. in offline mode)?`,
        buttons: [
          {
            label: 'No',
            onClick: () => {
              handleSaveCompleted();
              handleCloseAndClearForm();
            },
          },
          {
            label: 'Yes',
            onClick: () => {
              handleSubmit(formValues);
              handleCloseAndClearForm();
            },
          },
        ],
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
  const { type, erroredMessage, formValues } = action;
  const { savingForm } = state;

  switch (type) {
    case 'setFormValues':
      return { ...state, savingForm: true, formValues };
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

const TestAndSaveButton = props => {
  const [formState, dispatchLocalAction] = useReducer(reducer, {});
  const {
    classes,
    resourceType,
    resourceId,
    label,
    disabled,
    ssLinkedConnectionId,
  } = props;
  const dispatch = useDispatch();
  const handleSaveForm = useCallback(
    values => {
      dispatch(
        actions.suiteScript.resourceForm.submit(
          resourceType,
          resourceId,
          values,
          undefined,
          false,
          undefined,
          ssLinkedConnectionId,
          undefined
        )
      );
    },
    [dispatch, resourceId, resourceType, ssLinkedConnectionId]
  );
  const handleTestConnection = useCallback(
    values =>
      dispatch(
        actions.suiteScript.resource.connections.test(
          resourceId,
          values,
          ssLinkedConnectionId
        )
      ),
    [dispatch, resourceId, ssLinkedConnectionId]
  );
  const testClear = useCallback(
    () =>
      dispatch(
        actions.suiteScript.resource.connections.testClear(
          resourceId,
          true,
          ssLinkedConnectionId
        )
      ),
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
  const { formValues, testInitiated, erroredMessage, savingForm } = formState;
  const saveTerminated = useSelector(state =>
    selectors.suiteScriptResourceFormSaveProcessTerminated(state, {
      resourceType,
      resourceId,
      ssLinkedConnectionId,
      undefined,
    })
  );
  const { handleSubmitForm } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave: handleSaveForm,
    resourceType,
  });

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
          commState === PING_STATES.ABORTED) &&
        message
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
    if (saveTerminated) dispatchLocalAction({ type: 'saveCompleted' });
  }, [saveTerminated]);

  return (
    <>
      <ConfirmDialog
        commErrorMessage={erroredMessage}
        formValues={formValues}
        handleCloseAndClearForm={() =>
          dispatchLocalAction({
            type: 'clearFormData',
          })}
        handleSaveCompleted={() =>
          dispatchLocalAction({ type: 'saveCompleted' })}
        handleSubmit={handleSubmitForm}
      />
      {/* Test button which hides the test button and shows the ping snackbar */}
      <PingMessage resourceId={resourceType} />
      {/* its a two step process we first test the connection then we save..therefore we disable testAndSave button during this period */}
      <DynaAction
        {...props}
        disabled={disabled || pingLoading || savingForm}
        onClick={values => {
          testClear();
          handleTestConnection(values);
          dispatchLocalAction({ type: 'setFormValues', formValues: values });
        }}
        className={classes.actionButton}
        size="small"
        variant="outlined"
        color="primary">
        {label || 'Save'}
      </DynaAction>
    </>
  );
};

export default withStyles(styles)(TestAndSaveButton);
