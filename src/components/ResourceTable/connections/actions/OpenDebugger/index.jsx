import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DebugIcon from '../../../../icons/DebugIcon';

export default {
  label: 'Open debugger',
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
    const openDebugger = useCallback(() => {
      dispatch(actions.connection.requestDebugLogs(connectionId));
    }, [connectionId, dispatch]);

    useEffect(() => {
      openDebugger();
    }, [openDebugger]);

    return null;
  },
};
