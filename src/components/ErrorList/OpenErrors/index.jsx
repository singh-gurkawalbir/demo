import { useCallback, useEffect, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import actions from '../../../actions';
import IconTextButton from '../../IconTextButton';
import {
  resourceErrors,
  filter,
  selectedRetryIds,
  selectedErrorIds,
} from '../../../reducers';
import metadata from './metadata';
import KeywordSearch from '../../KeywordSearch';
import ErrorTable from '../ErrorTable';

const useStyles = makeStyles(theme => ({
  tablePaginationRoot: {
    float: 'right',
  },
  search: {
    width: '300px',
    paddingTop: theme.spacing(1),
    float: 'left',
  },
  actionButtonsContainer: {
    position: 'relative',
    top: '30px',
    left: `calc(100% - ${500}px)`,
    '& > button': {
      marginLeft: '10px',
    },
  },
}));

export default function OpenErrors({ flowId, resourceId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const defaultFilter = useMemo(
    () => ({
      searchBy: ['message', 'source', 'code', 'occurredAt'],
    }),
    []
  );
  const filterKey = `openErrors-${flowId}-${resourceId}`;
  const errorFilter = useSelector(
    state => filter(state, filterKey) || defaultFilter
  );
  const actionProps = { filterKey, defaultFilter, resourceId, flowId };
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
  const areSelectedErrorsRetriable = useSelector(
    state =>
      !!selectedRetryIds(state, {
        flowId,
        resourceId,
      }).length
  );
  const isAtleastOneErrorSelected = useSelector(
    state =>
      !!selectedErrorIds(state, {
        flowId,
        resourceId,
      }).length
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
  const retryErrors = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.retry({
        flowId,
        resourceId,
      })
    );
  }, [dispatch, flowId, resourceId]);
  const resolveErrors = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.resolve({
        flowId,
        resourceId,
      })
    );
  }, [dispatch, flowId, resourceId]);

  useEffect(() => {
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
  }, [
    dispatch,
    fetchMoreData,
    flowId,
    nextPageURL,
    openErrors.length,
    outdated,
    requestOpenErrors,
    resourceId,
    status,
  ]);

  return (
    <Fragment>
      {outdated && (
        <div>
          <IconTextButton onClick={() => requestOpenErrors()}>
            Refresh
          </IconTextButton>
        </div>
      )}
      {openErrors.length ? (
        <div className={classes.actionButtonsContainer}>
          <Button
            variant="outlined"
            disabled={!areSelectedErrorsRetriable}
            onClick={retryErrors}>
            Retry
          </Button>
          <Button
            variant="outlined"
            disabled={!isAtleastOneErrorSelected}
            onClick={resolveErrors}>
            Resolve
          </Button>
        </div>
      ) : null}
      <div className={classes.search}>
        <KeywordSearch filterKey={filterKey} defaultFilter={defaultFilter} />
      </div>
      <ErrorTable
        paginationOptions={paginationOptions}
        metadata={metadata}
        data={openErrors}
        actionProps={actionProps}
      />
    </Fragment>
  );
}
