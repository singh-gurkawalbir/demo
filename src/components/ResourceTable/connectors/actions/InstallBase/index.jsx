import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import GroupOfUsersIcon from '../../../../icons/GroupOfUsersIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  label: 'Install base',
  icon: GroupOfUsersIcon,
  component: function InstallBase({ rowData = {} }) {
    const { _id: resourceId } = rowData;
    const history = useHistory();
    const openInstallBaseURL = useCallback(() => {
      history.push(getRoutePath(`/connectors/${resourceId}/installBase`));
    }, [history, resourceId]);

    useEffect(() => {
      openInstallBaseURL();
    }, [openInstallBaseURL]);

    return null;
  },
};
