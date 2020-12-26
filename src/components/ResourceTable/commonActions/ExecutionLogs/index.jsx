import { useEffect } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import AuditLogIcon from '../../../icons/AuditLogIcon';

export default {
  label: 'View execution log',
  icon: AuditLogIcon,
  component: function ExecutionLogs({ rowData = {}, flowId }) {
    const { _id: scriptId } = rowData;
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
      dispatch(actions.script.requestLogs({scriptId, flowId}));

      // return () => {
      //   console.log('closing');
      //   dispatch(actions.script.clear({scriptId, flowId}));
      // };
    }, [dispatch, flowId, scriptId]);

    useEffect(() => {
      if (!flowId) {
        history.push(
          `${location.pathname}/viewLogs/${scriptId}`
        );
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flowId]);

    return null;
  },
};
