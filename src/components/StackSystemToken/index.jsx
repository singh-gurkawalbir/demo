import { useCallback, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CopyIcon from '../icons/CopyIcon';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import actions from '../../actions';
import * as selectors from '../../reducers';
import AccessToken from '../MaskToken';

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

export default function StackSystemToken({ stackId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { systemToken } = useSelector(state =>
    selectors.stackSystemToken(state, stackId)
  );
  const displaySystemToken = useCallback(() => {
    dispatch(actions.stack.displayToken(stackId));
  }, [dispatch, stackId]);
  const copyToClipboard = useCallback(
    systemToken => () => {
      enqueueSnackbar({
        message: `Token (${systemToken}) copied to your clipboard!`,
      });
    },
    [enqueueSnackbar]
  );

  // const generateSystemToken = () => {
  //   dispatch(actions.stack.generateToken(stackId));
  // };
  return (
    <div className={classes.root}>
      {systemToken && (
        <Fragment>
          <Typography variant="caption">
            {systemToken || <AccessToken count="23" />}
          </Typography>
          <IconButton
            data-test="copyStackSystemToken"
            title="Copy to clipboard"
            onClick={copyToClipboard(systemToken)}
            size="small">
            <CopyIcon />
          </IconButton>
        </Fragment>
      )}
      {!systemToken && (
        <Typography
          className={classes.showToken}
          onClick={displaySystemToken}
          variant="caption">
          Show Token
        </Typography>
      )}
      {/* <IconButton
        data-test="regenerateStackSystemToken"
        title="Regenerate Token"
        onClick={generateSystemToken}
        size="small">
        <RegenerateToken />
      </IconButton> */}
    </div>
  );
}
