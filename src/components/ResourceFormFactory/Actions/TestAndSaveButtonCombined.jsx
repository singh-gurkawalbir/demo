import { Fragment, useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import DoneIcon from '@material-ui/icons/Done';
import { connect } from 'react-redux';
// import Chip from '@material-ui/core/Chip';
// import CircularProgress from '@material-ui/core/CircularProgress';
import PingSnackbar from '../../PingSnackbar';
import actions from '../../../actions';
import * as selectors from '../../../reducers/index';
import { COMM_STATES } from '../../../reducers/comms';
import GenericConfirmDialog from '../../ConfirmDialog';
import DynaAction from '../../DynaForm/DynaAction';

const mapStateToProps = state => ({
  testConnectionCommState: selectors.testConnectionCommState(state),
});
const mapDispatchToProps = dispatch => ({
  handleSubmitForm: (resourceType, resourceId) => values => {
    dispatch(actions.resourceForm.submit(resourceType, resourceId, values));
  },
  handleTestConnection: resourceId => values =>
    dispatch(actions.resource.connections.test(resourceId, values)),
  clearComms: () => dispatch(actions.clearComms()),

  cancelProcess: () => dispatch(actions.cancelTask()),
});
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
    clearComms,
    handleSubmit,
    commErrorMessage,
  } = props;

  useEffect(() => clearComms, [clearComms]);

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

const TestableForm = props => {
  const {
    classes,
    testConnectionCommState,
    handleTestConnection,
    handleSubmitForm,
    resourceType,
    cancelProcess,
    resourceId,
    clearComms,
    label,
    isTestOnly,
  } = props;
  const [errorMessage, setErrorMessage] = useState(null);
  const [formValues, setFormValues] = useState(null);
  const handleSubmit = handleSubmitForm(resourceType, resourceId);

  useEffect(() => {
    clearComms();
  }, [clearComms]);

  const handleCloseAndClearForm = () => {
    setFormValues(null);
    setErrorMessage(null);
  };

  const handleTestCallAndClearFormValues = values => {
    handleTestConnection(resourceId)(values);
    handleCloseAndClearForm();
  };

  const handleSubmitAndShowConfirmDialog = values => {
    handleCloseAndClearForm();
    handleTestConnection(resourceId)(values);
    setFormValues(values);
  };

  const testCommState =
    testConnectionCommState && testConnectionCommState.commState;
  const { message } = testConnectionCommState;

  useEffect(() => {
    // when form values are present indicates that we are
    // performing a submit after the save
    if (formValues && !isTestOnly) {
      if (testCommState === COMM_STATES.SUCCESS) {
        clearComms();
        handleSubmit(formValues);
      } else if (message && testCommState === COMM_STATES.ERROR) {
        setErrorMessage(message);
        clearComms();
      }
    }
  }, [
    clearComms,
    formValues,
    handleSubmit,
    isTestOnly,
    message,
    testCommState,
  ]);

  const pingLoading = testConnectionCommState.commState === COMM_STATES.LOADING;

  return (
    <Fragment>
      {errorMessage && (
        <ConfirmDialog
          commErrorMessage={errorMessage}
          formValues={formValues}
          handleCloseAndClearForm={handleCloseAndClearForm}
          clearComms={clearComms}
          handleSubmit={handleSubmit}
        />
      )}

      <PingSnackbar
        commStatus={testConnectionCommState}
        onHandleClose={clearComms}
        onHandleCancelTask={cancelProcess}
      />

      {isTestOnly ? (
        <DynaAction
          {...props}
          disabled={pingLoading}
          onClick={handleTestCallAndClearFormValues}
          className={classes.actionButton}
          size="small"
          variant="contained"
          color="secondary">
          {label || 'Test'}
        </DynaAction>
      ) : (
        <DynaAction
          {...props}
          disableButton={pingLoading}
          onClick={handleSubmitAndShowConfirmDialog}
          className={classes.actionButton}
          size="small"
          variant="contained"
          color="secondary">
          {label || 'Test and Save'}
        </DynaAction>
      )}
    </Fragment>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TestableForm));
