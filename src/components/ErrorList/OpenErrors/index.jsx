import React, { useMemo } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import KeywordSearch from '../../KeywordSearch';
import ErrorTable from '../ErrorTable';
import RefreshCard from '../RefreshCard';
import ErrorActions from '../ErrorActions';
import Spinner from '../../Spinner';
import ErrorDetailsDrawer from './ErrorDetailsDrawer';
import SpinnerWrapper from '../../SpinnerWrapper';
import useErrorTableConfig from '../ErrorTable/hooks/useErrorTableConfig';

const useStyles = makeStyles(theme => ({
  openErrorsKeywordSearch: {
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
      <RefreshCard onRefresh={fetchErrors} disabled={!updated || isFreshDataLoad} />
      {isFreshDataLoad ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <>
          <div className={classes.header}>
            <div className={classes.openErrorsKeywordSearch}>
              <KeywordSearch filterKey={filterKey} defaultFilter={defaultFilter} />
            </div>
            {
            !!openErrors.length &&
            <ErrorActions flowId={flowId} resourceId={resourceId} />
          }

          </div>
          <ErrorTable
            paginationOptions={paginationOptions}
            errorType="open"
            data={openErrors}
            actionProps={actionProps}
            emptyRowsLabel="No open errors"
        />
        </>
      )}
      <ErrorDetailsDrawer flowId={flowId} resourceId={resourceId} />
    </div>
  );
}
