import React, { useState, useCallback } from 'react';
import { TextButton } from '@celigo/fuse-ui';
import { hasLongLength } from '../utils';
import DiffDialog from '../DiffDialog';
import { escapeSpecialChars } from '../../../../utils/string';

export default function OldValue({ auditLog, oldValue = '', newValue = '' }) {
  const [showDialog, setShowDialog] = useState(false);

  const handleClose = useCallback(() => setShowDialog(false), []);

  if (!hasLongLength(oldValue, newValue)) {
    return escapeSpecialChars(oldValue);
  }

  return (
    <>
      {showDialog && (
        <DiffDialog
          auditLog={auditLog}
          onClose={handleClose}
        />
      )}

      <TextButton
        data-test="auditLogChanges"
        sx={{
          whiteSpace: 'nowrap',
          minWidth: 'auto',
        }}
        color="primary"
        onClick={() => setShowDialog(true)}>
        View
      </TextButton>
    </>
  );
}
