import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as selectors from '../../../../../reducers';
import DebugIcon from '../../../../icons/DebugIcon';
import actions from '../../../../../actions';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  component: function OpenDebugger({ resource }) {
    const { _id: connectionId } = resource;
    const dispatch = useDispatch();
    // TODO: Currently we dont show Open Debugger for monitor user. Since it also calls connection api
    const canAccess = useSelector(
      state =>
        selectors.resourcePermissions(state, 'connections', connectionId).edit
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
      <IconButtonWithTooltip
        tooltipProps={{
          label: 'Open debugger',
        }}
        data-test="openDebugger"
        size="small"
        onClick={handleOpenDebuggerClick}>
        <DebugIcon />
      </IconButtonWithTooltip>
    );
  },
};
