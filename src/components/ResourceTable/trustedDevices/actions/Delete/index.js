import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import actions from '../../../../../actions';
import TrashIcon from '../../../../icons/TrashIcon';

export default {
  key: 'deleteDevice',
  useLabel: () => 'Delete device',
  icon: TrashIcon,
  useOnClick: rowData => {
    const { _id: deviceId} = rowData;
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(actions.mfa.deleteDevice(deviceId));
    }, [dispatch, deviceId]);

    return null;
  },
};
