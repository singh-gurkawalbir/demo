import React, { useState, useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { hasLongLength } from '../utils';
import DiffDialog from '../DiffDialog';
import { TextButton } from '../../../Buttons';
import { escapeSpecialChars } from '../../../../utils/string';

const useStyles = makeStyles(theme => ({
  clickBtn: {
    whiteSpace: 'nowrap',
    padding: 0,
    minWidth: 'auto',
    '&:hover': {
      color: theme.palette.primary.light,
      textDecoration: 'none',
    },
  },
}));

export default function OldValue({ auditLog, oldValue = '', newValue = '' }) {
  const classes = useStyles();
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
        className={classes.clickBtn} color="primary"
        onClick={() => setShowDialog(true)}>
        View
      </TextButton>
    </>
  );
}
