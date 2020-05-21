import { Fragment, useState, useCallback } from 'react';
import AuditLogIcon from '../../../icons/AuditLogIcon';
import AuditLogDialog from '../../../AuditLog/AuditLogDialog';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

export default {
  key: 'auditLogs',
  component: function AuditLogs({ resourceType, resource = {} }) {
    const { _id: resourceId } = resource;
    const [show, setShow] = useState(false);
    const showAutitLogs = useCallback(() => {
      setShow(true);
    }, []);
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
        <IconButtonWithTooltip
          tooltipProps={{
            title: 'Audit log',
          }}
          data-test="showAuditLog"
          size="small"
          onClick={showAutitLogs}>
          <AuditLogIcon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
