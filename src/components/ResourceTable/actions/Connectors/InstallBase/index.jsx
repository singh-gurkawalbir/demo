import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import GroupOfUsersIcon from '../../../../icons/GroupOfUsersIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  key: 'installBase',
  icon: GroupOfUsersIcon,
  title: 'Install base',
  component: function InstallBase({ resource }) {
    const history = useHistory();
    const installBase = useCallback(() => {
      history.push(
        getRoutePath(getRoutePath(`/connectors/${resource._id}/installBase`))
      );
    }, [history, resource._id]);

    useEffect(() => {
      installBase();
    }, [installBase]);

    return null;
  },
};
