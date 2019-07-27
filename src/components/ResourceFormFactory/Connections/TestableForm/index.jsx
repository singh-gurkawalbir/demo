import { Fragment, useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import DoneIcon from '@material-ui/icons/Done';
import { connect } from 'react-redux';
import { deepClone } from 'fast-json-patch';
// import Chip from '@material-ui/core/Chip';
// import CircularProgress from '@material-ui/core/CircularProgress';
import PingSnackbar from '../../../PingSnackbar';
import DynaSubmit from '../../../DynaForm/DynaSubmit';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers/index';
import { COMM_STATES } from '../../../../reducers/comms';
import GenericResourceForm from '../../GenericResourceForm';
import GenericConfirmDialog from '../../../ConfirmDialog';

const mapStateToProps = state => ({
  testConnectionCommState: selectors.testConnectionCommState(state),
});
const mapDispatchToProps = dispatch => ({
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
    setShowConfirmDialog,
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
            setShowConfirmDialog(false);
          },
        },
        {
          label: 'Yes',
          onClick: () => {
            handleSubmit(formValues);
            setShowConfirmDialog(false);
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
    converter,
    handleTestConnection,
    handleSubmitForm,
    cancelProcess,
    resourceId,
    clearComms,
    ...rest
  } = props;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formValues, setFormValues] = useState(null);

  useEffect(() => {
    clearComms();
  }, [clearComms]);

  const handleTestCallAndClearFormValues = values => {
    handleTestConnection(resourceId)(values);
    setFormValues(null);
  };

  const handleSubmitAndShowConfirmDialog = values => {
    handleTestConnection(resourceId)(values);
    setFormValues(deepClone(values));
  };

  const testCommState =
    testConnectionCommState && testConnectionCommState.commState;

  useEffect(() => {
    // when form values are present indicates that we are
    // performing a submit after the save
    if (formValues) {
      if (testCommState === COMM_STATES.SUCCESS) {
        clearComms();
        handleSubmitForm(formValues);
        setShowConfirmDialog(false);
      } else if (testCommState === COMM_STATES.ERROR) {
        setShowConfirmDialog(true);
      }
    }
  }, [clearComms, formValues, handleSubmitForm, testCommState]);

  const { message } = testConnectionCommState;
  const pingLoading = testConnectionCommState.commState === COMM_STATES.LOADING;

  return (
    <Fragment>
      {showConfirmDialog && (
        <ConfirmDialog
          commErrorMessage={message}
          formValues={formValues}
          setShowConfirmDialog={setShowConfirmDialog}
          clearComms={clearComms}
          handleSubmit={handleSubmitForm}
        />
      )}
      {!formValues && (
        <PingSnackbar
          commStatus={testConnectionCommState}
          onHandleClose={clearComms}
          onHandleCancelTask={cancelProcess}
        />
      )}
      <GenericResourceForm
        {...rest}
        disableButton={pingLoading}
        handleSubmitForm={handleSubmitAndShowConfirmDialog}>
        <DynaSubmit
          disabled={pingLoading}
          onClick={handleTestCallAndClearFormValues}
          className={classes.actionButton}
          size="small"
          variant="contained"
          color="secondary">
          Test
        </DynaSubmit>
      </GenericResourceForm>
    </Fragment>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TestableForm));
