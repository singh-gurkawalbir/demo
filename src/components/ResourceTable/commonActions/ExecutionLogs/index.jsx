import { useCallback } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import AuditLogIcon from '../../../icons/AuditLogIcon';
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  key: 'viewExecutionLog',
  useLabel: () => 'View execution log',
  icon: AuditLogIcon,
  useOnClick: rowData => {
    const { _id: scriptId } = rowData;

    const {flowId} = useGetTableContext();

    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    return useCallback(() => {
      dispatch(actions.logs.scripts.request({scriptId, flowId, isInit: true}));
      // bottomDrawer is supported in flow builder
      if (flowId) {
        dispatch(actions.bottomDrawer.addTab({tabType: 'scriptLogs', resourceId: scriptId}));
      }

      if (!flowId) {
        history.push(
          `${location.pathname}/viewLogs/${scriptId}`
        );
      }
    }, [dispatch, flowId, history, location.pathname, scriptId]);
  },
};
