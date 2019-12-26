import { useCallback, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import {
  makeStyles,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
} from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import RefreshIcon from '../icons/RefreshIcon';
import CeligoSelect from '../CeligoSelect';
import IconTextButton from '../IconTextButton';
import FlowSelector from './FlowSelector';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',

    '& > *': {
      marginRight: 10,
      '&:first-child': {
        marginLeft: 10,
      },
    },
  },
  filterButton: {
    borderRadius: theme.spacing(0.5),
    height: theme.spacing(4.5),
  },
  retry: {
    minWidth: 90,
  },
  resolve: {
    minWidth: 100,
  },
  status: {
    minWidth: 134,
  },
  hideEmptyLabel: {
    marginTop: theme.spacing(0.5),
  },
  rightActionContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignContent: 'center',
  },
  pagingText: {
    alignSelf: 'center',
  },
  refreshButton: {
    marginRight: theme.spacing(1),
  },
  hideLabel: {
    marginLeft: '10px',
  },
}));

function Filters({
  integrationId,
  flowId,
  filterKey,
  onActionClick,
  numJobsSelected = 0,
  disableActions = true,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  // #region data-layer selectors
  const { paging = {}, totalJobs = 0 } = useSelector(state =>
    selectors.flowJobsPagingDetails(state)
  );
  const {
    storeId,
    flowId: filterFlowId,
    status = 'all',
    hideEmpty = false,
    currentPage = 0,
  } = useSelector(state => selectors.filter(state, filterKey));
  // #endregion
  const { rowsPerPage } = paging;
  const maxPage = Math.ceil(totalJobs / rowsPerPage) - 1;
  const firstRowIndex = rowsPerPage * currentPage;
  const patchFilter = useCallback(
    (key, value) => {
      const filter = { [key]: value };

      // any time a filter changes (that is not setting the page)
      // we need to reset the results to show the first page.
      if (key !== 'currentPage') {
        filter.currentPage = 0;
      }

      if (key === 'storeId') {
        filter.flowId = '';
      }

      dispatch(actions.patchFilter(filterKey, filter));
    },
    [dispatch, filterKey]
  );
  const handlePageChange = useCallback(
    offset => () => {
      patchFilter('currentPage', currentPage + offset);
    },
    [currentPage, patchFilter]
  );
  const handleRefreshClick = useCallback(() => {
    dispatch(actions.job.clear());
    patchFilter('currentPage', 0);
    patchFilter(
      'refreshAt',
      new Date().getTime()
    ); /** We are setting the refreshAt (not sending to api) to make sure the filter changes when user clicks refresh.  */
  }, [dispatch, patchFilter]);

  return (
    <div className={classes.root}>
      <CeligoSelect
        className={clsx(classes.filterButton, classes.retry)}
        data-test="retryJobs"
        onChange={e => onActionClick(e.target.value)}
        displayEmpty
        disabled={disableActions}
        value="">
        <MenuItem value="" disabled>
          Retry
        </MenuItem>
        <MenuItem value="retryAll">All jobs</MenuItem>
        <MenuItem disabled={numJobsSelected === 0} value="retrySelected">
          {numJobsSelected} selected jobs
        </MenuItem>
      </CeligoSelect>

      <CeligoSelect
        disabled={disableActions}
        data-test="resolveJobs"
        className={clsx(classes.filterButton, classes.resolve)}
        onChange={e => onActionClick(e.target.value)}
        displayEmpty
        value="">
        <MenuItem value="" disabled>
          Resolve
        </MenuItem>
        <MenuItem value="resolveAll">All jobs</MenuItem>
        <MenuItem value="resolveSelected" disabled={numJobsSelected === 0}>
          {numJobsSelected} selected jobs
        </MenuItem>
      </CeligoSelect>

      {!flowId && (
        <FlowSelector
          integrationId={integrationId}
          data-test="selectAFlow"
          storeId={storeId}
          value={filterFlowId}
          onChange={flowId => patchFilter('flowId', flowId)}
        />
      )}

      <CeligoSelect
        data-test="flowStatusFilter"
        className={clsx(classes.filterButton, classes.status)}
        onChange={e => patchFilter('status', e.target.value)}
        value={status}>
        {[
          ['all', 'Select Status'],
          ['error', 'Contains Error'],
          ['resolved', 'Contains Resolved'],
          ['running', 'In Progress'],
          ['retrying', 'Retrying'],
          ['queued', 'Queued'],
          ['canceled', 'Canceled'],
          ['completed', 'Completed'],
          ['failed', 'Failed'],
        ].map(opt => (
          <MenuItem key={opt[0]} value={opt[0]}>
            {opt[1]}
          </MenuItem>
        ))}
      </CeligoSelect>
      <div className={classes.hideLabel}>
        <FormControlLabel
          data-test="hideEmptyJobsFilter"
          label="Hide empty jobs"
          classes={{ label: classes.hideEmptyLabel }}
          control={
            <Checkbox
              // indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={hideEmpty}
              data-test="hideEmptyJobs"
              color="primary"
              onChange={e => patchFilter('hideEmpty', e.target.checked)}
            />
          }
        />
      </div>

      <div className={classes.rightActionContainer}>
        <IconTextButton
          className={classes.refreshButton}
          onClick={handleRefreshClick}>
          <RefreshIcon /> Refresh
        </IconTextButton>
        {maxPage > 0 && (
          <Fragment>
            <IconButton
              disabled={currentPage === 0}
              size="small"
              data-test="decrementPage"
              onClick={handlePageChange(-1)}>
              <ArrowLeftIcon />
            </IconButton>
            <div className={classes.pagingText}>
              {firstRowIndex + 1}
              {' - '}
              {currentPage === maxPage
                ? totalJobs
                : firstRowIndex + rowsPerPage}{' '}
              of {totalJobs}
            </div>
            <IconButton
              data-test="incrementPage"
              disabled={maxPage === currentPage}
              size="small"
              onClick={handlePageChange(1)}>
              <ArrowRightIcon />
            </IconButton>
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default Filters;
