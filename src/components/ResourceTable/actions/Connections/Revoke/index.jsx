import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import actions from '../../../../../actions';
import CloseIcon from '../../../../icons/CloseIcon';
import { confirmDialog } from '../../../../ConfirmDialog';

export default {
  label: 'revoke',
  component: function Revoke({ resource: connection }) {
    const dispatch = useDispatch();
    const handleClick = () => {
      const message = [
        'Are you sure you want to revoke',
        connection.name || connection._id,
        'token?',
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
              dispatch(actions.connection.requestRevoke(connection._id));
            },
          },
        ],
      });
    };

    return (
      <IconButton data-test="revoke" size="small" onClick={handleClick}>
        <CloseIcon />
      </IconButton>
    );
  },
};
