import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ViewIcon from '../icons/InfoIcon';
import CopyIcon from '../icons/CopyIcon';
import GenerateIcon from '../icons/TransferIcon';
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

export default function StackSystemToken({ stackId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { systemToken } = useSelector(state =>
    selectors.stackSystemToken(state, stackId)
  );
  const displaySystemToken = () => {
    dispatch(actions.stack.displayToken(stackId));
  };

  const generateSystemToken = () => {
    dispatch(actions.stack.generateToken(stackId));
  };

  const copyToClipboard = systemToken => () => {
    enqueueSnackbar({
      message: `Token (${systemToken}) copied to your clipboard!`,
    });
  };

  return (
    <div className={classes.root}>
      <Typography variant="caption" className={classes.token}>
        {systemToken || '********************************'}
      </Typography>
      {systemToken && (
        <IconButton
          data-test="copyStackSystemToken"
          title="Copy to clipboard"
          onClick={copyToClipboard(systemToken)}
          size="small">
          <CopyIcon />
        </IconButton>
      )}
      {!systemToken && (
        <IconButton
          data-test="viewStackSystemToken"
          title="View Token"
          onClick={displaySystemToken}
          size="small">
          <ViewIcon />
        </IconButton>
      )}
      <IconButton
        data-test="regenerateStackSystemToken"
        title="Regenerate Token"
        onClick={generateSystemToken}
        size="small">
        <GenerateIcon />
      </IconButton>
    </div>
  );
}
