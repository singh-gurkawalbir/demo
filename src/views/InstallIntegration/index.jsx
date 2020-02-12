import React from 'react';
import UploadFile from './UploadFile';
import ModalDialog from '../../components/ModalDialog';

export default function InstallIntegrationDialog({
  fileType,
  history,
  onClose,
}) {
  // const classes = useStyles();

  return (
    <ModalDialog
      onClose={onClose}
      show
      aria-labelledby="integration-install-dialog">
      <div> Upload integration zip file</div>
      <div>
        <UploadFile fileType={fileType} history={history} />
      </div>
    </ModalDialog>
  );
}
