import { Fragment, useState } from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../../../icons/AuditLogIcon';
import AuditLogDialog from '../../../AuditLog/AuditLogDialog';

export default {
  label: 'Audit log',
  component: function AuditLogs({ resourceType, resource }) {
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
        <IconButton size="small" onClick={() => setShow(true)}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
