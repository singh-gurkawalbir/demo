import React, {useCallback} from 'react';
import { Typography, makeStyles, IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import actions from '../../actions';
import {selectors} from '../../reducers';
import RefreshIcon from '../icons/RefreshIcon';
import Spinner from '../Spinner';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(1.5),
    alignItems: 'center',
    padding: theme.spacing(0, 0, 0, 1),
    paddingLeft: theme.spacing(3.25),
    '& > div': {
      width: '46%',
      display: 'flex',
    },
  },
  refreshButton: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
    padding: 0,
  },
  topHeading: {
    fontFamily: 'Roboto500',
  },
  spinner: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  childHeader: {
    // width: '46%',
    paddingLeft: theme.spacing(1),
    '& > div': {
      width: '100%',
    },
  },
}));

const RefreshButton = ({className, ...props}) => (
  <IconButton
    variant="contained"
    color="secondary"
    className={className}
    {...props}
      >
    <RefreshIcon />
  </IconButton>
);
const SpinnerLoader = ({className}) => (
  <span className={className}>
    <Spinner size={24} color="primary" />
  </span>
);
export default function TopPanel(props) {
  const {
    flowId,
    resourceId,
    disabled,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const generateLabel = useSelector(state => selectors.mappingExtractGenerateLabel(state, flowId, resourceId, 'generate'));
  const extractLabel = useSelector(state => selectors.mappingExtractGenerateLabel(state, flowId, resourceId, 'extract'));

  const isExtractsLoading = useSelector(state => {
    const extractStatus = selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      stage: 'importMappingExtract',
      resourceType: 'imports',
    }).status;

    return extractStatus === 'requested';
  });
  const isGeneratesLoading = useSelector(state => {
    // todo : subrecord
    const generateStatus = selectors.getImportSampleData(state, resourceId, {}).status;

    return generateStatus === 'requested';
  });
  const isGenerateRefreshSupported = useSelector(state => selectors.mappingImportSampleDataSupported(state, resourceId));

  const handleRefreshFlowDataClick = useCallback(
    () => {
      const refreshCache = true;

      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          'imports',
          'importMappingExtract',
          refreshCache
        )
      );
    }, [dispatch, flowId, resourceId]
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
      <div>
        <Typography
          variant="h5"
          className={clsx(classes.childHeader, classes.topHeading, {
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
      <div>

        <Typography
          variant="h5"
          className={clsx(classes.childHeader, classes.topHeading)}>
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
