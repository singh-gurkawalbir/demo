import { useCallback } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles } from '@material-ui/core/styles';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import CopyIcon from '../../../../icons/CopyIcon';
import IconTextButton from '../../../../IconTextButton';

const useStyles = makeStyles(theme => ({
  clipBoardContainer: {
    maxWidth: 680,
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

export default function ClipBoardPanel(props) {
  const { text } = props;
  const classes = useStyles();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const handleOnCopy = useCallback(
    () =>
      enqueueSnackbar({
        message: 'Data copied to clipboard.',
        variant: 'success',
      }),
    [enqueueSnackbar]
  );

  return (
    <div className={classes.clipBoardContainer}>
      <CopyToClipboard
        text={text}
        onCopy={handleOnCopy}
        className={classes.clipBoard}>
        <IconTextButton
          data-test="copyToClipboard"
          title="Copy to clipboard"
          variant="text"
          color="primary">
          <CopyIcon />
          Copy
        </IconTextButton>
      </CopyToClipboard>
    </div>
  );
}
