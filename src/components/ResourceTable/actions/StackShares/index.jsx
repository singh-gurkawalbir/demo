import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import getRoutePath from '../../../../utils/routePaths';

// Todo fix icon after other PR merge
export default {
  key: 'stackShares',
  component: function StackShares({ resource }) {
    const history = useHistory();
    const openShareStackURL = useCallback(() => {
      history.push(getRoutePath(`/stacks/share/stacks/${resource._id}`));
    }, [history, resource._id]);

    useEffect(() => {
      openShareStackURL();
    }, [openShareStackURL]);

    return null;
  },
};
