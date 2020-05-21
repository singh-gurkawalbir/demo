import { Fragment, useState } from 'react';
import AuditLogIcon from '../../../icons/AuditLogIcon';
import AuditLogDialog from '../../../AuditLog/AuditLogDialog';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

export default {
  component: function AuditLogs({ resourceType, resource }) {
    const [show, setShow] = useState(false);
    const showAutitLogs = () => {
      setShow(true);
    };

    const handleAuditLogsClose = () => {
      setShow(false);
    };

    return (
      <Fragment>
        {show && (
          <AuditLogDialog
            resourceType={resourceType}
            resourceId={resource._id}
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
