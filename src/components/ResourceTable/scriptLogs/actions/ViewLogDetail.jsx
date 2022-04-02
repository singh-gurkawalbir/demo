import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';

export default {
  key: 'viewLogDetail',
  useLabel: () => 'View',
  useOnClick: rowData => {
    const {index} = rowData;
    const {flowId, scriptId } = useGetTableContext();
    const location = useLocation();
    const history = useHistory();

    return useCallback(() => {
      history.push(buildDrawerUrl({
        path: flowId ? drawerPaths.LOGS.FLOW_SCRIPT_DETAIL : drawerPaths.LOGS.SCRIPT_DETAIL,
        baseUrl: location.pathname,
        params: { scriptId, index, flowId },
      }));
    }, [flowId, history, index, location.pathname, scriptId]);
  },
};
