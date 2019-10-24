import { useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import CopyIcon from '../icons/CopyIcon';
import ShowContentIcon from '../icons/ShowContentIcon';
import RefreshIcon from '../icons/RefreshIcon';
import actions from '../../actions';
import * as selectors from '../../reducers';
import AccessToken from '../MaskToken';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
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

  return (
    <div className={classes.root}>
      <Typography variant="caption">
        {accessToken || <AccessToken count="24" />}
      </Typography>
      {accessToken && (
        <CopyToClipboard
          text={accessToken}
          onCopy={() =>
            enqueueSnackbar({
              message: 'Token copied to clipboard.',
              variant: 'success',
            })
          }>
          <IconButton
            data-test="copyToClipboard"
            title="Copy to clipboard"
            size="small">
            <CopyIcon />
          </IconButton>
        </CopyToClipboard>
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
