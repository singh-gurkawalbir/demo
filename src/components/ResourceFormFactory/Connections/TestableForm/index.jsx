import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import DoneIcon from '@material-ui/icons/Done';
import { connect } from 'react-redux';
// import Chip from '@material-ui/core/Chip';
// import CircularProgress from '@material-ui/core/CircularProgress';
import PingSnackbar from '../../../PingSnackbar';
import DynaSubmit from '../../../DynaForm/DynaSubmit';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers/index';
import { COMM_STATES } from '../../../../reducers/comms';
import ResourceForm from '../../GenericResourceForm';

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
class TestableForm extends Component {
  handleCancel = () => {
    this.props.cancelProcess();
  };
  componentDidMount() {
    this.props.clearComms();
  }

  handleClearComms = () => {
    this.props.clearComms();
  };
  render() {
    const {
      classes,
      testConnectionCommState,
      converter,
      handleTestConnection,
      ...rest
    } = this.props;

    return (
      <Fragment>
        <PingSnackbar
          commStatus={testConnectionCommState}
          onHandleClose={this.handleClearComms}
          onHandleCancelTask={this.handleCancel}
        />
        <ResourceForm {...rest}>
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
)(TestableForm);
