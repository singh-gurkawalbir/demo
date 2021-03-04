import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import { selectors } from '../../../../reducers';
import CeligoSelect from '../../../CeligoSelect';
import actions from '../../../../actions';
import useConfirmDialog from '../../../ConfirmDialog';
import { MAX_ERRORS_TO_RETRY_OR_RESOLVE } from '../../../../utils/errorManagement';
import Spinner from '../../../Spinner';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
  },
  actionBtn: {
    borderRadius: theme.spacing(0.5),
    height: theme.spacing(4),
  },
  retryBtn: {
    minWidth: 100,
    marginLeft: 10,
  },
  resolveBtn: {
    minWidth: 115,
  },
  loading: {
    verticalAlign: 'middle',
  },
  noPadding: {
    '& >.MuiSelect-selectMenu': {
      padding: 0,
    },
  },
}));

function getAllErrorsLabelToResolve(count, hasSearchFilter) {
  if (count >= MAX_ERRORS_TO_RETRY_OR_RESOLVE) {
    return `${MAX_ERRORS_TO_RETRY_OR_RESOLVE} ${hasSearchFilter ? 'matching' : ''} errors`;
  }

  if (hasSearchFilter) {
    return 'All matching errors';
  }

  return 'All errors';
}
function getAllErrorsLabelToRetry(count, hasSearchFilter) {
  if (count >= MAX_ERRORS_TO_RETRY_OR_RESOLVE) {
    return `${MAX_ERRORS_TO_RETRY_OR_RESOLVE} retriable ${hasSearchFilter ? 'matching' : ''} errors`;
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
          color: 'secondary',
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
        Retry { isRetryInProgress && <Spinner size={16} className={classes.loading} />}
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
          color: 'secondary',
        },
      ],
    });
  }, [confirmDialog, onClick, allErrorsLabel]);

  return (
    <CeligoSelect
      className={clsx(classes.actionBtn, classes.resolveBtn, { [classes.noPadding]: disableResolve && !isResolveInProgress })}
      data-test="retryJobs"
      onChange={handleResolve}
      disabled={disableResolve}
      displayEmpty
      value="">
      <MenuItem value="" disabled>
        Resolve  { isResolveInProgress && <Spinner size={16} className={classes.loading} />}
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

  const retryErrors = useCallback(type => {
    dispatch(
      actions.errorManager.flowErrorDetails.retry({
        flowId,
        resourceId,
        isResolved,
        retryAll: type === 'all',
      })
    );
  }, [dispatch, flowId, isResolved, resourceId]);

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
          color: 'secondary',
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

  const disableRetryAction = isFlowDisabled || isAnyActionInProgress;
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
        <RetryAction
          onClick={handleRetryAction}
          flowId={flowId}
          resourceId={resourceId}
          isResolved={isResolved}
          isSearchFilterApplied={isSearchFilterApplied}
          disable={disableRetryAction} />
      </div>
    </div>
  );
}
