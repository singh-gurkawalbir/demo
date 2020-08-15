import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import metadata from './metadata';
import KeywordSearch from '../../KeywordSearch';
import ErrorTable from '../ErrorTable';
import RefreshCard from '../components/RefreshCard';
import ErrorActions from '../components/ErrorActions';
import Spinner from '../../Spinner';
import SpinnerWrapper from '../../SpinnerWrapper';
import useErrorTableConfig from '../ErrorDetails/hooks/useErrorTableConfig';

const useStyles = makeStyles(theme => ({
  search: {
    width: '300px',
    paddingTop: theme.spacing(1),
    float: 'left',
  },
  hide: {
    display: 'none',
  },
}));
const defaultFilter = {
  searchBy: ['message', 'source', 'code', 'occurredAt', 'resolvedBy'],
};

export default function ResolvedErrors({ flowId, resourceId, show }) {
  const classes = useStyles();
  const filterKey = `resolvedErrors-${flowId}-${resourceId}`;
  const options = useMemo(
    () =>
      ({ defaultFilter, show, filterKey, isResolved: true }),
    [filterKey, show]);
  const {
    isFreshDataLoad,
    fetchErrors,
    updated,
    errors: resolvedErrors,
    paginationOptions,
    actionProps,
  } = useErrorTableConfig(flowId, resourceId, options);

  return (
    <div className={clsx({ [classes.hide]: !show })}>
      {
        !isFreshDataLoad && <RefreshCard onRefresh={fetchErrors} disabled={!updated} />
      }
      {
        !!resolvedErrors.length &&
        <ErrorActions flowId={flowId} resourceId={resourceId} isResolved />
      }
      <div className={classes.search}>
        <KeywordSearch filterKey={filterKey} defaultFilter={defaultFilter} />
      </div>
      {isFreshDataLoad ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <ErrorTable
          paginationOptions={paginationOptions}
          metadata={metadata}
          data={resolvedErrors}
          actionProps={actionProps}
          emptyRowsLabel="No Resolved errors"
        />
      )}
    </div>
  );
}
