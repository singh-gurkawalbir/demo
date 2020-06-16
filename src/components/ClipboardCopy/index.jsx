import { IconButton, Typography, Button } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import CopyIcon from '../icons/CopyIcon';
import AccessToken from '../MaskToken';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  showToken: {
    padding: 0,
    minWidth: 'unset',
    '&:hover': {
      color: theme.palette.primary.main,
      background: 'transparent',
    },
  },
}));

export default function ClipboardCopy({ onShowToken, token, showTokenTestAttr }) {
  const classes = useStyles();


  return (
    <div className={classes.root}>
      {token ? (
        <>
          <Typography variant="caption">
            {token || <AccessToken count="23" />}
          </Typography>
          <CopyToClipboard
            text={token}>
            <IconButton
              data-test="copyToken"
              title="Copy to clipboard"
              size="small">
              <CopyIcon />
            </IconButton>
          </CopyToClipboard>
        </>
      )
        : (
          <Button
            data-test={showTokenTestAttr || 'showToken'}
            className={classes.showToken}
            onClick={onShowToken}>
            Show Token
          </Button>
        )}
    </div>
  );
}
