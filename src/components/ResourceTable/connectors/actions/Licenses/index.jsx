import { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import TokensApiIcon from '../../../../icons/TokensApiIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  label: 'Licenses',
  icon: TokensApiIcon,
  component: function Licenses({ rowData = {} }) {
    const { _id: resourceId } = rowData;
    const history = useHistory();
    const openLicensesURL = useCallback(() => {
      history.push(getRoutePath(`/connectors/${resourceId}/connectorLicenses`));
    }, [history, resourceId]);

    useEffect(() => {
      openLicensesURL();
    }, [openLicensesURL]);

    return null;
  },
};
