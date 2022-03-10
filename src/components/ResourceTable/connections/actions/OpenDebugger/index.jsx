import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
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
    const { _id: connectionId } = rowData;
    const dispatch = useDispatch();

    const openDebugger = useCallback(() => {
      dispatch(actions.bottomDrawer.addTab({tabType: 'connectionLogs', resourceId: connectionId}));
    }, [connectionId, dispatch]);

    return openDebugger;
  },
};
