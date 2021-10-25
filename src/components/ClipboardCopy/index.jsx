import React, {useCallback} from 'react';
import { makeStyles, IconButton, Typography } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import CopyIcon from '../icons/CopyIcon';
import AccessToken from '../MaskToken';
import { TextButton } from '../Buttons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  copyTokenIcon: {
    padding: 0,
  },
  showToken: {
    padding: 0,
    minWidth: 'unset',
  },
});

export default function ClipboardCopy({ onShowToken, token, showTokenTestAttr }) {
  const classes = useStyles();
  const [enquesnackbar] = useEnqueueSnackbar();
  const handleCopy = useCallback(() =>
    enquesnackbar({ message: 'Token copied to clipboard.' }), [enquesnackbar]);

  return (
    <div className={classes.root}>
      {token ? (
        <>
          <Typography data-private variant="caption">
            {token || <AccessToken count="23" />}
          </Typography>

          <CopyToClipboard
            onCopy={handleCopy}
            text={token}>
            <IconButton
              className={classes.copyTokenIcon}
              data-test="copyToken"
              title="Copy token"
              size="small">
              <CopyIcon />
            </IconButton>
          </CopyToClipboard>
        </>
      ) : (
        <TextButton
          data-test={showTokenTestAttr || 'showToken'}
          className={classes.showToken}
          onClick={onShowToken}>
          Show token
        </TextButton>
      )}
    </div>
  );
}
