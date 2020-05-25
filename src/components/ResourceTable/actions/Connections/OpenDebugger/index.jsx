import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import DebugIcon from '../../../../icons/DebugIcon';

export default {
  icon: DebugIcon,
  title: 'Open debugger',
  component: function OpenDebugger({ resource }) {
    console.log('hello everyone');
    const { _id: connectionId } = resource;
    const dispatch = useDispatch();
    // TODO: Currently we dont show Open Debugger for monitor user. Since it also calls connection api
    const canAccess = useSelector(
      state =>
        selectors.resourcePermissions(state, 'connections', connectionId).edit
    );
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
      if (canAccess) {
        openDebugger();
      }
    }, [canAccess, openDebugger]);

    return null;
  },
};
