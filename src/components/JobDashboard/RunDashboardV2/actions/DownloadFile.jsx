import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';

export default {
  label: 'Download file',
  component: function DownloadFile({ rowData: job }) {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(actions.job.downloadFiles({ jobId: job._id }));
    }, [dispatch, job._id]);

    return null;
  },
};
