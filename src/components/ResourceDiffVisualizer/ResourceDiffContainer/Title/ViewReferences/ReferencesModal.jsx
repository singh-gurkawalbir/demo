import React from 'react';
import { Typography } from '@material-ui/core';
import ModalDialog from '../../../../ModalDialog';
import References from './References';

export default function ReferencesModal({ resourceId, resourceType, integrationId, onClose }) {
  return (
    <ModalDialog show onClose={onClose}>
      <Typography>References</Typography>
      <References resourceId={resourceId} resourceType={resourceType} integrationId={integrationId} />
    </ModalDialog>
  );
}
