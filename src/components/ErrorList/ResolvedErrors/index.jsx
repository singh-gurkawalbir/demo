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
  closedErrorsKeywordSearch: {
    width: '250px',
    float: 'left',
    '& > div:first-child': {
      background: theme.palette.common.white,
      '& > div[class*="inputRoot"]': {
        width: '100%',
        '& > input': {
          width: '100%',
        },
      },
    },

  },
  hide: {
    display: 'none',
  },
  header: {
    paddingBottom: theme.spacing(3),
    display: 'inline-flex',
    justifyContent: 'space-between',
    width: '68%',
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
      <RefreshCard onRefresh={fetchErrors} disabled={!updated || isFreshDataLoad} />
      {isFreshDataLoad ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <>
          <div className={classes.header}>
            <div className={classes.closedErrorsKeywordSearch}>
              <KeywordSearch filterKey={filterKey} defaultFilter={defaultFilter} />
            </div>
            {
            !!resolvedErrors.length &&
            <ErrorActions flowId={flowId} resourceId={resourceId} isResolved />
          }
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
