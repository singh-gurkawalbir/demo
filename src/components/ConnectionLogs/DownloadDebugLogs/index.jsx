// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';
import DownloadIcon from '../../icons/DownloadIcon';
import IconTextButton from '../../IconTextButton';

export default function DownloadDebugLogs({ connectionId}) {
  const dispatch = useDispatch();

  const handleDownloadLogClick = useCallback(() => {
    dispatch(actions.logs.connection.download(connectionId));
  }, [dispatch, connectionId]);

  return (
    <>
      <IconTextButton
        key="downloadLogs"
        onClick={handleDownloadLogClick}
        data-test="downloadLogs">
        <DownloadIcon />
        Download logs
      </IconTextButton>
    </>
  );
}
