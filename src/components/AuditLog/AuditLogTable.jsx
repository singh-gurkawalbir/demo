import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { selectors } from '../../reducers';
import ResourceTable from '../ResourceTable';
import NoResultTypography from '../NoResultTypography';
import { getAuditLogFilterKey } from '../../constants/auditLog';
import messageStore from '../../utils/messageStore';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  noResultWrapper: {
    minHeight: 110,
  },
});

export default function AuditLogTable({ resourceType, resourceId, childId, className }) {
  const classes = useStyles();
  const filterKey = getAuditLogFilterKey(resourceType, resourceId);
  const {logs: auditLogs, totalCount} = useSelector(state =>
    selectors.paginatedAuditLogs(
      state,
      resourceType,
      resourceId,
      {childId}
    ));

  const actionProps = useMemo(() => ({
    childId,
    integrationId: resourceType === 'integrations' ? resourceId : undefined }),
  [childId, resourceType, resourceId]
  );

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
          <NoResultTypography isBackground className={classes.noResultWrapper}>
            {messageStore('NO_RESULT', {message: 'audit logs'})}
          </NoResultTypography>
        )}
    </div>
  );
}
