import actions from '../../../../actions';
import DownloadIcon from '../../../icons/DownloadIcon';

const downloadResults = rowData => ({

  label: 'Download results',
  icon: DownloadIcon,
  onClick: dispatch => {
    const {_id } = rowData;

    dispatch(actions.resource.eventreports.downloadReport(_id));
  },
});
export default downloadResults;

