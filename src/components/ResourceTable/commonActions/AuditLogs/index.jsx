import React, { useState, useCallback } from 'react';
import AuditLogIcon from '../../../icons/AuditLogIcon';
import AuditLogDialog from '../../../AuditLog/AuditLogDialog';
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  useLabel: () => 'View audit log',
  icon: AuditLogIcon,
  Component: ({rowData}) => {
    const { _id: resourceId } = rowData;

    const {resourceType} = useGetTableContext();

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
