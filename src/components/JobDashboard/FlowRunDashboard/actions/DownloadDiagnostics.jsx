import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';

export default {
  label: 'Download diagnostics',
  component: function DownloadDiagnostics({ rowData }) {
    const { _flowJobId } = rowData;
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(
        actions.job.downloadFiles({ jobId: _flowJobId, fileType: 'diagnostics' })
      );
    }, [dispatch, _flowJobId]);

    return null;
  },
};
