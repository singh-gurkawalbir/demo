import React from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ModalDialog from '../../../../ModalDialog';
import References from './References';

const useStyles = makeStyles(theme => ({
  referenceContainer: {
    background: theme.palette.background.default,
    padding: theme.spacing(0, 3, 3),
    minWidth: '880px',
  },
}));

export default function ReferencesModal({ resourceId, resourceType, integrationId, onClose }) {
  const classes = useStyles();

  return (
    <ModalDialog show maxWidth="md" onClose={onClose} className={classes.referenceContainer}>
      <Typography>References</Typography>
      <References
        resourceId={resourceId}
        resourceType={resourceType}
        integrationId={integrationId}
      />
    </ModalDialog>
  );
}
