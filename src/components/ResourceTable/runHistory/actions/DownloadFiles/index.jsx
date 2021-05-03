import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import DownloadIntegrationIcon from '../../../../icons/DownloadIntegrationIcon';
import JobFilesDownloadDialog from '../../../../JobDashboard/JobFilesDownloadDialog';
import actions from '../../../../../actions';

export default {
  useLabel: () => 'Download files',
  icon: DownloadIntegrationIcon,
  component: function DownloadFiles(props) {
    const { rowData: job = {} } = props;

    const dispatch = useDispatch();
    const [showDownloadFilesDialog, setShowDownloadFilesDialog] = useState(false);

    const handleDownloadFiles = useCallback(() => {
      if (job._id) {
        if (job.files.length === 1) {
          dispatch(actions.job.downloadFiles({ jobId: job._id }));
        } else {
          // Incase of multiple files , show a dialog to download
          setShowDownloadFilesDialog(true);
        }
      }
    }, [dispatch, job]);

    const handleCloseDownloadFilesDialog = useCallback(() => setShowDownloadFilesDialog(false), []);

    useEffect(() => {
      handleDownloadFiles();
    }, [handleDownloadFiles]);

    if (showDownloadFilesDialog) {
      return <JobFilesDownloadDialog job={job} onCloseClick={handleCloseDownloadFilesDialog} />;
    }

    return null;
  },
};
