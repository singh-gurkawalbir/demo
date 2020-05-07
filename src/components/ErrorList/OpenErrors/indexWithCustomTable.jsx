import { useCallback, useEffect, Fragment, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import actions from '../../../actions';
import { generateNewId } from '../../../utils/resource';
import { resourceErrors, errorRetryDataKeys, filter } from '../../../reducers';
import CeligoPaginatedTable from '../../CeligoPaginatedTable';
import metadata from './metadata';
import KeywordSearch from '../../KeywordSearch';

const useStyles = makeStyles(theme => ({
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
  const [selectedErrorIds, setSelectedErrorIds] = useState([]);
  const [tableKey, setTableKey] = useState(generateNewId());
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
  const areSelectedErrorsRetriable = useSelector(
    state =>
      !!errorRetryDataKeys(state, {
        flowId,
        resourceId,
        errorIds: selectedErrorIds,
      }).length
  );
  const actionProps = { filterKey, defaultFilter, resourceId, flowId };
  const { status, errors: openErrors = [], nextPageURL } = useSelector(state =>
    resourceErrors(state, {
      flowId,
      resourceId,
      options: { ...errorFilter },
    })
  );

  useEffect(() => {
    if (!status) {
      dispatch(
        actions.errorManager.flowErrorDetails.request({
          flowId,
          resourceId,
        })
      );
    }
  }, [dispatch, flowId, resourceId, status]);

  const fetchMoreData = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.request({
        flowId,
        resourceId,
        loadMore: true,
      })
    );
  }, [dispatch, flowId, resourceId]);
  const onSelectChange = useCallback(selected => {
    const selectedIds = Object.entries(selected)
      .filter(([errorId, isSelected]) => !!(errorId && isSelected))
      .map(([errorId]) => errorId);

    setSelectedErrorIds(selectedIds);
  }, []);
  const paginationOptions = useMemo(
    () => ({
      rowsPerPage: 10,
      rowsPerPageOptions: [10, 25, 50, 100],
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
        errorIds: selectedErrorIds,
      })
    );

    setTableKey(generateNewId());
    setSelectedErrorIds([]);
  }, [dispatch, flowId, resourceId, selectedErrorIds]);
  const resolveErrors = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.resolve({
        flowId,
        resourceId,
        errorIds: selectedErrorIds,
      })
    );
    setTableKey(generateNewId());
    setSelectedErrorIds([]);
  }, [dispatch, flowId, resourceId, selectedErrorIds]);

  return (
    <Fragment>
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
            disabled={!selectedErrorIds.length}
            onClick={resolveErrors}>
            Resolve
          </Button>
        </div>
      ) : null}
      <div className={classes.search}>
        <KeywordSearch filterKey={filterKey} defaultFilter={defaultFilter} />
      </div>
      <Fragment>
        <CeligoPaginatedTable
          data={openErrors}
          key={tableKey}
          filterKey={filterKey}
          selectableRows
          onSelectChange={onSelectChange}
          resourceKey="errorId"
          {...metadata}
          actionProps={actionProps}
          paginationOptions={paginationOptions}
        />
      </Fragment>
    </Fragment>
  );
}
