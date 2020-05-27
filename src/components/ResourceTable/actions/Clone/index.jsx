import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CopyIcon from '../../../icons/CopyIcon';
import getRoutePath from '../../../../utils/routePaths';

export default {
  label: 'Clone',
  icon: CopyIcon,
  component: function Clone({ resourceType, rowData = {} }) {
    const { _id: resourceId } = rowData;
    const history = useHistory();
    const openCloneURL = useCallback(() => {
      history.push(getRoutePath(`clone/${resourceType}/${resourceId}/preview`));
    }, [history, resourceId, resourceType]);

    useEffect(() => {
      openCloneURL();
    }, [openCloneURL]);

    return null;
  },
};
