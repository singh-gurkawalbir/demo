import React, {useCallback} from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import clsx from 'clsx';
import actions from '../../actions';
import {selectors} from '../../reducers';

import IconTextButton from '../IconTextButton';
import RefreshIcon from '../icons/RefreshIcon';
import Spinner from '../Spinner';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    padding: theme.spacing(0, 0, 0, 1),
  },
  refreshButton: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
  },
  topHeading: {
    fontFamily: 'Roboto500',
  },
  spinner: {
    marginLeft: 5,
    width: 50,
    height: 50,
  },
  childHeader: {
    textAlign: 'center',
    width: '46%',
    '& > div': {
      width: '100%',
    },
  },
}));

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
    const generateStatus = selectors.getImportSampleData(state, resourceId, {});

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

  function RefreshButton(props) {
    return (
      <IconTextButton
        variant="contained"
        color="secondary"
        className={classes.refreshButton}
        {...props}>
        Refresh <RefreshIcon />
      </IconTextButton>
    );
  }

  return (
    <div className={classes.header}>
      <Typography
        variant="h5"
        className={clsx(classes.childHeader, classes.topHeading, {
          // [classes.topHeadingCustomWidth]: mappingPreviewType,
        })}>
        {extractLabel}
        { !isExtractsLoading && (
          <RefreshButton
            disabled={disabled}
            onClick={handleRefreshFlowDataClick}
            data-test="refreshExtracts"
      />
        )}
        {isExtractsLoading && (
          <SpinnerLoader className={classes.spinner} />
        )}
      </Typography>

      <Typography
        variant="h5"
        className={clsx(classes.childHeader, classes.topHeading)}>
        {generateLabel}
        {isGenerateRefreshSupported && !isGeneratesLoading && (
          <RefreshButton
            disabled={disabled}
            onClick={handleRefreshGenerateDataClick}
            data-test="refreshGenerates"
      />
        )}
        {isGeneratesLoading && (
        <SpinnerLoader className={classes.spinner} />
        )}
      </Typography>
    </div>
  );
}
