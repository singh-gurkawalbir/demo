import React, {useCallback} from 'react';
import { Typography, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../actions';
import {selectors} from '../../reducers';
import RefreshIcon from '../icons/RefreshIcon';

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
    marginLeft: theme.spacing(4),
  },
  headerChildRight: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(8),
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
export default function TopPanel({
  flowId,
  importId,
  disabled,
  subRecordMappingId,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const generateLabel = useSelector(state => selectors.mappingExtractGenerateLabel(state, flowId, importId, 'generate'));
  const extractLabel = useSelector(state => selectors.mappingExtractGenerateLabel(state, flowId, importId, 'extract'));

  const isExtractsLoading = useSelector(state => {
    const extractStatus = selectors.getSampleDataContext(state, {
      flowId,
      resourceId: importId,
      stage: 'importMappingExtract',
      resourceType: 'imports',
    }).status;

    return extractStatus === 'requested';
  });
  const isGeneratesLoading = useSelector(state => {
    const subRecordObj = selectors.mappingSubRecordAndJSONPath(state, importId, subRecordMappingId);
    const generateStatus = selectors.getImportSampleData(state, importId, subRecordObj).status;

    return generateStatus === 'requested';
  });
  const isGenerateRefreshSupported = useSelector(state => selectors.mappingImportSampleDataSupported(state, importId));

  const handleRefreshFlowDataClick = useCallback(
    () => {
      const refreshCache = true;

      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          importId,
          'imports',
          'importMappingExtract',
          refreshCache
        )
      );
    }, [dispatch, flowId, importId]
  );

  const handleRefreshGenerateDataClick = useCallback(
    () => {
      dispatch(
        actions.mapping.refreshGenerates()
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
          // [classes.topHeadingCustomWidth]: mappingPreviewType,
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
        {isGenerateRefreshSupported && !isGeneratesLoading && (
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
