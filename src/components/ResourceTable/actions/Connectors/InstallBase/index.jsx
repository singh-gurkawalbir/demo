import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import GroupOfUsersIcon from '../../../../icons/GroupOfUsersIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  label: 'Install base',
  icon: GroupOfUsersIcon,
  component: function InstallBase({ resource }) {
    const history = useHistory();
    const openInstallBaseURL = useCallback(() => {
      history.push(
        getRoutePath(getRoutePath(`/connectors/${resource._id}/installBase`))
      );
    }, [history, resource._id]);

    useEffect(() => {
      openInstallBaseURL();
    }, [openInstallBaseURL]);

    return null;
  },
};
