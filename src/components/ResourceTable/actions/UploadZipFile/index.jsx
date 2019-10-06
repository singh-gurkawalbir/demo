import { Fragment, useState } from 'react';
import { IconButton } from '@material-ui/core';
// TODO Azhar
import UploadIcon from '../../../../components/icons/ArrowUpIcon';
import UploadFileDialog from '../../../../components/UploadFileDialog';

export default {
  label: 'Upload ZIP File',
  component: function UploadZipFile({ resourceType, resource }) {
    const [showUpoadFileDialog, setShowUploadFileDialog] = useState(false);
    const handleUploadZipFileClick = () => {
      setShowUploadFileDialog(true);
    };

    const handleUploadFileDialogClose = () => {
      setShowUploadFileDialog(false);
    };

    return (
      <Fragment>
        {showUpoadFileDialog && (
          <UploadFileDialog
            resourceType={resourceType}
            fileType="application/zip"
            onClose={handleUploadFileDialogClose}
            type="Zip"
            resourceId={resource._id}
          />
        )}
        <IconButton
          data-test="toggleUploadZipFileModal"
          size="small"
          onClick={handleUploadZipFileClick}>
          <UploadIcon />
        </IconButton>
      </Fragment>
    );
  },
};
