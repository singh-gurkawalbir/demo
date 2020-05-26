import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import DebugIcon from '../../../../icons/DebugIcon';

export default {
  label: 'Open debugger',
  icon: DebugIcon,
  hasAccess: ({ state, resource }) => {
    const { _id: connectionId } = resource;
    const hasAccess = selectors.resourcePermissions(
      state,
      'connections',
      connectionId
    ).edit;

    return hasAccess;
  },
  component: function OpenDebugger({ resource }) {
    const { _id: connectionId } = resource;
    const dispatch = useDispatch();
    const openDebugger = useCallback(() => {
      dispatch(actions.connection.requestDebugLogs(connectionId));

      dispatch(
        actions.resource.patch('connections', connectionId, [
          {
            op: 'replace',
            path: '/debugDate',
            value: moment()
              .add(60, 'm')
              .toISOString(),
          },
        ])
      );
    }, [connectionId, dispatch]);

    useEffect(() => {
      openDebugger();
    }, [openDebugger]);

    return null;
  },
};
