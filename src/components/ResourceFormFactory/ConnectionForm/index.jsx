import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import DoneIcon from '@material-ui/icons/Done';
import { connect } from 'react-redux';
import { deepClone } from 'fast-json-patch';
// import Chip from '@material-ui/core/Chip';
// import CircularProgress from '@material-ui/core/CircularProgress';
import PingSnackbar from '../../PingSnackbar';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import actions from '../../../actions';
import * as selectors from '../../../reducers/index';
import { COMM_STATES } from '../../../reducers/comms';
import ResourceForm from '../GenericResourceForm';
import { confirmDialog } from '../../ConfirmDialog';

const mapStateToProps = state => ({
  testConnectionCommState: selectors.testConnectionCommState(state),
});
const mapDispatchToProps = (dispatch, ownProps) => {
  const { resourceType, resource } = ownProps;
  const resourceId = resource._id;

  return {
    handleTestConnection: values => {
      dispatch(
        actions.resource.test.connection(resourceType, resourceId, values)
      );
    },
    clearComms: () => {
      dispatch(actions.clearComms());
    },
    cancelProcess: () => {
      dispatch(actions.cancelTask());
    },
  };
};

@withStyles(theme => ({
  actions: {
    textAlign: 'right',
  },
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}))
class ConnectionForm extends Component {
  state = {
    showConfirmDialog: false,
    formValuesState: null,
  };
  handleCancel = () => {
    this.props.cancelProcess();
  };
  componentDidMount() {
    this.props.clearComms();
  }

  handleClearComms = () => {
    this.props.clearComms();
  };
  handleSubmitAndShowConfirmDialog = values => {
    this.props.onHandleSubmit(values);
    this.setState({ showConfirmDialog: true });
    this.setState({ formValuesState: deepClone(values) });
    console.log('set state ');
  };
  render() {
    const {
      classes,
      testConnectionCommState,
      converter,
      handleTestConnection,
      onHandleSubmit,
      saveForm,
      ...rest
    } = this.props;
    const { showConfirmDialog, formValuesState } = this.state;
    const { message } = testConnectionCommState;

    return (
      <Fragment>
        {showConfirmDialog &&
        testConnectionCommState.commState === COMM_STATES.ERROR ? (
          confirmDialog({
            title: 'Confirm',
            message: `Test failed for this connection with the following error. ${message}. Do you want to save this connection regardless (i.e. in offline mode)?`,
            buttons: [
              {
                label: 'No',
                onClick: () => {
                  this.setState({ showConfirmDialog: false });
                  this.props.clearComms();
                },
              },
              {
                label: 'Yes',
                onClick: () => {
                  const { saveForm } = this.props;

                  saveForm(formValuesState);
                  this.setState({ showConfirmDialog: false });
                  this.props.clearComms();
                },
              },
            ],
          })
        ) : (
          <PingSnackbar
            commStatus={testConnectionCommState}
            onHandleClose={this.handleClearComms}
            onHandleCancelTask={this.handleCancel}
          />
        )}
        <ResourceForm
          {...rest}
          onHandleSubmit={this.handleSubmitAndShowConfirmDialog}>
          <DynaSubmit
            disabled={testConnectionCommState.commState === COMM_STATES.LOADING}
            onClick={handleTestConnection}
            className={classes.actionButton}
            size="small"
            variant="contained"
            color="secondary">
            Test
          </DynaSubmit>
        </ResourceForm>
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectionForm);
