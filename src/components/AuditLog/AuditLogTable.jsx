import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import CeligoTable from '../CeligoTable';
import metadata from './metadata';
import ShowMoreDrawer from '../drawer/ShowMore';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginLeft: theme.spacing(1),
  },

  tablePaginationRoot: { float: 'right' },
}));

export default function AuditLogTable({ resourceType, resourceId, filters, options, resourceDetails }) {
  const classes = useStyles();
  const filterKey = `${resourceType}-${resourceId}-auditLogs`;
  const { take = 100 } = useSelector(state => selectors.filter(state, filterKey));
  const preferences = useSelector(state => selectors.userProfilePreferencesProps(state));
  const {logs: auditLogs, count, totalCount} = useSelector(state =>
    selectors.auditLogs(
      state,
      resourceType,
      resourceId,
      filters,
      {...options, take}
    ));

  return (
    <>
      <div className={classes.root}>

        <CeligoTable
          data={auditLogs}
          filterKey={filterKey}
          {...metadata}
          actionProps={{ resourceType, resourceId, filters, options, preferences, resourceDetails }}
          />
        <ShowMoreDrawer
          filterKey={filterKey}
          count={count}
          maxCount={totalCount}
        />
      </div>
    </>
  );
}
