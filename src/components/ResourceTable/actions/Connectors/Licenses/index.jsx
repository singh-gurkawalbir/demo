import { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import TokensApiIcon from '../../../../icons/TokensApiIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  label: 'Licenses',
  icon: TokensApiIcon,
  component: function Licenses({ resource }) {
    const history = useHistory();
    const openLicensesURL = useCallback(() => {
      history.push(
        getRoutePath(
          getRoutePath(`/connectors/${resource._id}/connectorLicenses`)
        )
      );
    }, [history, resource._id]);

    useEffect(() => {
      openLicensesURL();
    }, [openLicensesURL]);

    return null;
  },
};
