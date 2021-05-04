import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DebugIcon from '../../../../icons/DebugIcon';

export default {
  label: 'Debug connection',
  icon: DebugIcon,
  useHasAccess: ({ rowData }) => {
    const { _id: connectionId } = rowData;
    const hasAccess = useSelector(state => selectors.resourcePermissions(
      state,
      'connections',
      connectionId
    ))?.edit;

    return hasAccess;
  },
  component: function OpenDebugger({ rowData = {}, flowId }) {
    const { _id: connectionId } = rowData;
    const dispatch = useDispatch();
    const openDebugger = useCallback(() => {
      dispatch(actions.logs.connections.request(connectionId));
      // bottomDrawer is supported in flow builder
      if (flowId) {
        dispatch(actions.bottomDrawer.addTab({tabType: 'connectionLogs', resourceId: connectionId}));
      }
    }, [connectionId, dispatch, flowId]);

    useEffect(() => {
      openDebugger();
    }, [openDebugger]);

    return null;
  },
};
