import React, { useState, useCallback } from 'react';
import AuditLogIcon from '../../../icons/AuditLogIcon';
import AuditLogDialog from '../../../AuditLog/AuditLogDialog';

export default {
  label: 'View audit log',
  icon: AuditLogIcon,
  component: function AuditLogs({ resourceType, rowData = {} }) {
    const { _id: resourceId } = rowData;
    const [show, setShow] = useState(true);
    const handleAuditLogsClose = useCallback(() => {
      setShow(false);
    }, []);

    return (
      <>
        {show && (
          <AuditLogDialog
            resourceType={resourceType}
            resourceId={resourceId}
            onClose={handleAuditLogsClose}
          />
        )}
      </>
    );
  },
};
