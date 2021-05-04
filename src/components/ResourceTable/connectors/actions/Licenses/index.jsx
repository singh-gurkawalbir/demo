import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import TokensApiIcon from '../../../../icons/TokensApiIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  key: 'licenses',
  useLabel: () => 'Licenses',
  icon: TokensApiIcon,
  useOnClick: rowData => {
    const { _id: resourceId } = rowData;
    const history = useHistory();
    const openLicensesURL = useCallback(() => {
      history.push(getRoutePath(`/connectors/${resourceId}/connectorLicenses`));
    }, [history, resourceId]);

    return openLicensesURL;
  },
};
