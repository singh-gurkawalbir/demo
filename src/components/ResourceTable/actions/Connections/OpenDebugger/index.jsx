import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { IconButton } from '@material-ui/core';
import moment from 'moment';
import * as selectors from '../../../../../reducers';
import DebugIcon from '../../../../icons/DebugIcon';
import actions from '../../../../../actions';

export default {
  label: 'Open debugger',
  component: function OpenDebugger({ resource }) {
    const { _id: connectionId } = resource;
    const dispatch = useDispatch();
    // TODO: Currently we dont show Open Debugger for monitor user. Since it also calls connection api
    const canAccess = useSelector(
      state =>
        selectors.resourcePermissions(state, 'connections', connectionId).edit,
      shallowEqual
    );

    if (!canAccess) return null;
    const handleOpenDebuggerClick = () => {
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
    };

    return (
      <IconButton
        data-test="openDebugger"
        size="small"
        onClick={handleOpenDebuggerClick}>
        <DebugIcon />
      </IconButton>
    );
  },
};
