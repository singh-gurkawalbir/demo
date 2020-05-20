import { Fragment, useState } from 'react';
import AuditLogIcon from '../../../icons/AuditLogIcon';
import AuditLogDialog from '../../../AuditLog/AuditLogDialog';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

export default {
  label: 'Audit log',
  component: function AuditLogs({ tooltipLabel, resourceType, resource }) {
    const [show, setShow] = useState(false);

    return (
      <Fragment>
        {show && (
          <AuditLogDialog
            resourceType={resourceType}
            resourceId={resource._id}
            onClose={() => setShow(false)}
          />
        )}
        <IconButtonWithTooltip
          tooltipProps={{
            label: tooltipLabel,
          }}
          data-test="showAuditLog"
          size="small"
          onClick={() => setShow(true)}>
          <AuditLogIcon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
