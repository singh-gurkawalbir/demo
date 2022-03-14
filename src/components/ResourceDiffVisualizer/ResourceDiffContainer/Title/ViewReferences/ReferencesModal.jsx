import React from 'react';
import { Typography } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ModalDialog from '../../../../ModalDialog';
import References from './References';

const useStyles = makeStyles(() => ({
  referenceContainer: {
    background: '#F8FAFF',
  },
}));

export default function ReferencesModal({ resourceId, resourceType, integrationId, onClose }) {
  const classes = useStyles();

  return (
    <ModalDialog show onClose={onClose} className={classes.referenceContainer}>
      <Typography>References</Typography>
      <References
        resourceId={resourceId}
        resourceType={resourceType}
        integrationId={integrationId}
      />
    </ModalDialog>
  );
}
