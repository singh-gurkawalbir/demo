import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import DownloadIcon from '../../../../icons/DownloadIcon';

export default {
  label: 'Download debug logs',
  icon: DownloadIcon,
  component: function DownloadDebugLogs({ rowData = {} }) {
    const dispatch = useDispatch();
    const { _id: connectionId } = rowData;

    useEffect(() => {
      dispatch(actions.logs.connections.download(connectionId));
    }, [connectionId, dispatch]);

    return null;
  },
};
