import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import CloseIcon from '../../../../icons/CloseIcon';
import useConfirmDialog from '../../../../ConfirmDialog';

export default {
  label: 'Deregister',
  component: function Deregister({ resource: connection, integrationId }) {
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    // todo when to show deregister
    const canAccess = useSelector(
      state =>
        selectors.resourcePermissions(
          state,
          'integrations',
          integrationId,
          'connections'
        ).edit
    );

    if (!canAccess) {
      return null;
    }

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
      <IconButton
        data-test="closeDeregisterModal"
        size="small"
        onClick={handleClick}>
        <CloseIcon />
      </IconButton>
    );
  },
};
