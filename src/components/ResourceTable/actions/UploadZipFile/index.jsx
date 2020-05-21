import { Fragment, useState, useCallback } from 'react';
import UploadIcon from '../../../../components/icons/UploadIcon';
import UploadFileDialog from './UploadFileDialog';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

export default {
  key: 'uploadZipFile',
  component: function UploadZipFile({ resourceType, resource }) {
    const [showDialog, setShowDialog] = useState(false);
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
        <IconButtonWithTooltip
          tooltipProps={{
            title: 'Upload ZIP file',
          }}
          data-test="toggleUploadZipFileModal"
          size="small"
          onClick={toggleDialog}>
          <UploadIcon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
