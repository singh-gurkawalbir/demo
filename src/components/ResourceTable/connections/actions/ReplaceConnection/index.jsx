import { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import ReplaceIcon from '../../../../icons/ReplaceIcon';

export default {
  useLabel: () => 'Replace connection',
  icon: ReplaceIcon,
  useHasAccess: rowData => {
    const { _integrationId } = rowData;
    const hasAccess = useSelector(state => selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId,
      'connections'
    ))?.edit;

    return hasAccess;
  },
  component: function ReplaceConnections({ rowData = {} }) {
    const { _id: connectionId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();

    useEffect(() => {
      history.push(`${match.url}/replaceConnection/${connectionId}`);
    }, [history, connectionId, match.url]);

    return null;
  },
};
