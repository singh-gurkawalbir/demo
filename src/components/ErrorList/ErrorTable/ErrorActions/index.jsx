import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import MenuItem from '@mui/material/MenuItem';
import clsx from 'clsx';
import { Tooltip, Typography } from '@mui/material';
import { isEqual } from 'lodash';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import CeligoSelect from '../../../CeligoSelect';
import actions from '../../../../actions';
import useConfirmDialog from '../../../ConfirmDialog';
import { FILTER_KEYS, MAX_ERRORS_TO_RETRY_OR_RESOLVE } from '../../../../utils/errorManagement';
import { useEditRetryConfirmDialog } from '../hooks/useEditRetryConfirmDialog';
import { message } from '../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
  },
  actionBtn: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(0.5),
    height: theme.spacing(4),
  },
  retryBtn: {
    minWidth: 120,
    marginLeft: 10,
  },
  resolveBtn: {
    minWidth: 120,
  },
  noPadding: {
    '& >.MuiSelect-selectMenu': {
      padding: 0,
    },
  },
  spinnerLable: {
    fontSize: '15px',
  },
}));

function getAllErrorsLabelToResolve(count, hasSearchFilter) {
  if (count >= MAX_ERRORS_TO_RETRY_OR_RESOLVE) {
    return `${MAX_ERRORS_TO_RETRY_OR_RESOLVE}${hasSearchFilter ? ' matching' : ''} errors`;
  }

  if (hasSearchFilter) {
    return 'All matching errors';
  }

  return 'All errors';
}
function getAllErrorsLabelToRetry(count, hasSearchFilter) {
  if (count >= MAX_ERRORS_TO_RETRY_OR_RESOLVE) {
    return `${MAX_ERRORS_TO_RETRY_OR_RESOLVE}${hasSearchFilter ? ' matching' : ''} retriable errors`;
  }
  if (hasSearchFilter) {
    return 'All matching retriable errors';
  }

  return 'All retriable errors';
}

const RetryAction = ({ onClick, flowId, resourceId, isResolved, disable, isSearchFilterApplied }) => {
  const classes = useStyles();
  const { confirmDialog } = useConfirmDialog();

  const allRetriableErrorCount = useSelector(state => {
    const {errors = []} = selectors.resourceFilteredErrorDetails(state, {
      flowId,
      resourceId,
      isResolved,
    });

    return errors.filter(error => !!error.retryDataKey).length;
  });

  const selectedRetriableErrorCount = useSelector(state => selectors.selectedRetryIds(state, {
    flowId,
    resourceId,
    isResolved,
  }).length);

  const isRetryInProgress = useSelector(state =>
    selectors.isAnyActionInProgress(state, { flowId, resourceId, actionType: 'retry' })
  );

  const disableRetry = disable || (!selectedRetriableErrorCount && !allRetriableErrorCount);

  const allErrorsLabel = getAllErrorsLabelToRetry(allRetriableErrorCount, isSearchFilterApplied);

  const handleRetry = useCallback(e => {
    if (isResolved || e.target.value === 'selected') {
      return onClick(e);
    }

    confirmDialog({
      title: 'Confirm retry',
      message: `Are you sure you want to retry ${allErrorsLabel.toLowerCase()}?`,
      buttons: [
        {
          label: 'Retry',
          onClick: () => {
            onClick(e);
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, isResolved, onClick, allErrorsLabel]);

  return (
    <CeligoSelect
      className={clsx(classes.actionBtn, classes.retryBtn, { [classes.noPadding]: disableRetry && !isRetryInProgress })}
      data-test="retryJobs"
      onChange={handleRetry}
      disabled={disableRetry}
      displayEmpty
      value="">
      <MenuItem value="" disabled >
        { isRetryInProgress
          ? <Spinner size="small" sx={{verticalAlign: 'middle'}}><Typography className={classes.spinnerLable}>Retry</Typography></Spinner>
          : 'Retry'}
      </MenuItem>
      <MenuItem value="selected" disabled={!selectedRetriableErrorCount}>
        {selectedRetriableErrorCount} retriable {selectedRetriableErrorCount === 1 ? 'error' : 'errors'}
      </MenuItem>
      <MenuItem value="all" disabled={!allRetriableErrorCount}>
        {allErrorsLabel}
      </MenuItem>
    </CeligoSelect>
  );
};

const ResolveAction = ({ onClick, flowId, resourceId, disable, isSearchFilterApplied }) => {
  const classes = useStyles();
  const { confirmDialog } = useConfirmDialog();

  const allErrorCount = useSelector(state => {
    const {errors = []} = selectors.resourceFilteredErrorDetails(state, { flowId, resourceId });

    return errors.length;
  });

  const selectedErrorCount = useSelector(state =>
    selectors.selectedErrorIds(state, { flowId, resourceId }).length
  );

  const isResolveInProgress = useSelector(state =>
    selectors.isAnyActionInProgress(state, { flowId, resourceId, actionType: 'resolve' })
  );

  const disableResolve = disable || (!selectedErrorCount && !allErrorCount);

  const allErrorsLabel = getAllErrorsLabelToResolve(allErrorCount, isSearchFilterApplied);

  const handleResolve = useCallback(e => {
    if (e.target.value === 'selected') {
      return onClick(e);
    }

    confirmDialog({
      title: 'Confirm resolve',
      message: `Are you sure you want to resolve ${allErrorsLabel.toLowerCase()}?`,
      buttons: [
        {
          label: 'Resolve',
          onClick: () => {
            onClick(e);
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, onClick, allErrorsLabel]);

  return (
    <CeligoSelect
      className={clsx(classes.actionBtn, classes.resolveBtn, { [classes.noPadding]: disableResolve && !isResolveInProgress })}
      data-test="resolveJobs"
      onChange={handleResolve}
      disabled={disableResolve}
      displayEmpty
      value="">
      <MenuItem value="" disabled>
        { isResolveInProgress
          ? <Spinner size="small" sx={{verticalAlign: 'middle'}}><Typography className={classes.spinnerLable}>Resolve</Typography></Spinner>
          : 'Resolve'}
      </MenuItem>
      <MenuItem value="selected" disabled={!selectedErrorCount}>
        {selectedErrorCount} selected {selectedErrorCount === 1 ? 'error' : 'errors'}
      </MenuItem>
      <MenuItem value="all" disabled={!allErrorCount}>
        {allErrorsLabel}
      </MenuItem>
    </CeligoSelect>
  );
};

export default function ErrorActions({ flowId, resourceId, isResolved, className }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();

  const isFlowDisabled = useSelector(state =>
    selectors.resource(state, 'flows', flowId)?.disabled
  );

  const isAnyActionInProgress = useSelector(
    state => selectors.isAnyActionInProgress(state, { flowId, resourceId })
  );

  const isSearchFilterApplied = useSelector(state => {
    const errorFilter = selectors.errorFilter(state, {
      flowId,
      resourceId,
      isResolved,
    });

    return !!errorFilter.keyword?.length;
  });

  const showRetryDataChangedConfirmDialog = useEditRetryConfirmDialog({flowId, resourceId, isResolved});
  const retryErrors = useCallback(type => {
    showRetryDataChangedConfirmDialog(
      () => dispatch(
        actions.errorManager.flowErrorDetails.retry({
          flowId,
          resourceId,
          isResolved,
          retryAll: type === 'all',
        })
      )
    );
  }, [dispatch, flowId, isResolved, resourceId, showRetryDataChangedConfirmDialog]);

  const handleRetryAction = useCallback(e => {
    if (!isResolved) {
      return retryErrors(e.target.value);
    }
    // show confirmation dialog for resolved errors trying to be retried
    confirmDialog({
      title: 'Confirm retry',
      message: 'You are requesting to retry one or more errors that have been resolved. The retry data associated with these errors represents the data at the time of the original error, and could be older and/or out of date. Please confirm you would like to proceed.',
      buttons: [
        {
          label: 'Retry',
          onClick: () => {
            retryErrors(e.target.value);
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [retryErrors, isResolved, confirmDialog]);

  const handleResolveAction = useCallback(e => {
    dispatch(
      actions.errorManager.flowErrorDetails.resolve({
        flowId,
        resourceId,
        resolveAll: e.target.value === 'all',
      })
    );
  }, [dispatch, flowId, resourceId]);

  const errorId = useSelector(state => selectors.filter(state, FILTER_KEYS.OPEN)?.activeErrorId);

  const retryId = useSelector(state =>
    selectors.resourceError(state, { flowId, resourceId, errorId, isResolved })?.retryDataKey
  );

  const retryData = useSelector(state => selectors.retryData(state, retryId));
  const userRetryData = useSelector(state => selectors.userRetryData(state, retryId));
  const isRetryDataChanged = userRetryData && !isEqual(retryData, userRetryData);

  const disableRetryAction = isFlowDisabled || isAnyActionInProgress || isRetryDataChanged;
  const disableResolveAction = isAnyActionInProgress;

  return (
    <div className={className}>
      <div className={classes.flexContainer}>
        { !isResolved && (
        <ResolveAction
          onClick={handleResolveAction}
          flowId={flowId}
          resourceId={resourceId}
          isSearchFilterApplied={isSearchFilterApplied}
          disable={disableResolveAction} />
        )}
        <Tooltip title={isRetryDataChanged ? message.ERROR_MANAGEMENT_2.RETRY_ACTION_HOVER_MESSAGE : ''} placement="bottom" >
          <div>
            <RetryAction
              onClick={handleRetryAction}
              flowId={flowId}
              resourceId={resourceId}
              isResolved={isResolved}
              isSearchFilterApplied={isSearchFilterApplied}
              disable={disableRetryAction} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
