import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../../reducers';
import DebugIcon from '../../../../icons/DebugIcon';

export default {
  useLabel: () => 'Debug connection',
  icon: DebugIcon,
  useHasAccess: rowData => {
    const { _id: connectionId } = rowData;

    const hasAccess = useSelector(state => selectors.resourcePermissions(
      state,
      'connections',
      connectionId
    ))?.edit;

    return hasAccess;
  },
  component: function ConfigDebuggerAction({rowData}) {
    const history = useHistory();
    const match = useRouteMatch();

    useEffect(() => {
      history.push(`${match.url}/configDebugger/${rowData._id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  },
};
