import { Fragment, useState } from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../../components/icons/HookIcon';
import AuditLogDialog from '../../../../../components/AuditLog/AuditLogDialog';

export default function AuditLogs({ resourceType, resource }) {
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
}
