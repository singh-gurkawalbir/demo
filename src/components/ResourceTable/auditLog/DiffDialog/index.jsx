import React from 'react';
import { Typography } from '@mui/material';
import ReactDiffViewer from 'react-diff-viewer';
import { RESOURCE_TYPE_SINGULAR_TO_LABEL } from '../../../../constants/resource';
import ModalDialog from '../../../ModalDialog';

export default function DiffDialog({ auditLog, onClose }) {
  return (
    <ModalDialog show maxWidth={false} onClose={onClose}>
      <div>
        {`${
          RESOURCE_TYPE_SINGULAR_TO_LABEL[auditLog.resourceType]
        } Audit log`}
        <Typography>Field {auditLog.fieldChange.fieldPath}</Typography>
      </div>

      <div>
        <ReactDiffViewer
          hideLineNumbers
          oldValue={JSON.stringify(auditLog.fieldChange.oldValue, null, '  ')}
          newValue={JSON.stringify(auditLog.fieldChange.newValue, null, '  ')}
          />
      </div>
    </ModalDialog>
  );
}

