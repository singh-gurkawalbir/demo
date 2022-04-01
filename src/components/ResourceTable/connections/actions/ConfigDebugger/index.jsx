import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../../reducers';
import { DRAWER_URL_PREFIX } from '../../../../../utils/rightDrawer';
import DebugIcon from '../../../../icons/DebugIcon';

export default {
  key: 'debugConnection',
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
      history.push(`${match.url}/${DRAWER_URL_PREFIX}/configDebugger/${rowData._id}`);
    }, [history, match.url, rowData._id]);
  },
};
