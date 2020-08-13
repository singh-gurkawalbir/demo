import React, { useEffect, useState, useCallback } from 'react';
import JobFilesDownloadDialog from '../../JobFilesDownloadDialog';

export default {
  label: 'Download files',
  component: function DownloadFiles({ rowData: job }) {
    const [showDialog, setShowDialog] = useState(false);
    const handleClose = useCallback(() => setShowDialog(false), []);

    useEffect(() => {
      setShowDialog(true);
    }, []);

    if (!showDialog) {
      return null;
    }

    return <JobFilesDownloadDialog job={job} onCloseClick={handleClose} />;
  },
};
