import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ShareStackIcon from '../../../../icons/ShareStackIcon';
import { DRAWER_URL_PREFIX } from '../../../../../utils/drawerURLs';

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
      history.push(`${match.url}/${DRAWER_URL_PREFIX}/share/stacks/${stackId}`);
    }, [history, match.url, stackId]);

    return openShareStackURL;
  },
};
