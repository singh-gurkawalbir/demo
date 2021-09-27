import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { hasLongLength } from '../utils';
import DiffDialog from '../DiffDialog';
import { TextButton } from '../../../Buttons';

const useStyles = makeStyles({
  clickBtn: {
    whiteSpace: 'nowrap',
    padding: 0,
  },
});

export default function OldValue({ auditLog, oldValue = '', newValue = '' }) {
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);

  const handleClose = useCallback(() => setShowDialog(false), []);

  if (!hasLongLength(oldValue, newValue)) {
    return typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue);
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
        className={classes.clickBtn}
        onClick={() => setShowDialog(true)}>
        Click to view
      </TextButton>
    </>
  );
}
