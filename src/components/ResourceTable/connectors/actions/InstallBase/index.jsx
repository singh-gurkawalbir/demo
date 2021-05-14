import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import GroupOfUsersIcon from '../../../../icons/GroupOfUsersIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  key: 'installBase',
  useLabel: () => 'Install base',
  icon: GroupOfUsersIcon,
  useOnClick: rowData => {
    const { _id: resourceId } = rowData;
    const history = useHistory();
    const openInstallBaseURL = useCallback(() => {
      history.push(getRoutePath(`/connectors/${resourceId}/installBase`));
    }, [history, resourceId]);

    return openInstallBaseURL;
  },
};
