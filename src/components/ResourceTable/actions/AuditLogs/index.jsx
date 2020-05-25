import { Fragment, useState, useCallback } from 'react';
import AuditLogIcon from '../../../icons/AuditLogIcon';
import AuditLogDialog from '../../../AuditLog/AuditLogDialog';

export default {
  title: 'Audit log',
  icon: AuditLogIcon,
  component: function AuditLogs({ resourceType, resource = {} }) {
    const { _id: resourceId } = resource;
    const [show, setShow] = useState(true);
    const handleAuditLogsClose = useCallback(() => {
      setShow(false);
    }, []);

    return (
      <Fragment>
        {show && (
          <AuditLogDialog
            resourceType={resourceType}
            resourceId={resourceId}
            onClose={handleAuditLogsClose}
          />
        )}
      </Fragment>
    );
  },
};
