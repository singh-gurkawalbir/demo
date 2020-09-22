import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import KeywordSearch from '../../KeywordSearch';
import RefreshCard from './RefreshCard';
import ErrorActions from './ErrorActions';
import Spinner from '../../Spinner';
import ErrorDetailsDrawer from './ErrorDetailsDrawer';
import SpinnerWrapper from '../../SpinnerWrapper';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import CeligPagination from '../../CeligoPagination';
import ResourceTable from '../../ResourceTable';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  errorsKeywordSearch: {
    width: '250px',
    float: 'left',
    '& > div:first-child': {
      background: theme.palette.common.white,
      '& > div[class*="MuiInputBase-root"]': {
        width: '100%',
        '& > input': {
          width: '100%',
        },
      },
    },

  },
  hide: {
    display: 'none',
  },
  header: {
    paddingBottom: theme.spacing(3),
    display: 'inline-flex',
    justifyContent: 'space-between',
    width: '68%',
  },
  tablePaginationRoot: {
    float: 'right',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 18,
  },
  emptyRow: {
    position: 'relative',
    top: 100,
    textAlign: 'center',
  },
  errorDetailsTable: {
    wordBreak: 'break-word',
  },
}));
const defaultOpenErrorsFilter = {
  searchBy: ['message', 'source', 'code', 'occurredAt', 'traceKey'],
};

const defaultResolvedErrorsFilter = {
  searchBy: ['message', 'source', 'code', 'occurredAt', 'resolvedBy'],
};

const rowsPerPageOptions = [10, 25, 50];
const DEFAULT_ROWS_PER_PAGE = 50;
const emptySet = [];

export default function ErrorTable({ flowId, resourceId, show, isResolved }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const errorType = isResolved ? 'resolvedErrors' : 'openErrors';
  const defaultFilter = isResolved ? defaultResolvedErrorsFilter : defaultOpenErrorsFilter;
  const emptyRowsLabel = isResolved ? 'No resolved errors' : 'No open errors';
  const errorFilter = useSelector(
    state => selectors.filter(state, errorType) || defaultFilter
  );
  const isAnyActionInProgress = useSelector(state =>
    selectors.isAnyErrorActionInProgress(state, {
      flowId,
      resourceId,
    })
  );
  const dataFilter = useSelector(
    state => selectors.filter(state, errorType) || defaultFilter
  );
  const errorConfig = useMemo(() => ({
    flowId,
    resourceId,
    options: {...errorFilter, isResolved},
  }), [errorFilter, isResolved, flowId, resourceId]);

  const errorObj = useSelectorMemo(selectors.mkResourceErrorsSelector, errorConfig);

  if (!errorObj.errors) {
    errorObj.errors = emptySet;
  }

  const isFreshDataLoad = !!((!errorObj.status || errorObj.status === 'requested') && !errorObj.nextPageURL);
  const actionProps = useMemo(
    () => ({
      filterKey: errorType,
      defaultFilter,
      resourceId,
      flowId,
      actionInProgress: isAnyActionInProgress,
      isResolved,
    }),
    [errorType, flowId, isAnyActionInProgress, resourceId, defaultFilter, isResolved]
  );
  const fetchErrors = useCallback(
    loadMore =>
      dispatch(
        actions.errorManager.flowErrorDetails.request({
          flowId,
          resourceId,
          loadMore,
          isResolved,
        })
      ),
    [dispatch, flowId, resourceId, isResolved]
  );
  const fetchMoreErrors = useCallback(() => fetchErrors(true), [
    fetchErrors,
  ]);

  const handleChangeRowsPerPage = useCallback(event => {
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);
  const handleChangePage = useCallback(
    (event, newPage) => setPage(newPage),
    []
  );

  const paginationOptions = useMemo(
    () => ({
      loadMoreHandler: fetchMoreErrors,
      hasMore: !!errorObj.nextPageURL,
      loading: errorObj.status === 'requested',
    }),
    [fetchMoreErrors, errorObj.nextPageURL, errorObj.status]
  );

  const errorsInCurrentPage = useMemo(
    () => errorObj.errors.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [errorObj.errors, page, rowsPerPage]
  );

  useEffect(() => {
    if (show) {
      if (!errorObj.status) {
        fetchErrors();
      }

      if (
        errorObj.status === 'received' &&
          !errorObj.errors.length &&
          errorObj.outdated &&
          errorObj.nextPageURL
      ) {
        fetchMoreErrors();
      }
    }
  }, [
    fetchMoreErrors,
    errorObj.nextPageURL,
    errorObj.errors.length,
    errorObj.outdated,
    fetchErrors,
    show,
    errorObj.status,
  ]);

  useEffect(
    () => () => {
      dispatch(
        actions.errorManager.flowErrorDetails.clear({
          flowId,
          resourceId,
          isResolved,
        })
      );
    },
    [dispatch, flowId, resourceId, isResolved]
  );

  useEffect(() => {
    setPage(0);
  }, [dataFilter, rowsPerPage]);

  return (
    <div className={clsx({ [classes.hide]: !show })}>
      <RefreshCard onRefresh={fetchErrors} disabled={!errorObj.updated || isFreshDataLoad} />
      {isFreshDataLoad ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <>
          <div className={classes.header}>
            <div className={classes.errorsKeywordSearch}>
              <KeywordSearch filterKey={errorType} defaultFilter={defaultFilter} />
            </div>
            {
            !!errorObj.errors.length &&
            <ErrorActions flowId={flowId} resourceId={resourceId} isResolved={isResolved} />
          }

          </div>
          {errorObj.errors.length ? (
            <>
              <CeligPagination
                {...paginationOptions}
                rowsPerPageOptions={rowsPerPageOptions}
                className={classes.tablePaginationRoot}
                count={errorObj.errors.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
          />
              <ResourceTable
                resources={errorsInCurrentPage}
                className={classes.errorDetailsTable}
                resourceType={errorType}
                actionProps={actionProps}
          />
            </>
          ) : (
            <div className={classes.emptyRow}>{emptyRowsLabel || 'No Rows'} </div>
          )}
        </>
      )}
      { !isResolved && <ErrorDetailsDrawer flowId={flowId} resourceId={resourceId} /> }
    </div>
  );
}
