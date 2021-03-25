import actions from '../../../../actions';
import CancelIcon from '../../../icons/CancelIcon';

const cancelReport = rowData => ({

  label: 'Cancel Report',
  icon: CancelIcon,
  onClick: dispatch => {
    const {_id } = rowData;

    dispatch(actions.resource.eventreports.cancelReport(_id));
  },
});
export default cancelReport;
