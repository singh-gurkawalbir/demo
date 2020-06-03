import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Typography } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
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

  return (
    <div className={classes.root}>
      {systemToken && (
        <>
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
        </>
      )}
      {!systemToken && (
        <Typography
          className={classes.showToken}
          onClick={displaySystemToken}
          variant="caption">
          Show Token
        </Typography>
      )}
    </div>
  );
}
