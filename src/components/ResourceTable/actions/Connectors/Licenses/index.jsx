import { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import TokensApiIcon from '../../../../icons/TokensApiIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  key: 'licenses',
  icon: TokensApiIcon,
  title: 'Licenses',
  component: function Licenses({ resource }) {
    const history = useHistory();
    const showLicenses = useCallback(() => {
      history.push(
        getRoutePath(
          getRoutePath(`/connectors/${resource._id}/connectorLicenses`)
        )
      );
    }, [history, resource._id]);

    useEffect(() => {
      showLicenses();
    }, [showLicenses]);

    return null;
  },
};
