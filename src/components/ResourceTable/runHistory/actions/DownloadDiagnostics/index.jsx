import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import DownloadIntegrationIcon from '../../../../icons/DownloadIntegrationIcon';
import actions from '../../../../../actions';

export default {
  key: 'downloadDiagnostics',
  useLabel: () => 'Download diagnostics',
  icon: DownloadIntegrationIcon,
  useOnClick: rowData => {
    const job = rowData || {};
    const dispatch = useDispatch();

    return useCallback(() => {
      dispatch(actions.job.downloadFiles({ jobId: job._id, fileType: 'diagnostics' }));
    }, [dispatch, job._id]);
  },
};
