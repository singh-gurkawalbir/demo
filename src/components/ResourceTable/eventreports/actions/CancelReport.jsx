import { useEffect, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import CancelIcon from '../../../icons/CancelIcon';

export default {
  label: 'Cancel Report',
  icon: CancelIcon,
  component: function CancelReport({ rowData = {} }) {
    const {_id } = rowData;
    const dispatch = useDispatch();

    const cancelEventReport = useCallback(() => {
      dispatch(actions.resource.eventreports.cancelReport(_id));
    }, [_id, dispatch]);

    useEffect(() => {
      cancelEventReport();
    }, [cancelEventReport]);

    return null;
  },
};

