import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import DownloadIntegrationIcon from '../../../../icons/DownloadIntegrationIcon';
import { drawerPaths, buildDrawerUrl } from '../../../../../utils/rightDrawer';

export default {
  key: 'downloadErrors',
  useLabel: () => 'Download errors',
  icon: DownloadIntegrationIcon,
  useOnClick: rowData => {
    const match = useRouteMatch();
    const history = useHistory();
    const errorType = rowData?.isResolved ? 'resolved' : 'open';

    return useCallback(() => {
      history.push(buildDrawerUrl({
        path: drawerPaths.ERROR_MANAGEMENT.V2.DOWNLOAD_ERRORS,
        baseUrl: match.url,
        params: { type: errorType },
      }));
    }, [match.url, history, errorType]);
  },
};
