import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import DebugIcon from '../../../../icons/DebugIcon';

export default {
  label: 'Open debugger',
  icon: DebugIcon,
  hasAccess: ({ state, rowData }) => {
    const { _id: connectionId } = rowData;
    const hasAccess = selectors.resourcePermissions(
      state,
      'connections',
      connectionId
    ).edit;

    return hasAccess;
  },
  component: function OpenDebugger({ rowData = {} }) {
    const { _id: connectionId } = rowData;
    const dispatch = useDispatch();
    const openDebugger = useCallback(() => {
      dispatch(actions.connection.requestDebugLogs(connectionId));
    }, [connectionId, dispatch]);

    useEffect(() => {
      openDebugger();
    }, [openDebugger]);

    return null;
  },
};
