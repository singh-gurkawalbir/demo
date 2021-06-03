import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import actions, { auditResourceTypePath } from '../../actions';
import { selectors } from '../../reducers';
import commKeyGenerator from '../../utils/commKeyGenerator';
import LoadResources from '../LoadResources';
import Spinner from '../Spinner';
import AuditLogTable from './AuditLogTable';
import Filters from './Filters';
import { isNewId } from '../../utils/resource';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginBottom: theme.spacing(2),
    float: 'left',
  },
  tableContainer: {
    height: 'calc(100% - 69px)',
    overflowY: 'auto',
  },
}));

export default function AuditLog({
  className,
  affectedResources,
  users,
  resourceType,
  resourceId,
  onClick,
  childId,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const clearAuditLogs = () => {
    dispatch(actions.auditLogs.clear());
  };
  const requestAuditLogs = (resourceType, resourceId) => {
    dispatch(actions.auditLogs.request(resourceType, resourceId));
  };

  const [filters, handleFiltersChange] = useState({});

  useEffect(() => {
    if (!isNewId(resourceId)) { requestAuditLogs(resourceType, resourceId); }

    return clearAuditLogs;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resourceDetails = useSelector(state => selectors.resourceDetailsMap(state));

  const auditResourcePath = commKeyGenerator(`/${auditResourceTypePath(resourceType, resourceId)}`, 'GET');
  const isLoadingAuditLog = useSelector(state => selectors.isLoading(state, auditResourcePath));

  return (
    <LoadResources
      required
      resources="integrations, flows, exports, imports, connections">
      <>
        {isLoadingAuditLog
          ? <Spinner loading size="large" /> : (
            <div className={clsx(classes.root, className)}>
              <Filters
                affectedResources={affectedResources}
                resourceDetails={resourceDetails}
                users={users}
                onFiltersChange={handleFiltersChange}
                resourceType={resourceType}
                resourceId={resourceId}
            />
              <AuditLogTable
                resourceType={resourceType}
                resourceId={resourceId}
                filters={filters}
                childId={childId}
                onClick={onClick}
                className={classes.tableContainer}
            />
            </div>
          )}
      </>
    </LoadResources>
  );
}

