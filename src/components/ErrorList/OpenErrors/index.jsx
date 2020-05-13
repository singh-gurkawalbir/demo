import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useRouteMatch,
  useHistory,
  matchPath,
  useLocation,
} from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import {
  resourceErrors,
  filter,
  isAnyErrorActionInProgress,
} from '../../../reducers';
import metadata from './metadata';
import KeywordSearch from '../../KeywordSearch';
import ErrorTable from '../ErrorTable';
import RefreshCard from '../components/RefreshCard';
import ErrorActions from '../components/ErrorActions';
import Spinner from '../../Spinner';
import RightDrawer from '../../drawer/Right';
import ErrorDetails from '../ErrorDetails';

const useStyles = makeStyles(theme => ({
  tablePaginationRoot: {
    float: 'right',
  },
  search: {
    width: '300px',
    paddingTop: theme.spacing(1),
    float: 'left',
  },
  hide: {
    display: 'none',
  },
  loading: {
    textAlign: 'center',
    position: 'relative',
    top: 100,
    width: '100%',
  },
}));
const defaultFilter = {
  searchBy: ['message', 'source', 'code', 'occurredAt'],
};

export default function OpenErrors({ flowId, resourceId, show }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const match = useRouteMatch();
  const { pathname } = useLocation();
  const history = useHistory();
  const filterKey = `openErrors-${flowId}-${resourceId}`;
  const errorFilter = useSelector(
    state => filter(state, filterKey) || defaultFilter
  );
  const { errors: allErrors = [] } = useSelector(state =>
    resourceErrors(state, {
      flowId,
      resourceId,
    })
  );
  const {
    status,
    errors: openErrors = [],
    nextPageURL,
    outdated = false,
  } = useSelector(state =>
    resourceErrors(state, {
      flowId,
      resourceId,
      options: { ...errorFilter },
    })
  );
  const isAnyActionInProgress = useSelector(state =>
    isAnyErrorActionInProgress(state, {
      flowId,
      resourceId,
    })
  );
  const isFreshDataLoad = (!status || status === 'requested') && !nextPageURL;
  const actionProps = useMemo(
    () => ({
      filterKey,
      defaultFilter,
      resourceId,
      flowId,
      actionInProgress: isAnyActionInProgress,
    }),
    [filterKey, flowId, isAnyActionInProgress, resourceId]
  );
  const requestOpenErrors = useCallback(
    loadMore =>
      dispatch(
        actions.errorManager.flowErrorDetails.request({
          flowId,
          resourceId,
          loadMore,
        })
      ),
    [dispatch, flowId, resourceId]
  );
  const fetchMoreData = useCallback(() => requestOpenErrors(true), [
    requestOpenErrors,
  ]);
  const paginationOptions = useMemo(
    () => ({
      loadMoreHandler: fetchMoreData,
      hasMore: !!nextPageURL,
      loading: status === 'requested',
    }),
    [fetchMoreData, nextPageURL, status]
  );

  useEffect(() => {
    if (show) {
      if (!status) {
        requestOpenErrors();
      }

      if (
        status === 'received' &&
        !openErrors.length &&
        outdated &&
        nextPageURL
      ) {
        fetchMoreData();
      }
    }
  }, [
    dispatch,
    fetchMoreData,
    flowId,
    nextPageURL,
    openErrors.length,
    outdated,
    requestOpenErrors,
    resourceId,
    show,
    status,
  ]);

  useEffect(
    () => () => {
      dispatch(
        actions.errorManager.flowErrorDetails.clear({
          flowId,
          resourceId,
        })
      );
    },
    [dispatch, flowId, resourceId]
  );

  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);
  // Controls the nested drawer to open error details only when it is a valid errorId
  // TODO : @Raghu check for a better way to control
  const showDrawer = useMemo(() => {
    if (!match.isExact) {
      const matchErrorPath = matchPath(pathname, {
        path: `${match.url}/details/:errorId/:mode`,
      });

      if (!matchErrorPath || !matchErrorPath.params) return false;
      const { errorId } = matchErrorPath.params;

      if (!errorId) return false;

      return allErrors.some(error => error.errorId === errorId);
    }
  }, [allErrors, match.isExact, match.url, pathname]);

  useEffect(() => {
    if (!showDrawer && allErrors.length && !match.isExact) {
      // Incase of an invalid nested url, redirects to current url
      history.replace(match.url);
    }
  }, [allErrors.length, history, match.isExact, match.url, showDrawer]);

  return (
    <div className={clsx({ [classes.hide]: !show })}>
      {!isFreshDataLoad ? <RefreshCard onRefresh={requestOpenErrors} /> : null}
      {openErrors.length ? (
        <ErrorActions flowId={flowId} resourceId={resourceId} />
      ) : null}
      <div className={classes.search}>
        <KeywordSearch filterKey={filterKey} defaultFilter={defaultFilter} />
      </div>
      {isFreshDataLoad ? (
        <div className={classes.loading}>
          Loading Errors <Spinner size={20} />
        </div>
      ) : (
        <ErrorTable
          paginationOptions={paginationOptions}
          metadata={metadata}
          data={openErrors}
          actionProps={actionProps}
          emptyRowsLabel="No Open errors"
        />
      )}

      {showDrawer ? (
        <RightDrawer
          path="details/:errorId/:mode"
          width="full"
          title="Error Record"
          variant="temporary"
          hideBackButton>
          <ErrorDetails
            flowId={flowId}
            resourceId={resourceId}
            onClose={handleClose}
          />
        </RightDrawer>
      ) : null}
    </div>
  );
}
