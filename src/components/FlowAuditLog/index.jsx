import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { selectors } from '../../reducers';
import actions from '../../actions';

export default function AuditLog({ resourceType, resourceId }) {
  const dispatch = useDispatch();
  const resourceAuditLogs = useSelector(
    state => selectors.auditLogs(state, resourceType, resourceId),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.auditLogs.request(resourceType, resourceId));
  }, [dispatch, resourceId, resourceType]);

  return (
    <div>
      Audit log {resourceType} {resourceId} {resourceAuditLogs.length}
    </div>
  );
}
