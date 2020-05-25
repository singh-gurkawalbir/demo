import { useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import CopyIcon from '../icons/CopyIcon';
// import ShowContentIcon from '../icons/ShowContentIcon';
// import RegenerateToken from '../icons/RegenerateTokenIcon';
import actions from '../../actions';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  showToken: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

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

  return (
    <div className={classes.root}>
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
        <Typography
          data-test="displayAgentToken"
          className={classes.showToken}
          onClick={displayAgentToken}
          variant="caption">
          Show Token
        </Typography>
      )}
    </div>
  );
}
