import { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import DebugIcon from '../../../../icons/DebugIcon';

export default {
  label: 'Replace connection',
  icon: DebugIcon,
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
