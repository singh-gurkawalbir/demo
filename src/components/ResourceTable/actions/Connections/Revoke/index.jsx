import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../icons/RevokeTokenIcon';
import useConfirmDialog from '../../../../ConfirmDialog';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  component: function Revoke({ resource: connection }) {
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
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
      <IconButtonWithTooltip
        tooltipProps={{
          label: 'Revoke',
        }}
        data-test="revoke"
        size="small"
        onClick={handleClick}>
        <Icon />
      </IconButtonWithTooltip>
    );
  },
};
