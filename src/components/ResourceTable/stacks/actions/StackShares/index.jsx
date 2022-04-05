import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ShareStackIcon from '../../../../icons/ShareStackIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';

// Todo fix icon after other PR merge
export default {
  useLabel: () => 'Share stack',
  icon: ShareStackIcon,
  key: 'stackShares',
  useOnClick: rowData => {
    const { _id: stackId } = rowData;
    const match = useRouteMatch();
    const history = useHistory();
    const openShareStackURL = useCallback(() => {
      history.push(buildDrawerUrl({
        baseUrl: match.url,
        path: drawerPaths.SHARE_STACKS,
        params: { stackId },
      }));
    }, [history, match.url, stackId]);

    return openShareStackURL;
  },
};
