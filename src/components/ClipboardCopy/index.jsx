import { IconButton, Typography } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import React, { useCallback } from 'react';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import CopyIcon from '../icons/CopyIcon';
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

export default function ClipboardCopy({ onShowToken, token, testAttr }) {
  const classes = useStyles();
  const [enqueueSnackbar] = useEnqueueSnackbar();

  const copyToClipboard = useCallback(() => {
    enqueueSnackbar({
      message: `Token (${token}) copied to your clipboard!`,
    });
  },
  [enqueueSnackbar, token]
  );

  return (
    <div className={classes.root}>
      {token && (
        <>
          <Typography variant="caption">
            {token || <AccessToken count="23" />}
          </Typography>
          <CopyToClipboard
            text={token}
            onCopy={copyToClipboard}>
            <IconButton
              data-test={testAttr || 'copyToken'}
              title="Copy to clipboard"
              size="small">
              <CopyIcon />
            </IconButton>
          </CopyToClipboard>
        </>
      )}
      {!token && (
        <Typography
          className={classes.showToken}
          onClick={onShowToken}
          variant="caption">
          Show Token
        </Typography>
      )}
    </div>
  );
}
