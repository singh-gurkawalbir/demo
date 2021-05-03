import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DownloadIntegrationIcon from '../../../../icons/DownloadIntegrationIcon';
import actions from '../../../../../actions';

export default {
  useLabel: () => 'Download diagnostics',
  icon: DownloadIntegrationIcon,
  component: function DownloadDiagnostics(props) {
    const { rowData: job = {} } = props;
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(actions.job.downloadFiles({ jobId: job._id, fileType: 'diagnostics' }));
    }, [dispatch, job._id]);

    return null;
  },
};
