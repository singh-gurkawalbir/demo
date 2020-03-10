import { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import clsx from 'clsx';
import CopyIcon from '../../../../icons/CopyIcon';
import IconTextButton from '../../../../IconTextButton';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import { getStringifiedPreviewData } from '../../../../../utils/exportPanel';

const useStyles = makeStyles(theme => ({
  sampleDataWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  sampleDataWrapperAlign: {
    marginTop: -18,
  },
  sampleDataContainer: {
    minHeight: theme.spacing(20),
    position: 'relative',
    backgroundColor: 'white',
    maxHeight: 400,
    overflow: 'auto',
    maxWidth: 680,
    color: theme.palette.text.hint,
  },
  sampleDataContainerAlign: {
    marginTop: theme.spacing(2),
  },
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

export default function DefaultPanel(props) {
  const { previewStageDataList, panelType } = props;
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
    <div
      className={clsx(
        classes.sampleDataWrapper,
        classes.sampleDataWrapperAlign
      )}>
      <div
        className={clsx(
          classes.sampleDataContainer,
          classes.sampleDataContainerAlign
        )}>
        <pre>
          {getStringifiedPreviewData(
            previewStageDataList[panelType],
            panelType
          )}
        </pre>
      </div>
      <div className={classes.clipBoardContainer}>
        <CopyToClipboard
          text={getStringifiedPreviewData(
            previewStageDataList[panelType],
            panelType
          )}
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
    </div>
  );
}
