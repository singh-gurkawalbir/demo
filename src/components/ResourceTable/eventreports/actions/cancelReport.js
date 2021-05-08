import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import CancelIcon from '../../../icons/CancelIcon';

const cancelReport = {
  key: 'cancelReport',
  useLabel: () => 'Cancel Report',
  icon: CancelIcon,
  useOnClick: rowData => {
    const dispatch = useDispatch();
    const {_id } = rowData;

    return useCallback(() => {
      dispatch(actions.resource.eventreports.cancelReport(_id));
    }, [_id, dispatch]);
  },
};
export default cancelReport;
