import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import DoneIcon from '@material-ui/icons/Done';
import { connect } from 'react-redux';
// import Chip from '@material-ui/core/Chip';
// import CircularProgress from '@material-ui/core/CircularProgress';
import PingSnackbar from '../../PingSnackbar';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import actions from '../../../actions';
import * as selectors from '../../../reducers/index';
import { COMM_STATES } from '../../../reducers/comms';
import ResourceForm from '../GenericResourceForm';

// const CancellableSpinner = props => (
//   <div>
//     <CircularProgress />
//     <Button
//       size="small"
//       variant="contained"
//       color="secondary"
//       onClick={props.onHandleCancel}>
//       Click here to cancel this Test call
//     </Button>
//   </div>
// );
const mapStateToProps = state => ({
  testConnectionCommState: selectors.testConnectionCommState(state),
});
const mapDispatchToProps = dispatch => ({
  testConnection: (connection, resourceType, resourceId) => {
    dispatch(
      actions.resource.connections.testConnection(
        connection,
        resourceType,
        resourceId
      )
    );
  },
  clearComms: () => {
    dispatch(actions.clearComms());
  },
  cancelProcess: () => {
    dispatch(actions.cancelTask());
  },
});

@withStyles(theme => ({
  formView: {
    overflow: 'auto',
    maxHeight: '500px',
  },
  chip: {
    padding: theme.spacing.double,
  },
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
    advancedSettingsOpen: false,
    // networkSnackBarError: false,
  };
  handleToggleAdvancedSettings = () => {
    this.setState({ advancedSettingsOpen: !this.state.advancedSettingsOpen });
  };
  handleTestConnection = value => {
    const { testConnection, resourceType, resource } = this.props;

    testConnection(value, resourceType, resource._id);
  };
  handleCancel = () => {
    this.props.cancelProcess();
  };
  componentDidMount() {
    this.props.clearComms();
  }
  // handleCloseNetworkErrorChip = () => {
  //   this.setState({ networkSnackBarError: false });
  // };
  handleClearComms = () => {
    this.props.clearComms();
  };
  render() {
    const {
      classes,
      testConnectionCommState,
      // ...resourceFormProps
    } = this.props;
    // can we mode didMount

    // props to disable
    // how many can you run in the background
    // name: /type

    return (
      <Fragment>
        <PingSnackbar
          commStatus={testConnectionCommState}
          onHandleClose={this.handleClearComms}
          onHandleCancelTask={this.handleCancel}
        />
        <ResourceForm {...this.props}>
          {/* TODO: use formValueToPatchSetConverter */}
          <DynaSubmit
            isValid={testConnectionCommState !== COMM_STATES.LOADING}
            onClick={this.handleTestConnection}
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
