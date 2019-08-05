import { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import DoneIcon from '@material-ui/icons/Done';
import { useDispatch, useSelector } from 'react-redux';
// import Chip from '@material-ui/core/Chip';
// import CircularProgress from '@material-ui/core/CircularProgress';
import PingSnackbar from '../../PingSnackbar';
import actions from '../../../actions';
import * as selectors from '../../../reducers/index';
import { COMM_STATES } from '../../../reducers/comms';
import DynaAction from '../../DynaForm/DynaAction';

const styles = theme => ({
  actions: {
    textAlign: 'right',
  },
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const TestButton = props => {
  const { classes, resourceId, label, isTestOnly = true } = props;
  const dispatch = useDispatch();
  const handleTestConnection = resourceId => values =>
    dispatch(actions.resource.connections.test(resourceId, values));
  const cancelProcess = () => dispatch(actions.cancelTask());
  const clearComms = () => dispatch(actions.clearComms());
  const testConnectionCommState = useSelector(state =>
    selectors.testConnectionCommState(state)
  );
  const pingLoading = testConnectionCommState.commState === COMM_STATES.LOADING;

  return (
    <Fragment>
      <PingSnackbar
        commStatus={testConnectionCommState}
        onHandleClose={clearComms}
        onHandleCancelTask={cancelProcess}
      />
      {isTestOnly && (
        <DynaAction
          {...props}
          disabled={pingLoading}
          onClick={handleTestConnection(resourceId)}
          className={classes.actionButton}
          size="small"
          variant="contained"
          color="secondary">
          {label || 'Test'}
        </DynaAction>
      )}
    </Fragment>
  );
};

export default withStyles(styles)(TestButton);
