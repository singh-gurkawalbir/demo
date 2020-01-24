import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import moment from 'moment';
import DebugIcon from '../../../../icons/DebugIcon';
import actions from '../../../../../actions';

export default {
  label: 'Open debugger',
  component: function OpenDebugger({ resource }) {
    const dispatch = useDispatch();
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
