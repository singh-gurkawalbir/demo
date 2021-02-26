import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import KeywordSearch from '../../KeywordSearch';
import RefreshCard from './RefreshCard';
import ErrorActions from './ErrorActions';
import Spinner from '../../Spinner';
import SpinnerWrapper from '../../SpinnerWrapper';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import CeligPagination from '../../CeligoPagination';
import ResourceTable from '../../ResourceTable';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { FILTER_KEYS, DEFAULT_FILTERS } from '../../../utils/errorManagement';

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
          height: '100%',
        },
      },
    },

  },
  hide: {
    display: 'none',
  },
  header: {
    paddingBottom: theme.spacing(3),
    display: 'flex',
  },
  tablePaginationRoot: {
    float: 'right',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 18,
    whiteSpace: 'nowrap',
    marginLeft: theme.spacing(2),
  },
  emptyRow: {
    position: 'relative',
    top: 100,
    textAlign: 'center',
  },
  errorDetailsTable: {
    wordBreak: 'break-word',
  },
  refreshBtn: {
    marginLeft: theme.spacing(2),
  },
  errorActions: {
    position: 'relative',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
    '&:after': {
      content: "''",
      position: 'absolute',
      width: '1px',
      height: '75%',
      top: '15%',
      backgroundColor: theme.palette.secondary.lightest,
      right: theme.spacing(-2),
    },
  },
  errorTableWrapper: {
    position: 'relative',
    height: '100%',
  },
  PaginationWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  filtersErrorTable: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const rowsPerPageOptions = [10, 25, 50];
const DEFAULT_ROWS_PER_PAGE = 50;
const emptySet = [];

export default function ErrorTable({ flowId, resourceId, show, isResolved }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const defaultFilter = isResolved ? DEFAULT_FILTERS.RESOLVED : DEFAULT_FILTERS.OPEN;
  const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;

  useEffect(() => {
    dispatch(actions.patchFilter(filterKey, defaultFilter));
  },
  [defaultFilter, dispatch, filterKey]);
  const errorFilter = useSelector(
    state => selectors.filter(state, filterKey)
  );
  const isAnyActionInProgress = useSelector(state =>
    selectors.isAnyErrorActionInProgress(state, {
      flowId,
      resourceId,
    })
  );
  const isFlowDisabled = useSelector(state =>
    selectors.resource(state, 'flows', flowId)?.disabled
  );

  const errorConfig = useMemo(() => ({
    flowId,
    resourceId,
    options: {...(errorFilter || {}), isResolved},
  }), [errorFilter, isResolved, flowId, resourceId]);

  const errorObj = useSelectorMemo(selectors.makeResourceErrorsSelector, errorConfig);

  const hasErrors = useSelector(
    state => {
      const errors = selectors.getErrors(state, {
        flowId,
        resourceId,
        errorType: isResolved ? 'resolved' : 'open',
      })?.errors || [];

      return !!errors.length;
    });

  if (!errorObj.errors) {
    errorObj.errors = emptySet;
  }

  const isFreshDataLoad = !!((!errorObj.status || errorObj.status === 'requested') && !errorObj.nextPageURL);
  const actionProps = useMemo(
    () => ({
      resourceId,
      flowId,
      actionInProgress: isAnyActionInProgress,
      isResolved,
      isFlowDisabled,
    }),
    [flowId, isAnyActionInProgress, resourceId, isResolved, isFlowDisabled]
  );
  const fetchErrors = useCallback(
    loadMore => {
      if (!loadMore) {
        dispatch(actions.clearFilter(filterKey));
      }
      dispatch(
        actions.errorManager.flowErrorDetails.request({
          flowId,
          resourceId,
          loadMore,
          isResolved,
        })
      );
    },
    [dispatch, flowId, resourceId, isResolved, filterKey]
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
  const handleDownload = useCallback(() => {
    history.push(`${match.url}/download/${isResolved ? 'resolved' : 'open'}`);
  }, [match.url, history, isResolved]);

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

  useEffect(() => {
    setPage(0);
  }, [errorFilter, rowsPerPage]);

  // TODO @Raghu: Refactor the pagination related code
  return (
    <div className={clsx(classes.errorTableWrapper, { [classes.hide]: !show })}>
      {isFreshDataLoad ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <>
          <div className={classes.filtersErrorTable}>
            <div className={classes.header}>
              {
            hasErrors &&
              (
                <div className={classes.errorsKeywordSearch}>
                  <KeywordSearch filterKey={filterKey} />
                </div>
              )
            }
              {
              !!errorObj.errors.length &&
              <ErrorActions flowId={flowId} resourceId={resourceId} isResolved={isResolved} className={classes.errorActions} />

            }
              <div className={classes.refreshBtn}>
                <RefreshCard onRefresh={fetchErrors} disabled={!errorObj.updated || isFreshDataLoad} />
              </div>
            </div>
            <div className={classes.PaginationWrapper}>
              {!!errorObj.errors.length && (
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
              )}
              {
                hasErrors && (
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.btnActions}
                  onClick={handleDownload}>
                  Download
                </Button>
                )
              }

            </div>
          </div>
          <ResourceTable
            resources={errorsInCurrentPage}
            className={classes.errorDetailsTable}
            resourceType={filterKey}
            actionProps={actionProps}
          />
        </>
      )}
    </div>
  );
}
