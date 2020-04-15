import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import moment from 'moment';
import * as selectors from '../../../../../reducers';
import DebugIcon from '../../../../icons/DebugIcon';
import actions from '../../../../../actions';

export default {
  label: 'Open debugger',
  component: function OpenDebugger({ resource, integrationId }) {
    const dispatch = useDispatch();
    const canAccess = useSelector(
      state =>
        selectors.resourcePermissions(
          state,
          'integrations',
          integrationId,
          'connections'
        ).edit
    );

    if (!canAccess) return null;
    const handleOpenDebuggerClick = () => {
      dispatch(actions.connection.requestDebugLogs(resource._id));

      dispatch(
        actions.resource.patch('connections', resource._id, [
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
