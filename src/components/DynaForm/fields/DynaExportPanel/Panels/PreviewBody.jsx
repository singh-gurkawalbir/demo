import { makeStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import clsx from 'clsx';
import CopyIcon from '../../../../icons/CopyIcon';
import Spinner from '../../../../Spinner';
import IconTextButton from '../../../../IconTextButton';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import { getStringifiedPreviewData } from '../../../../../utils/exportPanel';
import Templates from '../Templates';

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
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    top: '-25%',
    width: '100%',
    wordBreak: 'break-word',
  },
  previewContainer: {
    minHeight: theme.spacing(10),
    position: 'relative',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(4),
    borderRadius: theme.spacing(0.5),
    border: `1px solid ${theme.palette.secondary.lightest}`,
    '&:before': {
      content: '""',
      width: 5,
      height: '100%',
      backgroundColor: theme.palette.success.main,
      position: 'absolute',
      left: 0,
      top: 0,
      border: '1px solid',
      borderColor: theme.palette.secondary.contrastText,
    },
  },
  previewData: {
    display: 'flex',
    height: '100%',
  },

  previewDataLeft: {
    display: 'flex',
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  previewDataRight: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(1),
    justifyContent: 'space-between',
    position: 'relative',
    width: '100%',
  },

  previewBtn: {
    minHeight: theme.spacing(5),
    color: theme.palette.primary.main,
  },
}));

export default function PreviewBody(props) {
  const {
    resourceSampleData,
    handlePanelViewChange,
    panelType,
    availablePreviewStages,
    previewStageDataList,
  } = props;
  const classes = useStyles();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const handleOnCopy = () =>
    enqueueSnackbar({
      message: 'Data copied to clipboard.',
      variant: 'success',
    });

  return (
    <div>
      {resourceSampleData.status === 'requested' && <Spinner />}
      {resourceSampleData.status === 'received' && (
        <div>
          <Templates.HeaderPanel
            handlePanelViewChange={handlePanelViewChange}
            availablePreviewStages={availablePreviewStages}
            panelType={panelType}
          />
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
        </div>
      )}
      {resourceSampleData.status === 'error' && (
        <Templates.ErrorPanel
          resourceSampleData={resourceSampleData}
          sampleDataWrapperClass={classes.sampleDataWrapper}
          sampleDataContainerClass={classes.sampleDataContainer}
        />
      )}
    </div>
  );
}
