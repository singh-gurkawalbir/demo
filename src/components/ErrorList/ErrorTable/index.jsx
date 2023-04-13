import makeStyles from '@mui/styles/makeStyles';
import { Divider } from '@mui/material';
import clsx from 'clsx';
import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { matchPath, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../actions';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';
import { FILTER_KEYS } from '../../../utils/errorManagement';
import NoResultTypography from '../../NoResultTypography';
import ResourceTable from '../../ResourceTable';
import ErrorDetailsPanel from './ErrorDetailsPanel';
import ErrorTableFilters from './ErrorTableFilters';
import FetchErrorsHook from './hooks/useFetchErrors';
import { useEditRetryConfirmDialog } from './hooks/useEditRetryConfirmDialog';
import { NO_RESULT_SEARCH_MESSAGE, OPEN_ERRORS_VIEW_TYPES } from '../../../constants';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import messageStore from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  hide: {
    display: 'none',
  },
  errorDetailsTable: {
    wordBreak: 'break-word',
    overflow: 'auto',
    height: 'calc(100vh - 320px)',
    '& th': {
      wordBreak: 'normal',
    },
  },
  errorTableWrapper: {
    height: '100%',
  },
  errorList: {
    display: 'flex',
    flexDirection: 'row',
    flexBasis: '40%',
  },
  errorTable: {
    wordBreak: 'break-word',
    overflow: 'auto',
    height: 'calc(100vh - 320px)',
    '& th': {
      wordBreak: 'normal',
    },
    '&:focus': {
      outline: 'inherit',
    },
  },
  errorTableWithErrorsInRun: {
    height: 'calc(100vh - 361px)',
  },
  errorDetailsPanel: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  baseFormWithPreview: {
    display: 'grid',
    gridTemplateColumns: '60% 1% 39%',
    gridColumnGap: theme.spacing(0.5),
  },
  resourceFormWrapper: {
    overflow: 'auto',
    paddingBottom: theme.spacing(1),
    '& .MuiTableCell-root': {
      padding: theme.spacing(1),
    },
    '& .MuiFormControlLabel-root': {
      marginRight: 0,
    },
    [theme.breakpoints.down('xl')]: {
      width: '150%',
    },
  },
  panelWrapper: {
    width: '100%',
    overflow: 'auto',
  },
  partition: {
    display: 'flex',
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: theme.palette.secondary.lightest,
  },
}));

export const useIsFreshLoadData = errorConfig => {
  const errorObj = useSelectorMemo(
    selectors.mkResourceFilteredErrorDetailsSelector,
    errorConfig
  );

  return !!(
    (!errorObj.status || errorObj.status === 'requested') &&
    !errorObj.nextPageURL
  );
};

const ErrorTableWithPanel = ({
  errorsInCurrPage,
  filterKey,
  actionProps,
  isSplitView,
  resourceId,
  isResolved,
  flowId,
  keydownListener,
  onRowClick,
  errorsInRun,
  flowJobId,
  viewType,
}) => {
  const classes = useStyles();
  const tableRef = useRef();
  const drawerRef = useRef();
  const [scrollPosition, setScrollPosition] = useState(0);
  let hasFilter;
  const hasErrors = useSelector(state =>
    selectors.hasResourceErrors(state, { flowId, resourceId, isResolved })
  );
  const retryStatus = useSelector(
    state => selectors.retryStatus(state, flowId, resourceId)
  );
  const filter = useSelector(state => selectors.filter(state, filterKey));

  if (
    (filter.classifications &&
      filter.classifications.length > 0 &&
      filter.classifications.indexOf('all') === -1) ||
    (filter.sources &&
      filter.sources.length > 0 &&
      filter.sources.indexOf('all') === -1)) {
    hasFilter = true;
  }
  const emptyErrorMessage = !hasFilter && !isResolved && !hasErrors && !(retryStatus === 'inProgress');
  const emptyFilterMessage = hasFilter && errorsInCurrPage.length === 0;
  const noSearchResult = hasErrors && filter.keyword && errorsInCurrPage.length === 0;

  useEffect(() => {
    const refEle = tableRef?.current;

    if (isSplitView) {
      refEle?.addEventListener('keydown', keydownListener, true);
    }

    return () => {
      refEle?.removeEventListener('keydown', keydownListener, true);
    };
  }, [isSplitView, keydownListener, tableRef]);

  const handleScrollPosition = event => {
    if (!isResolved) {
      setScrollPosition((event.target.scrollTop / (event.target.scrollHeight - event.target.offsetHeight)) * 100);
    }
  };

  useEffect(() => {
    if (isSplitView && !isResolved) {
      tableRef?.current?.scrollTo(0, (scrollPosition / 100) * (tableRef?.current?.scrollHeight - tableRef?.current?.offsetHeight));
    } else if (!isResolved) {
      drawerRef?.current?.scrollTo(0, (scrollPosition / 100) * (drawerRef?.current?.scrollHeight - drawerRef?.current?.offsetHeight));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSplitView]);

  return isSplitView && !isResolved
    ? (
      <>
        <ErrorTableFilters
          flowId={flowId}
          resourceId={resourceId}
          isResolved={isResolved}
          filterKey={filterKey}
          flowJobId={flowJobId}
          viewType={viewType}
        />
        <div className={classes.baseFormWithPreview}>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <div className={clsx(classes.errorTable, {[classes.errorTableWithErrorsInRun]: errorsInRun})} ref={tableRef} tabIndex={0} onScroll={handleScrollPosition}>
            <ResourceTable
              resources={errorsInCurrPage}
              className={classes.resourceFormWrapper}
              resourceType="splitViewOpenErrors"
              actionProps={actionProps}
              onRowClick={onRowClick}
              size="small"
            />
            {emptyErrorMessage && <EmptyErrorMessage />}
            {emptyFilterMessage && <NoFiltersMessage />}
            {noSearchResult && <NoSearchResultMessage />}
          </div>
          <div className={classes.partition}>
            <Divider
              orientation="vertical"
              className={clsx(classes.divider)}
          />
          </div>
          <div className={classes.errorDetailsPanel}>
            <ErrorDetailsPanel
              errorsInCurrPage={errorsInCurrPage}
              flowId={flowId}
              resourceId={resourceId}
              isResolved={isResolved}
              errorsInRun={errorsInRun}
          />
          </div>
        </div>
      </>
    )
    : (
      <>
        <ErrorTableFilters
          flowId={flowId}
          resourceId={resourceId}
          isResolved={isResolved}
          filterKey={filterKey}
          flowJobId={flowJobId}
          viewType={viewType} />
        <div className={clsx(classes.errorDetailsTable, {[classes.errorTableWithErrorsInRun]: errorsInRun})} ref={drawerRef} onScroll={handleScrollPosition}>
          <ResourceTable
            resources={errorsInCurrPage}
            resourceType={filterKey}
            actionProps={actionProps}
            tableRef={tableRef} />
          {emptyErrorMessage && <EmptyErrorMessage />}
          {emptyFilterMessage && <NoFiltersMessage />}
          {noSearchResult && <NoSearchResultMessage />}
        </div>
      </>
    );
};
const EmptyErrorMessage = () => (
  <NoResultTypography>
    <br />
    {messageStore('NO_RESULT', {message: 'open errors'})}
    <br />
    <br />
    If <b>Refresh errors</b> is enabled, you can click it to retrieve additional
    errors.
  </NoResultTypography>
);

const NoFiltersMessage = () => (
  <NoResultTypography>
    <br />
    {messageStore('NO_RESULT', {message: 'errors that match the filters you applied.'})}
    <br />
    Clear all filters to see any errors for this step.
  </NoResultTypography>
);

const NoSearchResultMessage = () => (
  <NoResultTypography>
    <br />
    {NO_RESULT_SEARCH_MESSAGE}
  </NoResultTypography>
);

export default function ErrorTable({
  flowId,
  resourceId,
  isResolved,
  flowJobId,
  errorsInRun,
}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const {pathname} = useLocation();
  const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;
  const matchOpenErrorDrawerPath = matchPath(pathname, {
    path: buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V2.OPEN_ERROR_VIEW,
      baseUrl: match.url,
    }),
  });
  const {viewType} = matchOpenErrorDrawerPath?.params || {};

  const isAnyActionInProgress = useSelector(state =>
    selectors.isAnyActionInProgress(state, { flowId, resourceId })
  );
  const isFlowDisabled = useSelector(
    state => selectors.resource(state, 'flows', flowId)?.disabled
  );

  const errorConfig = useMemo(
    () => ({
      flowId,
      resourceId,
      isResolved,
    }),
    [isResolved, flowId, resourceId]
  );

  const errorsInCurrPage = useSelectorMemo(
    selectors.mkResourceFilteredErrorsInCurrPageSelector,
    errorConfig
  );

  const isFreshDataLoad = useIsFreshLoadData(errorConfig);

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
  const dispatch = useDispatch();
  const errorFilter = useSelector(
    state => selectors.filter(state, FILTER_KEYS.OPEN),
    shallowEqual
  );
  const isSplitView = filterKey === FILTER_KEYS.OPEN && viewType !== OPEN_ERRORS_VIEW_TYPES.LIST;
  const showRetryDataChangedConfirmDialog = useEditRetryConfirmDialog({flowId, resourceId, isResolved});
  const keydownListener = useCallback(event => {
    if (!isSplitView) {
      return;
    }
    const currIndex = errorsInCurrPage.findIndex(eachError => eachError.errorId === errorFilter.activeErrorId);

    // up arrow key
    if (event.keyCode === 38) {
      event.preventDefault();
      if (currIndex === 0) {
        return;
      }
      showRetryDataChangedConfirmDialog(() => {
        dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
          activeErrorId: errorsInCurrPage[currIndex - 1]?.errorId,
        }));
      });

      return;
    }

    // down arrow key
    if (event.keyCode === 40) {
      event.preventDefault();
      if (currIndex === errorsInCurrPage.length - 1) {
        return;
      }
      showRetryDataChangedConfirmDialog(() => {
        dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
          activeErrorId: errorsInCurrPage[currIndex + 1]?.errorId,
        }));
      });
    }
  }, [errorFilter.activeErrorId, dispatch, errorsInCurrPage, isSplitView, showRetryDataChangedConfirmDialog]);

  const onRowClick = useCallback(({ rowData, dispatch, event }) => {
    if (event?.target?.type !== 'checkbox' && errorFilter.activeErrorId !== rowData.errorId) {
      showRetryDataChangedConfirmDialog(() => {
        dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
          activeErrorId: rowData.errorId,
        }));
      });
    }
  }, [errorFilter.activeErrorId, showRetryDataChangedConfirmDialog]);

  useEffect(() => {
    const currIndex = errorsInCurrPage.findIndex(
      eachError => eachError.errorId === errorFilter.activeErrorId
    );

    if (errorFilter.activeErrorId !== '' && currIndex < 0 && isSplitView) {
      dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
        activeErrorId: errorsInCurrPage[0]?.errorId,
      }));
    }
  }, [errorsInCurrPage, errorFilter.activeErrorId, dispatch, isSplitView]);

  useEffect(() => {
    // when search keyword changes, first error in the page should be selected
    if (isSplitView) {
      dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
        activeErrorId: errorsInCurrPage[0]?.errorId,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, errorFilter.keyword]);

  useEffect(() => {
    if (viewType && !errorFilter.view) {
      dispatch(actions.patchFilter(filterKey, {
        view: viewType,
      }));
    }
  });
  useEffect(() => {
    if (!isResolved && !viewType) {
      // on initial load of the component, set viewType to 'split' by default
      history.replace(buildDrawerUrl({
        path: drawerPaths.ERROR_MANAGEMENT.V2.OPEN_ERROR_VIEW,
        baseUrl: match.url,
        params: { viewType: errorFilter.view || OPEN_ERRORS_VIEW_TYPES.SPLIT },
      }));
    }
  }, [errorFilter.view, history, isResolved, match.url, viewType]);

  return (
    <div className={clsx(classes.errorTableWrapper)}>
      <FetchErrorsHook
        flowId={flowId}
        flowJobId={flowJobId}
        resourceId={resourceId}
        isResolved={isResolved}
        filterKey={filterKey}
      />
      {isFreshDataLoad ? (
        <Spinner center="screen" />
      ) : (
        <>
          <ErrorTableWithPanel
            errorsInCurrPage={errorsInCurrPage}
            filterKey={filterKey}
            actionProps={actionProps}
            resourceId={resourceId}
            isSplitView={isSplitView}
            flowId={flowId}
            isResolved={isResolved}
            keydownListener={keydownListener}
            onRowClick={onRowClick}
            errorsInRun={errorsInRun}
            flowJobId={flowJobId}
            viewType={viewType}
          />
        </>
      )}
    </div>
  );
}
