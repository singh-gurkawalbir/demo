import { Fragment, useState, useCallback } from 'react';
import UploadIcon from '../../../../components/icons/UploadIcon';
import UploadFileDialog from './UploadFileDialog';

export default {
  title: 'Upload ZIP file',
  icon: UploadIcon,
  component: function UploadZipFile({ resourceType, resource }) {
    const [showDialog, setShowDialog] = useState(true);
    const toggleDialog = useCallback(() => {
      setShowDialog(!showDialog);
    }, [showDialog]);

    return (
      <Fragment>
        {showDialog && (
          <UploadFileDialog
            resourceType={resourceType}
            fileType="application/zip"
            onClose={toggleDialog}
            type="Zip"
            resourceId={resource._id}
          />
        )}
      </Fragment>
    );
  },
};
