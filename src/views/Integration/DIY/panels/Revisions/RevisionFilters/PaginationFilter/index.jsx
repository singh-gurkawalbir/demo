import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useParams } from 'react-router-dom';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { ROWS_PER_PAGE_OPTIONS, getRevisionFilterKey, DEFAULT_ROWS_PER_PAGE } from '../../../../../../../utils/revisions';
import CeligoPagination from '../../../../../../../components/CeligoPagination';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';

const useStyles = makeStyles(() => ({
  tablePaginationRoot: {
    display: 'flex',
  },
}));

export default function RevisionFilters() {
  const classes = useStyles();
  const { integrationId } = useParams();
  const dispatch = useDispatch();
  const filterKey = getRevisionFilterKey(integrationId);

  // selectors
  const totalRevisions = useSelector(state => (selectors.filteredRevisions(state, integrationId) || []).length);
  const hasNoFilteredRevisions = useSelector(state => !selectors.getCurrPageFilteredRevisions(state, integrationId)?.length);
  const revisionsPagingFilter = useSelector(state =>
    selectors.filter(state, filterKey)?.paging,
  shallowEqual);
  // end of selectors

  const handlePageChange = useCallback((e, newPage) => {
    dispatch(
      actions.patchFilter(filterKey, {
        paging: {
          ...revisionsPagingFilter,
          currPage: newPage,
        },
      })
    );
  }, [dispatch, filterKey, revisionsPagingFilter]);
  const handleRowsPerPageChange = useCallback(e => {
    dispatch(
      actions.patchFilter(filterKey, {
        paging: {
          ...revisionsPagingFilter,
          rowsPerPage: parseInt(e.target.value, 10),
          currPage: 0,
        },
      })
    );
  }, [dispatch, filterKey, revisionsPagingFilter]);

  if (hasNoFilteredRevisions) {
    return null;
  }

  return (
    <CeligoPagination
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      className={classes.tablePaginationRoot}
      count={totalRevisions}
      page={revisionsPagingFilter?.currPage || 0}
      rowsPerPage={revisionsPagingFilter?.rowsPerPage || DEFAULT_ROWS_PER_PAGE}
      resultPerPageLabel="Results per page:"
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handleRowsPerPageChange}
    />
  );
}
