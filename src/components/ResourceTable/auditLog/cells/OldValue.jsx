import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { hasLongLength } from '../utils';
import DiffDialog from '../DiffDialog';

const useStyles = makeStyles({
  clickBtn: {
    whiteSpace: 'nowrap',
    padding: 0,
  },
});

export default function OldValue({ auditLog, oldValue, newValue }) {
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState({
    showDiffDialog: false,
  });

  if (!hasLongLength(oldValue, newValue)) {
    return typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue);
  }

  return (
    <>
      {showDialog.showDiffDialog && (
        <DiffDialog
          auditLog={auditLog}
          onCancelClick={() => setShowDialog(false)}
        />
      )}

      <Button
        data-test="auditLogChanges"
        color="primary"
        variant="text"
        className={classes.clickBtn}
        onClick={() => setShowDialog(true)}>
        Click to view
      </Button>
    </>
  );
}
