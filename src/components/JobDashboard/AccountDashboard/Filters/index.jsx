import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  makeStyles,
  IconButton,
} from '@material-ui/core';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import ArrowLeftIcon from '../../../icons/ArrowLeftIcon';
import ArrowRightIcon from '../../../icons/ArrowRightIcon';
import RefreshIcon from '../../../icons/RefreshIcon';
import IconTextButton from '../../../IconTextButton';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: -1,
    paddingBottom: theme.spacing(1.5),
    backgroundColor: theme.palette.common.white,
    overflowX: 'auto',
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
  // #region data-layer selectors
  const { paging = {}, totalJobs = 0 } = useSelector(state =>
    selectors.flowJobsPagingDetails(state)
  );
  const {
    currentPage = 0,
  } = useSelector(state => selectors.filter(state, filterKey));

  // #endregion
  const { rowsPerPage } = paging;
  const maxPage = Math.ceil(totalJobs / rowsPerPage) - 1;
  const firstRowIndex = rowsPerPage * currentPage;
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
      <div className={classes.filterContainer}>
        <div className={classes.rightActionContainer}>
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
          <IconTextButton onClick={handleRefreshClick}>
            <RefreshIcon /> Refresh
          </IconTextButton>
        </div>
      </div>
    </div>
  );
}

