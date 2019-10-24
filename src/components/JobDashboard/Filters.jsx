import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import {
  makeStyles,
  MenuItem,
  Checkbox,
  Select,
  FormControlLabel,
  Button,
  IconButton,
} from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import ArrowRightIcon from '../icons/ArrowRightIcon';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& > *': {
      marginRight: 10,
      // height: 42,
      '&:first-child': {
        marginLeft: 10,
      },
    },
  },
  select: {
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    transitionProperty: 'border',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    overflow: 'hidden',
    height: 42,
    textAlign: 'left',
    borderRadius: 2,
    '& > div': {
      maxWidth: '85%',
    },
    '& > Label': {
      paddingTop: 10,
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '& > *': {
      padding: [[0, 0, 0, 12]],
    },
    '& > div > div ': {
      paddingBottom: 5,
    },
    '& svg': {
      right: 8,
      paddingLeft: 0,
    },
  },
  retry: {
    width: 140,
  },
  resolve: {
    width: 150,
  },
  status: {
    width: 134,
  },
  selectEmpty: {
    marginTop: theme.spacing.double,
  },
  pagingContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignContent: 'center',
  },
  pagingText: {
    alignSelf: 'center',
  },
}));

function Filters({
  integrationId,
  flowId,
  filterKey,
  onFiltersChange,
  onActionClick,
  numJobsSelected = 0,
  disableButtons = true,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [_flowId, setFlowId] = useState('all');
  const [status, setStatus] = useState('all');
  const [hideEmpty, setHideEmpty] = useState(false);
  const { paging = {}, totalJobs = 0 } = useSelector(state =>
    selectors.flowJobsPagingDetails(state)
  );
  const flows = useSelector(
    state => selectors.resourceList(state, { type: 'flows' }).resources
  );
  const patchFilter = useCallback(
    (key, value) => {
      dispatch(actions.patchFilter(filterKey, { [key]: value }));
    },
    [dispatch, filterKey]
  );
  const filteredFlows = flows.filter(flow =>
    !integrationId
      ? !flow._integrationId // standalone integration flows
      : flow._integrationId === integrationId
  );
  const { currentPage, rowsPerPage } = paging;
  const maxPage = Math.ceil(totalJobs / rowsPerPage) - 1;
  const firstRowIndex = rowsPerPage * currentPage;

  function handleChange(event) {
    const { name, value, checked } = event.target;
    const changedFilters = { [name]: name === 'hideEmpty' ? checked : value };

    if (name === '_flowId') {
      setFlowId(changedFilters[name]);
    }

    if (name === 'hideEmpty') {
      setHideEmpty(changedFilters[name]);
    }

    if (name === 'status') {
      setStatus(changedFilters[name]);
    }

    const newFilters = {
      _flowId,
      hideEmpty,
      status,
      ...changedFilters,
    };

    if (!flowId) {
      newFilters.flowId =
        newFilters._flowId === 'all' ? '' : newFilters._flowId;
    }

    delete newFilters._flowId;

    newFilters.numError_gte = newFilters.status === 'error' ? 1 : 0;
    newFilters.numResolved_gte = newFilters.status === 'resolved' ? 1 : 0;
    newFilters.status = ['all', 'error', 'resolved'].includes(newFilters.status)
      ? ''
      : newFilters.status;

    onFiltersChange(newFilters);
  }

  function handleAction(action) {
    console.log(action);
    onActionClick(action);
  }

  function handlePageChange(offset) {
    patchFilter('currentPage', paging.currentPage + offset);
  }

  return (
    <div className={classes.root}>
      {numJobsSelected === 0 ? (
        <Select
          data-test="retryJobs"
          className={clsx(classes.select, classes.retry)}
          onChange={e => handleAction(e.target.value)}
          displayEmpty
          value=""
          IconComponent={ArrowDownIcon}>
          <MenuItem value="" disabled>
            Retry
          </MenuItem>
          <MenuItem value="retryAll">All jobs</MenuItem>
          <MenuItem value="retrySelected">
            {numJobsSelected} selected jobs
          </MenuItem>
        </Select>
      ) : (
        <Button
          data-test="retryAllJobs"
          variant="outlined"
          className={classes.retry}
          onClick={() => handleAction('retryAll')}
          disabled={disableButtons}>
          Retry all jobs
        </Button>
      )}

      {numJobsSelected ? (
        <Select
          data-test="resolveJobs"
          className={clsx(classes.select, classes.resolve)}
          onChange={e => handleAction(e.target.value)}
          displayEmpty
          value=""
          IconComponent={ArrowDownIcon}>
          <MenuItem value="" disabled>
            Resolve
          </MenuItem>
          <MenuItem value="resolveAll">All jobs</MenuItem>
          <MenuItem value="resolveSelected">
            {numJobsSelected} selected jobs
          </MenuItem>
        </Select>
      ) : (
        <Button
          data-test="resolveAllJobs"
          variant="outlined"
          className={classes.resolve}
          onClick={() => handleAction('resolveAll')}
          disabled={disableButtons}>
          Resolve all jobs
        </Button>
      )}

      {!flowId && (
        <Select
          inputProps={{
            name: '_flowId',
            id: '_flowId',
          }}
          className={classes.select}
          onChange={handleChange}
          IconComponent={ArrowDownIcon}
          value={_flowId}>
          <MenuItem key="all" value="all">
            Select a Flow
          </MenuItem>
          {filteredFlows.map(opt => (
            <MenuItem key={opt._id} value={opt._id}>
              {opt.name || opt._id}
            </MenuItem>
          ))}
        </Select>
      )}

      <Select
        inputProps={{
          name: 'status',
          id: 'status',
        }}
        className={clsx(classes.select, classes.status)}
        IconComponent={ArrowDownIcon}
        onChange={handleChange}
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
      </Select>

      <FormControlLabel
        control={
          <Checkbox
            inputProps={{
              name: 'hideEmpty',
              id: 'hideEmpty',
            }}
            // indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={hideEmpty}
            onChange={handleChange}
            color="primary"
          />
        }
        label="Hide empty jobs"
      />
      <div className={classes.pagingContainer}>
        <IconButton
          disabled={currentPage === 0}
          size="small"
          onClick={() => handlePageChange(-1)}>
          <ArrowLeftIcon />
        </IconButton>
        <div className={classes.pagingText}>
          {firstRowIndex + 1} -{' '}
          {currentPage === maxPage ? totalJobs : firstRowIndex + rowsPerPage} of{' '}
          {totalJobs}
        </div>
        <IconButton
          disabled={maxPage === currentPage}
          size="small"
          onClick={() => handlePageChange(1)}>
          <ArrowRightIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Filters;
