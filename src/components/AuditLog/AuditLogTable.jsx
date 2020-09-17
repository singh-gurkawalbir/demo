import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import ResourceTable from '../ResourceTable';
import ShowMoreDrawer from '../drawer/ShowMore';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
});

export default function AuditLogTable({ resourceType, resourceId, filters, storeId, resourceDetails }) {
  const classes = useStyles();
  const filterKey = `${resourceType}-${resourceId}-auditLogs`;
  const { take = 100 } = useSelector(state => selectors.filter(state, filterKey));
  const {logs: auditLogs, count, totalCount} = useSelector(state =>
    selectors.auditLogs(
      state,
      resourceType,
      resourceId,
      filters,
      {storeId, take}
    ));

  const actionProps = useMemo(() => ({ resourceDetails }), [resourceDetails]);

  return (
    <div className={classes.root}>
      <ResourceTable
        resources={auditLogs}
        resourceType="auditLogs"
        filterKey={filterKey}
        actionProps={actionProps}
      />

      <ShowMoreDrawer
        filterKey={filterKey}
        count={count}
        maxCount={totalCount}
      />
    </div>
  );
}
