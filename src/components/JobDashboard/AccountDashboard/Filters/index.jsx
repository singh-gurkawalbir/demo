import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  makeStyles,
} from '@material-ui/core';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import RefreshIcon from '../../../icons/RefreshIcon';
import IconTextButton from '../../../IconTextButton';
import CeligoPagination from '../../../CeligoPagination';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: -1,
    paddingBottom: theme.spacing(1.5),
    backgroundColor: theme.palette.common.white,
    overflowX: 'auto',
  },
  tablePaginationRoot: {
    float: 'right',
    display: 'flex',
    margin: 'auto',
  },
  filterContainer: {
    padding: theme.spacing(2, 0, 2, 2),
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    borderWidth: [[1, 0]],
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    minWidth: '1200px',
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
    '&:first-child': {
      marginLeft: 0,
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
  hideLabel: {
    marginLeft: '10px',
  },
  divider: {
    width: 1,
    height: 20,
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: theme.spacing(0, 1.5, 0, 0.25),
  },
}));

export default function Filters({
  filterKey,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const rowsPerPageOptions = [10, 25, 50];
  const DEFAULT_ROWS_PER_PAGE = 50;
  const totalJobs = useSelector(state =>
    selectors.runningJobs(state)
  );

  const jobFilter = useSelector(state => selectors.filter(state, filterKey));
  const {currPage = 0,
    rowsPerPage = DEFAULT_ROWS_PER_PAGE,
  } = jobFilter?.paging;

  const patchFilter = useCallback(
    (key, value) => {
      const filter = { [key]: value };

      if (key !== 'currentPage') {
        filter.currentPage = 0;
      }

      dispatch(actions.patchFilter(filterKey, filter));
    },
    [dispatch, filterKey]
  );

  const loadMoreLogs = useCallback(
    () => {
    },
    [],
  );
  // const functionTypes = flowId ? SCRIPT_FUNCTION_TYPES_FOR_FLOW : SCRIPT_FUNCTION_TYPES;
  const paginationOptions = useMemo(
    () => ({
      loadMoreHandler: loadMoreLogs,
      hasMore: false, // !!nextPageURL,
      loading: false, // status === 'requested',

    }),
    [loadMoreLogs]
  );
  const handleChangeRowsPerPage = useCallback(e => {
    dispatch(
      actions.patchFilter(filterKey, {
        paging: {
          ...jobFilter.paging,
          rowsPerPage: parseInt(e.target.value, 10),
        },
      })
    );
  }, [dispatch, filterKey, jobFilter?.paging]);
  const handleChangePage = useCallback(
    (e, newPage) => dispatch(
      actions.patchFilter(filterKey, {
        paging: {
          ...jobFilter.paging,
          currPage: newPage,
        },
      })
    ),
    [dispatch, filterKey, jobFilter?.paging]
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
      <div className={classes.filterContainer}>
        <div className={classes.rightActionContainer}>
          <CeligoPagination
            {...paginationOptions}
            rowsPerPageOptions={rowsPerPageOptions}
            className={classes.tablePaginationRoot}
            count={totalJobs?.length}
            page={currPage}
            rowsPerPage={rowsPerPage}
            resultPerPageLabel="Rows:"
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          <IconTextButton onClick={handleRefreshClick}>
            <RefreshIcon /> Refresh
          </IconTextButton>
        </div>
      </div>
    </div>
  );
}

