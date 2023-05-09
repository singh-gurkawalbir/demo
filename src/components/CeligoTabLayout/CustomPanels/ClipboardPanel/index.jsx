import React, {useCallback} from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import makeStyles from '@mui/styles/makeStyles';
import { TextButton } from '@celigo/fuse-ui';
import CopyIcon from '../../../icons/CopyIcon';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';

const useStyles = makeStyles(theme => ({
  clipBoardContainer: {
    borderTop: `1px solid ${theme.palette.background.paper2}`,
    minHeight: theme.spacing(6),
    position: 'relative',
    padding: theme.spacing(1),
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  clipBoard: {
    float: 'right',
  },
}));

export default function ClipboardPanel({ content }) {
  const classes = useStyles();
  const clipBoardText = typeof content !== 'string' ? JSON.stringify(content, null, 2) : content;

  const [enquesnackbar] = useEnqueueSnackbar();

  const handleCopy = useCallback(() =>
    enquesnackbar({ message: 'Copied to clipboard' }), [enquesnackbar]);

  return (
    <div className={classes.clipBoardContainer}>
      <CopyToClipboard
        onCopy={handleCopy}
        text={clipBoardText}
        className={classes.clipBoard}>
        <TextButton
          data-test="copyToClipboard"
          startIcon={<CopyIcon />}>
          Copy
        </TextButton>
      </CopyToClipboard>
    </div>
  );
}
