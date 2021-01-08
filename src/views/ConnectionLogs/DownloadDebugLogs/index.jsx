// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';
import DownloadIcon from '../../../components/icons/DownloadIcon';
import IconTextButton from '../../../components/IconTextButton';

export default function DownloadDebugLogs({ connectionId, disabled}) {
  const dispatch = useDispatch();

  const handleDownloadLogsClick = useCallback(() => {
    dispatch(actions.logs.connections.download(connectionId));
  }, [dispatch, connectionId]);

  return (
    <>
      <IconTextButton
        key="downloadLogs"
        onClick={handleDownloadLogsClick}
        disabled={disabled}
        data-test="downloadLogs">
        <DownloadIcon />
        Download logs
      </IconTextButton>
    </>
  );
}
