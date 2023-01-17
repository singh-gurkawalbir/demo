import React from 'react';
import DownloadIcon from '../../../../icons/DownloadIcon';
import DownloadFileWithURL from '../../../../DownloadFileWithURL';

export default {
  key: 'downloadDebugLogs',
  useLabel: rowData => {
    const { _id: connectionId } = rowData;
    const downloadUrl = `/api/connections/${connectionId}/debug`;

    return (
      <DownloadFileWithURL downloadUrl={downloadUrl}>
        Download debug logs
      </DownloadFileWithURL>
    );
  },
  icon: DownloadIcon,
};
