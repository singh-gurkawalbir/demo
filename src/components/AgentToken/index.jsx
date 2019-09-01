import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ViewIcon from '@material-ui/icons/ViewArray';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import GenerateIcon from '@material-ui/icons/BeachAccessOutlined';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
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
          title="Copy ot clipboard"
          onClick={copyToClipboard(accessToken)}
          size="small">
          <CopyIcon />
        </IconButton>
      )}
      {!accessToken && (
        <IconButton title="View Token" onClick={displayAgentToken} size="small">
          <ViewIcon />
        </IconButton>
      )}
      <IconButton
        title="Re-generate Token"
        onClick={changeAgentToken}
        size="small">
        <GenerateIcon />
      </IconButton>
    </div>
  );
}
