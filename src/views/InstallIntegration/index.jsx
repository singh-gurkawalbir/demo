import React from 'react';
import UploadFile from './UploadFile';
import ModalDialog from '../../components/ModalDialog';

export default function InstallIntegrationDialog(props) {
  const { fileType, history, onClose } = props;
  // const classes = useStyles();

  return (
    <ModalDialog
      handleClose={onClose}
      show
      aria-labelledby="integration-install-dialog">
      <div> Upload Integration Zip File</div>
      <div>
        <UploadFile fileType={fileType} history={history} />
      </div>
    </ModalDialog>
  );
}
