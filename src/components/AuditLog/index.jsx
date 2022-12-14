import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
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
import { getAuditLogFilterKey } from '../../constants/auditLog';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
  tableContainer: {
    height: 'calc(100% - 69px)',
  },
  spinnerContainer: {
    margin: theme.spacing(1),
  },
}));

const OPTION_ALL = { id: 'all', label: 'All' };

export default function AuditLog({
  className,
  users,
  resourceType,
  resourceId,
  onClick,
  integrationId,
  childId,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filterKey = getAuditLogFilterKey(resourceType, resourceId);
  const clearAuditLogs = () => {
    dispatch(actions.auditLogs.clear());
    dispatch(actions.clearFilter(filterKey));
  };

  const totalCount = useSelector(state => selectors.paginatedAuditLogs(
    state,
    resourceType,
    resourceId,
    {childId}
  ).totalCount);

  const requestAuditLogs = (resourceType, resourceId) => {
    dispatch(actions.auditLogs.request(resourceType, resourceId));
  };

  useEffect(() => {
    if (!isNewId(resourceId)) {
      dispatch(actions.patchFilter(filterKey, {
        resourceType: OPTION_ALL.id,
        _resourceId: OPTION_ALL.id,
        byUser: OPTION_ALL.id,
        source: OPTION_ALL.id,
        event: OPTION_ALL.id,
      }));

      requestAuditLogs(resourceType, resourceId);
    }

    return clearAuditLogs;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resourceDetails = useSelector(state => selectors.resourceDetailsMap(state));

  const auditResourcePath = commKeyGenerator(`/${auditResourceTypePath(resourceType, resourceId)}`, 'GET');
  const isLoadingAuditLog = useSelector(state => selectors.isLoading(state, auditResourcePath));

  return (
    <LoadResources
      required
      integrationId={integrationId}
      resources={['connections',
        'integrations', 'flows', 'exports', 'imports', 'scripts', 'agents', 'stacks', ...(
          !resourceId ? ['apis', 'accesstokens'] : []
        )].join(',')}>
      <>
        {isLoadingAuditLog
          ? <Spinner loading size="large" className={classes.spinnerContainer} /> : (
            <div className={clsx(classes.root, className)}>
              <Filters
                resourceDetails={resourceDetails}
                users={users}
                childId={childId}
                resourceType={resourceType}
                resourceId={resourceId}
                totalCount={totalCount}
            />
              <AuditLogTable
                resourceType={resourceType}
                resourceId={resourceId}
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

