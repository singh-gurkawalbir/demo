import { useSelector, useDispatch } from 'react-redux';
import {
  makeStyles,
  LinearProgress,
  Button,
  Snackbar,
  Typography,
} from '@material-ui/core';
import { Fragment } from 'react';
import actions from '../../actions';
import * as selectors from '../../reducers';
import { COMM_STATES } from '../../reducers/comms';
import RawHtml from '../RawHtml';

const useStyles = makeStyles(theme => ({
  snackbar: {
    marginTop: theme.spacing(1),
  },
  snackbarContent: {
    w: theme.spacing(4),
    flexGrow: 0,
    justifyContent: 'center',
    textAlign: 'center',
  },
}));
const LinearInDertiminate = props => props.show && <LinearProgress />;
const Dismiss = props =>
  props.show && (
    <Button
      data-test="dismissNetworkSnackbar"
      variant="contained"
      color="primary"
      onClick={props.onClick}>
      Dismiss
    </Button>
  );

export const ErroredMessageList = ({ messages }) =>
  messages && messages.length > 0
    ? messages.map((msg, index) => (
        <Fragment key={msg}>
          {
            // Check if the message contains html elements, render it as html
          }
          {/<\/?[a-z][\s\S]*>/i.test(msg) ? (
            <RawHtml html={msg} />
          ) : (
            <Typography color="error">{msg}</Typography>
          )}
          {index > 0 && <br />}
        </Fragment>
      ))
    : null;

export default function NetworkSnackbar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isAllLoadingCommsAboveThreshold = useSelector(state =>
    selectors.isAllLoadingCommsAboveThreshold(state)
  );
  const allLoadingOrErrored = useSelector(state =>
    selectors.allLoadingOrErroredWithCorrectlyInferredErroredMessage(state)
  );
  const isLoadingAnyResource = useSelector(state =>
    selectors.isLoadingAnyResource(state)
  );

  if (!isAllLoadingCommsAboveThreshold || !allLoadingOrErrored) {
    return null;
  }

  function handleClearComms() {
    dispatch(actions.clearComms());
  }

  const notification = r => {
    if (r.status === COMM_STATES.ERROR)
      return (
        <li key={r.name}>
          {r.message && <ErroredMessageList messages={r.message} />}
        </li>
      );

    let msg = ` ${r.message}...`;

    if (r.retryCount > 0) {
      msg += ` Retry ${r.retryCount}`;
    }

    return (
      <li key={r.name}>
        <Typography>{msg}</Typography>
      </li>
    );
  };

  const msg = (
    <div>
      <ul>{allLoadingOrErrored.map(r => notification(r))}</ul>
      <LinearInDertiminate show={isLoadingAnyResource} />
      <Dismiss show={!isLoadingAnyResource} onClick={handleClearComms} />
    </div>
  );

  return (
    <Snackbar
      className={classes.snackbar}
      ContentProps={{
        // TODO: Are we overriding the default "paper" component style
        // globaly? The material-ui demo page has the snackbar width
        // and corner radius set differently than our default... we need
        // to use the overrides below to compensate. why? where in our
        // component heirarchy are these css overides?
        square: false,
        className: classes.snackbarContent,
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open
      // autoHideDuration={6000}
      // onClose={this.handleClose}
      message={msg}
    />
  );
}
