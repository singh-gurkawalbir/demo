import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import KeywordSearch from '../../KeywordSearch';
import ErrorTable from '../ErrorTable';
import RefreshCard from '../RefreshCard';
import ErrorActions from '../ErrorActions';
import Spinner from '../../Spinner';
import SpinnerWrapper from '../../SpinnerWrapper';
import useErrorTableConfig from '../ErrorTable/hooks/useErrorTableConfig';

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
      {isFreshDataLoad ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <>
          <div className={classes.search}>
            <KeywordSearch filterKey={filterKey} defaultFilter={defaultFilter} />
          </div>
          <ErrorTable
            paginationOptions={paginationOptions}
            errorType="resolved"
            data={resolvedErrors}
            actionProps={actionProps}
            emptyRowsLabel="No Resolved errors"
        />
        </>
      )}
    </div>
  );
}
