import React, {useCallback} from 'react';
import { IconButton, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { TextButton } from '@celigo/fuse-ui';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import CopyIcon from '../icons/CopyIcon';
import AccessToken from '../MaskToken';

const useStyles = makeStyles({
  copyTokenIcon: {
    padding: 0,
  },
});

export default function ClipboardCopy({ onShowToken, token, showTokenTestAttr }) {
  const classes = useStyles();
  const [enquesnackbar] = useEnqueueSnackbar();
  const handleCopy = useCallback(() =>
    enquesnackbar({ message: 'Token copied to clipboard.' }), [enquesnackbar]);

  return (
    <div>
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
          sx={{
            padding: 0,
            minWidth: 'unset',
          }}
          onClick={onShowToken}>
          Show token
        </TextButton>
      )}
    </div>
  );
}
