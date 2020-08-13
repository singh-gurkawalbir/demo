import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import ResourceTable from '../CeligoTable';
import ShowMoreDrawer from '../drawer/ShowMore';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
});

export default function AuditLogTable({ resourceType, resourceId, filters, options, resourceDetails }) {
  const classes = useStyles();
  const filterKey = `${resourceType}-${resourceId}-auditLogs`;
  const { take = 100 } = useSelector(state => selectors.filter(state, filterKey));
  const {logs: auditLogs, count, totalCount} = useSelector(state =>
    selectors.auditLogs(
      state,
      resourceType,
      resourceId,
      filters,
      {...options, take}
    ));

  return (
    <div className={classes.root}>
      <ResourceTable
        resources={auditLogs}
        resourceType="auditLogs"
        filterKey={filterKey}
        actionProps={{ resourceDetails }}
      />

      <ShowMoreDrawer
        filterKey={filterKey}
        count={count}
        maxCount={totalCount}
      />
    </div>
  );
}
