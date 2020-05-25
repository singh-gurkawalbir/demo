import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CopyIcon from '../../../icons/CopyIcon';
import getRoutePath from '../../../../utils/routePaths';

export default {
  label: 'Clone',
  icon: CopyIcon,
  component: function Clone({ resourceType, resource }) {
    const history = useHistory();
    const openCloneURL = useCallback(() => {
      history.push(
        getRoutePath(`clone/${resourceType}/${resource._id}/preview`)
      );
    }, [history, resource._id, resourceType]);

    useEffect(() => {
      openCloneURL();
    }, [openCloneURL]);

    return null;
  },
};
