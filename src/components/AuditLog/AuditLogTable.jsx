import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { selectors } from '../../reducers';
import ResourceTable from '../ResourceTable';
import ShowMoreDrawer from '../drawer/ShowMore';
import MessageWrapper from '../MessageWrapper';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
});

export default function AuditLogTable({ resourceType, isFixed, resourceId, filters, childId, className }) {
  const classes = useStyles();
  const filterKey = `${resourceType}-${resourceId}-auditLogs`;
  const { take = 100 } = useSelector(state => selectors.filter(state, filterKey));
  const {logs: auditLogs, count, totalCount} = useSelector(state =>
    selectors.auditLogs(
      state,
      resourceType,
      resourceId,
      filters,
      {childId, take}
    ));

  const actionProps = useMemo(() => ({ childId }), [childId]);

  return (
    <div className={clsx(classes.root, className)}>
      {totalCount > 0
        ? (
          <ResourceTable
            resources={auditLogs}
            resourceType="auditLogs"
            filterKey={filterKey}
            actionProps={actionProps}
          />
        ) : (
          <MessageWrapper>
            You don&apos;t have any audit logs.
          </MessageWrapper>
        )}

      <ShowMoreDrawer
        filterKey={filterKey}
        count={count}
        maxCount={totalCount}
        isFixed={isFixed}
      />
    </div>
  );
}
