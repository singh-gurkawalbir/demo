import { useCallback } from 'react';
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
  useOnClick: rowData => {
    const history = useHistory();
    const match = useRouteMatch();

    return useCallback(() => {
      history.push(`${match.url}/configDebugger/${rowData._id}`);
    }, [history, match.url, rowData._id]);
  },
};
