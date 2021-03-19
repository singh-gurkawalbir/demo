import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import DownloadIcon from '../../../icons/DownloadIcon';

export default {
  label: 'Download Results',
  icon: DownloadIcon,
  component: function CancelReport({ rowData = {} }) {
    const {_id } = rowData;
    const dispatch = useDispatch();

    const downloadEventReport = useCallback(() => {
      dispatch(actions.resource.eventreports.downloadReport(_id));
    }, [_id, dispatch]);

    useEffect(() => {
      downloadEventReport();
    }, [downloadEventReport]);

    return null;
  },
};

