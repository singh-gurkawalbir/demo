import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { MenuItem, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ArrowLeftIcon from '../../icons/ArrowLeftIcon';
import ArrowRightIcon from '../../icons/ArrowRightIcon';
import RefreshIcon from '../../icons/RefreshIcon';
import CeligoSelect from '../../CeligoSelect';
import FlowSelector from './FlowSelector';
import { TextButton } from '../../Buttons';

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

export default function Filters({
  ssLinkedConnectionId,
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
  const { rowsPerPage, currentPage, totalJobs = 0 } = useSelector(state =>
    selectors.suiteScriptJobsPagingDetails(state)
  );
  const {
    flowId: filterFlowId,
    status = 'all',
    hideEmpty = false,
  } = useSelector(state => selectors.filter(state, filterKey));
  // #endregion
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
    dispatch(actions.suiteScript.job.clear());
    patchFilter('currentPage', 0);
    patchFilter(
      'refreshAt',
      new Date().getTime()
    ); /** We are setting the refreshAt (not sending to api) to make sure the filter changes when user clicks refresh.  */
  }, [dispatch, patchFilter]);

  return (
    <div className={classes.root}>
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
          ssLinkedConnectionId={ssLinkedConnectionId}
          integrationId={integrationId}
          data-test="selectAFlow"
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
          ['all', 'Select status'],
          ['error', 'Contains error'],
          ['INPROGRESS', 'In progress'],
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
          control={(
            <Checkbox
              // indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={hideEmpty}
              data-test="hideEmptyJobs"
              color="primary"
              onChange={e => patchFilter('hideEmpty', e.target.checked)}
            />
          )}
        />
      </div>

      <div className={classes.rightActionContainer}>
        <TextButton
          startIcon={<RefreshIcon />}
          onClick={handleRefreshClick}>
          Refresh
        </TextButton>
        {maxPage > 0 && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
