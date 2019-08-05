import { Fragment, useEffect, useCallback, useReducer } from 'react';
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

  switch (type) {
    case 'setFormValues':
      return { ...state, formValues };
    case 'testInitiated':
      return { ...state, testInitiated: true };
    case 'clearFormData':
      return {};
    case 'testErrored':
      return { ...state, erroredMessage };
    default:
      throw new Error();
  }
}

const TestAndSaveButton = props => {
  const [stateForm, dispatchForm] = useReducer(reducer, {});
  const { classes, resourceType, resourceId, label } = props;
  const dispatch = useDispatch();
  const handleSubmitForm = (resourceType, resourceId) => values =>
    dispatch(actions.resourceForm.submit(resourceType, resourceId, values));
  const handleTestConnection = resourceId => values =>
    dispatch(actions.resource.connections.test(resourceId, values));
  const clearComms = useCallback(() => dispatch(actions.clearComms()), [
    dispatch,
  ]);
  const testConnectionCommState = useSelector(state =>
    selectors.testConnectionCommState(state)
  );
  const handleSubmit = handleSubmitForm(resourceType, resourceId);
  const pingLoading = testConnectionCommState.commState === COMM_STATES.LOADING;
  const { commState } = testConnectionCommState;
  const { message } = testConnectionCommState;
  const { formValues, testInitiated, erroredMessage } = stateForm;

  useEffect(() => {
    if (commState === COMM_STATES.LOADING && formValues) {
      dispatchForm({ type: 'testInitiated' });
    }
  }, [commState, formValues]);

  useEffect(() => {
    if (testInitiated && commState) {
      if (commState === COMM_STATES.SUCCESS) {
        handleSubmit(formValues);
        dispatchForm({ type: 'clearFormData' });
        clearComms();
      } else if (commState === COMM_STATES.ERROR && message) {
        dispatchForm({
          type: 'testErrored',
          erroredMessage: message,
        });
        clearComms();
      }
    }
  }, [testInitiated, commState, handleSubmit, formValues, clearComms, message]);

  return (
    <Fragment>
      {erroredMessage && (
        <ConfirmDialog
          commErrorMessage={erroredMessage}
          formValues={formValues}
          handleCloseAndClearForm={() =>
            dispatchForm({ type: 'clearFormData' })
          }
          handleSubmit={handleSubmit}
        />
      )}
      {/* TODO show ping snackbar */}
      <TestButton {...props} isTestOnly={false} />
      <DynaAction
        {...props}
        disableButton={pingLoading}
        onClick={values => {
          clearComms();
          handleTestConnection(resourceId)(values);
          dispatchForm({ type: 'setFormValues', formValues: values });
        }}
        className={classes.actionButton}
        size="small"
        variant="contained"
        color="secondary">
        {label || 'Test and Save'}
      </DynaAction>
    </Fragment>
  );
};

export default withStyles(styles)(TestAndSaveButton);
