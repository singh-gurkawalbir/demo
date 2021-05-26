import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import DownloadIcon from '../../../icons/DownloadIcon';

const downloadResults = {
  key: 'downloadResults',
  useLabel: () => 'Download results',
  icon: DownloadIcon,
  useOnClick: rowData => {
    const dispatch = useDispatch();
    const {_id } = rowData;

    return useCallback(() => {
      dispatch(actions.resource.eventreports.downloadReport(_id));
    }, [_id, dispatch]);
  },
};
export default downloadResults;

