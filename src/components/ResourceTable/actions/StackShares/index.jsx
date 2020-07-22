import { useCallback, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ShareStackIcon from '../../../icons/ShareStackIcon';

// Todo fix icon after other PR merge
export default {
  label: 'Share stack',
  icon: ShareStackIcon,
  key: 'stackShares',
  component: function StackShares({ rowData = {} }) {
    const { _id: stackId } = rowData;
    const match = useRouteMatch();
    const history = useHistory();
    const openShareStackURL = useCallback(() => {
      history.push(`${match.url}/share/stacks/${stackId}`);
    }, [history, match.url, stackId]);

    useEffect(() => {
      openShareStackURL();
    }, [openShareStackURL]);

    return null;
  },
};
