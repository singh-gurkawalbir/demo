import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import CopyIcon from '../icons/CopyIcon';
import ShowContentIcon from '../icons/ShowContentIcon';
import RefreshIcon from '../icons/RefreshIcon';
import actions from '../../actions';
import * as selectors from '../../reducers';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  token: {
    fontFamily: 'Courier',
  },
});

export default function AgentToken({ agentId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { accessToken } = useSelector(state =>
    selectors.agentAccessToken(state, agentId)
  );
  const displayAgentToken = () => {
    dispatch(actions.agent.displayToken(agentId));
  };

  const changeAgentToken = () => {
    dispatch(actions.agent.changeToken(agentId));
  };

  // TODO: This action needs to be completed...
  // this is a placeholder for now.
  const copyToClipboard = accessToken => () => {
    enqueueSnackbar({
      message: `Token (${accessToken}) copied to your clipboard!`,
    });
  };

  return (
    <div className={classes.root}>
      <Typography variant="caption" className={classes.token}>
        {accessToken || '********************************'}
      </Typography>
      {accessToken && (
        <IconButton
          data-test="copyToClipboard"
          title="Copy to clipboard"
          onClick={copyToClipboard(accessToken)}
          size="small">
          <CopyIcon />
        </IconButton>
      )}
      {!accessToken && (
        <IconButton
          data-test="displayAgentToken"
          title="View Token"
          onClick={displayAgentToken}
          size="small">
          <ShowContentIcon />
        </IconButton>
      )}
      <IconButton
        data-test="regenerateAgentToken"
        title="Re-generate Token"
        onClick={changeAgentToken}
        size="small">
        <RefreshIcon />
      </IconButton>
    </div>
  );
}
