import React, { useMemo } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import metadata from './metadata';
import KeywordSearch from '../../KeywordSearch';
import ErrorTable from '../ErrorTable';
import RefreshCard from '../components/RefreshCard';
import ErrorActions from '../components/ErrorActions';
import Spinner from '../../Spinner';
import ErrorDetailsDrawer from './ErrorDetailsDrawer';
import SpinnerWrapper from '../../SpinnerWrapper';
import useErrorTableConfig from '../ErrorDetails/hooks/useErrorTableConfig';

const useStyles = makeStyles(theme => ({
  tablePaginationRoot: {
    float: 'right',
  },
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
  searchBy: ['message', 'source', 'code', 'occurredAt', 'traceKey'],
};

export default function OpenErrors({ flowId, resourceId, show }) {
  const classes = useStyles();
  const filterKey = `openErrors-${flowId}-${resourceId}`;
  const options = useMemo(
    () => ({ defaultFilter, show, filterKey }),
    [filterKey, show]);
  const {
    errors: openErrors,
    fetchErrors,
    isFreshDataLoad,
    updated,
    paginationOptions,
    actionProps,
  } = useErrorTableConfig(flowId, resourceId, options);

  return (
    <div className={clsx({ [classes.hide]: !show })}>
      {
        !isFreshDataLoad &&
        <RefreshCard onRefresh={fetchErrors} disabled={!updated} />
      }
      {
        !!openErrors.length &&
        <ErrorActions flowId={flowId} resourceId={resourceId} />
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
            metadata={metadata}
            data={openErrors}
            actionProps={actionProps}
            emptyRowsLabel="No Open errors"
        />
        </>
      )}
      <ErrorDetailsDrawer flowId={flowId} resourceId={resourceId} />
    </div>
  );
}
