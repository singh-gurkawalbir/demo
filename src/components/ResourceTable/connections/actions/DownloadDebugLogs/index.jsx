import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import DownloadIcon from '../../../../icons/DownloadIcon';

export default {
  key: 'downloadDebugLogs',
  useLabel: () => 'Download debug logs',
  icon: DownloadIcon,
  useOnClick: rowData => {
    const dispatch = useDispatch();
    const { _id: connectionId } = rowData;

    return useCallback(() => {
      dispatch(actions.logs.connections.download(connectionId));
    }, [connectionId, dispatch]);
  },
};
