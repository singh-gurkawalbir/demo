import { Fragment, useEffect, useCallback, useReducer } from 'react';
import { deepClone } from 'fast-json-patch';
import { withStyles } from '@material-ui/core/styles';
// import DoneIcon from '@material-ui/icons/Done';
import { useDispatch, useSelector } from 'react-redux';
// import Chip from '@material-ui/core/Chip';
// import CircularProgress from '@material-ui/core/CircularProgress';
import actions from '../../../actions';
import * as selectors from '../../../reducers/index';
import { COMM_STATES } from '../../../reducers/comms';
import GenericConfirmDialog from '../../ConfirmDialog';
import DynaAction from '../../DynaForm/DynaAction';
import TestButton from './TestButton';

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

  return (
    <GenericConfirmDialog
      title="Confirm"
      message={`Test failed for this connection with the following error. ${commErrorMessage}. Do you want to save this connection regardless (i.e. in offline mode)?`}
      buttons={[
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
      ]}
    />
  );
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
  const { classes, resourceType, resourceId, label, disabled } = props;
  const dispatch = useDispatch();
  const handleSubmitForm = useCallback(
    values =>
      dispatch(actions.resourceForm.submit(resourceType, resourceId, values)),
    [dispatch, resourceId, resourceType]
  );
  const handleTestConnection = values =>
    dispatch(actions.resource.connections.test(resourceId, values));
  const clearComms = useCallback(() => dispatch(actions.clearComms()), [
    dispatch,
  ]);
  const testConnectionCommState = useSelector(state =>
    selectors.testConnectionCommState(state)
  );
  const pingLoading = testConnectionCommState.commState === COMM_STATES.LOADING;
  const { commState, message } = testConnectionCommState;
  const { formValues, testInitiated, erroredMessage, savingForm } = formState;

  useEffect(() => {
    if (commState === COMM_STATES.LOADING && formValues) {
      dispatchLocalAction({ type: 'testInitiated' });
    }
  }, [commState, formValues]);

  useEffect(() => {
    if (testInitiated && commState) {
      if (commState === COMM_STATES.SUCCESS) {
        handleSubmitForm(deepClone(formValues));
        dispatchLocalAction({ type: 'clearFormData' });
        clearComms();
      } else if (commState === COMM_STATES.ERROR && message) {
        dispatchLocalAction({
          type: 'testErrored',
          erroredMessage: message,
        });
        clearComms();
      }
    }
  }, [
    testInitiated,
    commState,
    formValues,
    clearComms,
    message,
    handleSubmitForm,
  ]);
  const resourceFormState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );

  useEffect(() => {
    if (resourceFormState.submitComplete)
      dispatchLocalAction({ type: 'saveCompleted' });
  }, [resourceFormState.submitComplete]);

  return (
    <Fragment>
      {erroredMessage && (
        <ConfirmDialog
          commErrorMessage={erroredMessage}
          formValues={formValues}
          handleCloseAndClearForm={() =>
            dispatchLocalAction({ type: 'clearFormData' })
          }
          handleSaveCompleted={() =>
            dispatchLocalAction({ type: 'saveCompleted' })
          }
          handleSubmit={handleSubmitForm}
        />
      )}
      {/* Test button which hides the test button and shows the ping snackbar */}
      <TestButton {...props} isTestOnly={false} />
      {/* its a two step process we first test the connection then we save..therefore we disable testAndSave button during this period */}
      <DynaAction
        {...props}
        disabled={disabled || pingLoading || savingForm}
        onClick={values => {
          clearComms();
          handleTestConnection(values);
          dispatchLocalAction({ type: 'setFormValues', formValues: values });
        }}
        className={classes.actionButton}
        size="small"
        variant="outlined"
        color="primary">
        {label || 'Test and Save'}
      </DynaAction>
    </Fragment>
  );
};

export default withStyles(styles)(TestAndSaveButton);
