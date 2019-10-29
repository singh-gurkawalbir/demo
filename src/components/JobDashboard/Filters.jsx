import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import {
  makeStyles,
  MenuItem,
  Checkbox,
  Select,
  FormControlLabel,
  IconButton,
} from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import ArrowRightIcon from '../icons/ArrowRightIcon';

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
  select: {
    background: theme.palette.background.paper,
    border: '1px solid',
    paddingRight: theme.spacing(3),
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
    minWidth: 90,
  },
  resolve: {
    minWidth: 100,
  },
  status: {
    minWidth: 134,
  },
  flow: {
    minWidth: 130,
    maxWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing.double,
  },
  hideEmptyLabel: {
    marginTop: theme.spacing(0.5),
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
  const flows = useSelector(
    state => selectors.resourceList(state, { type: 'flows' }).resources
  );
  const {
    flowId: _flowId,
    status = 'all',
    hideEmpty = false,
    currentPage = 0,
  } = useSelector(state => selectors.filter(state, filterKey));
  const filteredFlows = flows.filter(flow =>
    !integrationId
      ? !flow._integrationId // standalone integration flows
      : flow._integrationId === integrationId
  );
  // #endregion
  const { rowsPerPage } = paging;
  const maxPage = Math.ceil(totalJobs / rowsPerPage) - 1;
  const firstRowIndex = rowsPerPage * currentPage;

  function patchFilter(key, value) {
    const filter = { [key]: value };

    // any time a filter changes (that is not setting the page)
    // we need to reset the results to show the first page.
    if (key !== 'currentPage') {
      filter.currentPage = 0;
    }

    dispatch(actions.patchFilter(filterKey, filter));
  }

  function handlePageChange(offset) {
    patchFilter('currentPage', currentPage + offset);
  }

  return (
    <div className={classes.root}>
      <Select
        disabled={disableActions}
        data-test="retryJobs"
        className={clsx(classes.select, classes.retry)}
        onChange={e => onActionClick(e.target.value)}
        displayEmpty
        value=""
        IconComponent={ArrowDownIcon}>
        <MenuItem value="" disabled>
          Retry
        </MenuItem>
        <MenuItem value="retryAll">All jobs</MenuItem>
        <MenuItem disabled={numJobsSelected === 0} value="retrySelected">
          {numJobsSelected} selected jobs
        </MenuItem>
      </Select>

      <Select
        disabled={disableActions}
        data-test="resolveJobs"
        className={clsx(classes.select, classes.resolve)}
        onChange={e => onActionClick(e.target.value)}
        displayEmpty
        value=""
        IconComponent={ArrowDownIcon}>
        <MenuItem value="" disabled>
          Resolve
        </MenuItem>
        <MenuItem value="resolveAll">All jobs</MenuItem>
        <MenuItem value="resolveSelected" disabled={numJobsSelected === 0}>
          {numJobsSelected} selected jobs
        </MenuItem>
      </Select>

      {!flowId && (
        <Select
          className={clsx(classes.select, classes.flow)}
          onChange={e => patchFilter('flowId', e.target.value)}
          IconComponent={ArrowDownIcon}
          displayEmpty
          value={_flowId || ''}>
          <MenuItem value="">Select flow</MenuItem>
          {filteredFlows.map(opt => (
            <MenuItem key={opt._id} value={opt._id}>
              {opt.name || opt._id}
            </MenuItem>
          ))}
        </Select>
      )}

      <Select
        className={clsx(classes.select, classes.status)}
        IconComponent={ArrowDownIcon}
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
      </Select>

      <FormControlLabel
        label="Hide empty jobs"
        classes={{ label: classes.hideEmptyLabel }}
        control={
          <Checkbox
            // indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={hideEmpty}
            onChange={e => patchFilter('hideEmpty', e.target.checked)}
          />
        }
      />
      <div className={classes.pagingContainer}>
        <IconButton
          disabled={currentPage === 0}
          size="small"
          onClick={() => handlePageChange(-1)}>
          <ArrowLeftIcon />
        </IconButton>
        <div className={classes.pagingText}>
          {firstRowIndex + 1}
          {' - '}
          {currentPage === maxPage
            ? totalJobs
            : firstRowIndex + rowsPerPage} of {totalJobs}
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
