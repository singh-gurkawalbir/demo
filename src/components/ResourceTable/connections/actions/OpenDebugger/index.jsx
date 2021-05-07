import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
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
  component: function OpenDebugger({ rowData = {} }) {
    const { _id: connectionId } = rowData;
    const dispatch = useDispatch();
    const isDebugActive = useSelector(state => {
      const {debugDate} = selectors.resource(state, 'connections', connectionId);

      return !!(debugDate && moment().isBefore(moment(debugDate)));
    });
    const openDebugger = useCallback(() => {
      dispatch(actions.logs.connections.request(connectionId));
      dispatch(actions.bottomDrawer.addTab({tabType: 'connectionLogs', resourceId: connectionId}));
      if (!isDebugActive) {
        dispatch(actions.logs.connections.startDebug(connectionId, 15));
      }
    }, [connectionId, dispatch, isDebugActive]);

    useEffect(() => {
      openDebugger();
    }, [openDebugger]);

    return null;
  },
};
