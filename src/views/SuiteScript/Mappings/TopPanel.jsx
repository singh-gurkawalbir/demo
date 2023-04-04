import React, {useCallback} from 'react';
import { Typography, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Spinner } from '@celigo/fuse-ui';
import RefreshIcon from '../../../components/icons/RefreshIcon';
import { selectors } from '../../../reducers';
import actions from '../../../actions';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(1.5),
    alignItems: 'center',
  },
  headerChild: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: theme.spacing(3),
  },
  headerChildRight: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(9),
  },
  refreshButton: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.primary.main,
    },
  },
  topHeading: {
    fontFamily: 'Roboto500',
  },
  spinner: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const RefreshButton = ({className, ...props}) => (
  <IconButton
    variant="contained"
    color="secondary"
    className={className}
    {...props}
    size="large">
    <RefreshIcon />
  </IconButton>
);
const SpinnerLoader = ({className}) => (
  <span className={className}>
    <Spinner />
  </span>
);
export default function TopPanel({disabled}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId} = useSelector(state => selectors.suiteScriptMapping(state));
  const {generate: generateLabel, extract: extractLabel} = useSelector(state => selectors.suitesciptMappingExtractGenerateLabel(state));

  const isExtractsLoading = useSelector(state => {
    const flowSampleDataStatus = selectors.suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId, flowId}).status;

    return flowSampleDataStatus === 'requested';
  });
  const isGeneratesLoading = useSelector(state => {
    const importSampleDataStatus = selectors.suiteScriptGenerates(state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}).status;

    return importSampleDataStatus === 'requested';
  });

  const handleRefreshFlowDataClick = useCallback(
    () => {
      dispatch(
        actions.suiteScript.sampleData.request(
          {
            ssLinkedConnectionId,
            integrationId,
            flowId,
            options: {
              refreshCache: true,
            },
          }
        )
      );
    }, [dispatch, flowId, integrationId, ssLinkedConnectionId]
  );

  const handleRefreshGenerateDataClick = useCallback(
    () => {
      dispatch(
        actions.suiteScript.mapping.refreshGenerates()
      );
    },
    [dispatch],
  );

  return (
    <div className={classes.header}>
      <div className={classes.headerChild}>
        <Typography
          variant="h5"
          className={clsx(classes.topHeading, {
          })}>
          {extractLabel}
        </Typography>
        { !isExtractsLoading && (
        <RefreshButton
          disabled={disabled}
          onClick={handleRefreshFlowDataClick}
          className={classes.refreshButton}
          data-test="refreshExtracts"
      />
        )}
        {isExtractsLoading && (
        <SpinnerLoader className={classes.spinner} />
        )}
      </div>
      <div className={clsx(classes.headerChild, classes.headerChildRight)}>

        <Typography
          variant="h5"
          className={clsx(classes.topHeading)}>
          {generateLabel}
        </Typography>
        {!isGeneratesLoading && (
        <RefreshButton
          disabled={disabled}
          onClick={handleRefreshGenerateDataClick}
          className={classes.refreshButton}
          data-test="refreshGenerates"
        />
        )}
        {isGeneratesLoading && (
        <SpinnerLoader className={classes.spinner} />
        )}
      </div>
    </div>
  );
}
