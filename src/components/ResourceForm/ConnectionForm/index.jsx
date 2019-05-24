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
import {
  sanitizePatchSet,
  defaultPatchSetConverter,
} from '../../../forms/utils';

const mapStateToProps = state => ({
  testConnectionCommState: selectors.testConnectionCommState(state),
});
const mapDispatchToProps = (dispatch, ownProps) => {
  const { resourceType, resource } = ownProps;
  const resourceId = resource._id;

  return {
    testConnection: connection => {
      dispatch(
        actions.resource.test.connection(connection, resourceType, resourceId)
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
    advancedSettingsOpen: false,
  };
  handleToggleAdvancedSettings = () => {
    this.setState({ advancedSettingsOpen: !this.state.advancedSettingsOpen });
  };
  handleTestConnection = value => {
    const { testConnection, fieldMeta, resource, converter } = this.props;
    const fieldValuesPatchOperations = sanitizePatchSet({
      patchSet: (converter || defaultPatchSetConverter)(value),
      fieldMeta,
      resource,
    });

    testConnection(fieldValuesPatchOperations);
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
    const { classes, testConnectionCommState, converter, ...rest } = this.props;

    return (
      <Fragment>
        <PingSnackbar
          commStatus={testConnectionCommState}
          onHandleClose={this.handleClearComms}
          onHandleCancelTask={this.handleCancel}
        />
        <ResourceForm {...rest}>
          <DynaSubmit
            pendingCommResponse={
              testConnectionCommState.commState === COMM_STATES.LOADING
            }
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
