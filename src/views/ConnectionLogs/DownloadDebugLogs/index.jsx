// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TextButton } from '@celigo/fuse-ui';
import actions from '../../../actions';
import DownloadIcon from '../../../components/icons/DownloadIcon';

export default function DownloadDebugLogs({ connectionId, disabled}) {
  const dispatch = useDispatch();

  const handleDownloadLogsClick = useCallback(() => {
    dispatch(actions.logs.connections.download(connectionId));
  }, [dispatch, connectionId]);

  return (
    <>
      <TextButton
        key="downloadLogs"
        onClick={handleDownloadLogsClick}
        disabled={disabled}
        data-test="downloadLogs"
        startIcon={<DownloadIcon />}>
        Download logs
      </TextButton>
    </>
  );
}
