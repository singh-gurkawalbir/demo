import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import actions from '../../../../../actions';
import CloseIcon from '../../../../icons/CloseIcon';
import { confirmDialog } from '../../../../ConfirmDialog';

export default {
  label: 'Deregister',
  component: function Deregister({ resource: connection, integrationId }) {
    const dispatch = useDispatch();
    const handleClick = () => {
      const message = [
        'Are you sure you want to deregister',
        connection.name || connection._id,
        'connection from this integration?',
      ].join(' ');

      confirmDialog({
        title: 'Confirm',
        message,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
            onClick: () => {
              dispatch(
                actions.connection.requestDeregister(
                  connection._id,
                  integrationId
                )
              );
            },
          },
        ],
      });
    };

    return (
      <IconButton size="small" onClick={handleClick}>
        <CloseIcon />
      </IconButton>
    );
  },
};
