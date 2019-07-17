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
const mapDispatchToProps = (dispatch, ownProps) => {
  const { resource } = ownProps;
  const resourceId = resource._id;

  return {
    handleTestConnection: values => {
      dispatch(actions.resource.connections.test(resourceId, values));
    },
    clearComms: () => {
      dispatch(actions.clearComms());
    },
    cancelProcess: () => {
      dispatch(actions.cancelTask());
    },
  };
};

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

  useEffect(
    () => clearComms,
    // TODO: Surya
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
    clearComms,
    ...rest
  } = props;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formValues, setFormValues] = useState(null);

  useEffect(() => {
    clearComms();
    // TODO: Surya
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSubmitAndShowConfirmDialog = values => {
    handleTestConnection(values);
    setShowConfirmDialog(true);
    setFormValues(deepClone(values));
  };

  const { message } = testConnectionCommState;
  const pingLoading = testConnectionCommState.commState === COMM_STATES.LOADING;

  return (
    <Fragment>
      {showConfirmDialog &&
      testConnectionCommState.commState === COMM_STATES.ERROR ? (
        <ConfirmDialog
          commErrorMessage={message}
          formValues={formValues}
          setShowConfirmDialog={setShowConfirmDialog}
          clearComms={clearComms}
          handleSubmit={handleSubmitForm}
        />
      ) : (
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
          onClick={handleTestConnection}
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
