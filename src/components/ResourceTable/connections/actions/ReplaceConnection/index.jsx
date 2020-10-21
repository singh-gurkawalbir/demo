import { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ReplaceIcon from '../../../../icons/ReplaceIcon';

export default {
  label: 'Replace connection',
  icon: ReplaceIcon,
  component: function ReplaceConnections({ rowData = {} }) {
    const { _id: connectionId } = rowData;
    const history = useHistory();

    const match = useRouteMatch();

    useEffect(() => {
      history.replace(`${match.url}/replaceConnection/${connectionId}`);
    }, [history, connectionId, match.url]);

    return null;
  },
};
