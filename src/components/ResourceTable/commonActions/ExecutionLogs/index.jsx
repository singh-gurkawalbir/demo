import { useCallback } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import AuditLogIcon from '../../../icons/AuditLogIcon';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';

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
      } else {
        // opens a drawer incase of script resource
        history.push(buildDrawerUrl({
          path: drawerPaths.LOGS.SCRIPT,
          baseUrl: location.pathname, // TODO: @Raghu Is match.url not sufficient?
          params: { scriptId },
        }));
      }
    }, [dispatch, flowId, history, location.pathname, scriptId]);
  },
};
