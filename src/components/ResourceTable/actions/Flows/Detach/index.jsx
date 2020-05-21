import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../icons/CloseIcon';
import useConfirmDialog from '../../../../ConfirmDialog';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  component: function DetachFlow({ resource }) {
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const handleDetachFlow = () => {
      const message = `Are you sure you want to detach 
      ${resource.name || resource._id} flow from this integration?`;

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
              const patchSet = [
                {
                  op: 'replace',
                  path: '/_integrationId',
                  value: undefined,
                },
              ];

              dispatch(
                actions.resource.patchStaged(resource._id, patchSet, 'value')
              );
              dispatch(
                actions.resource.commitStaged('flows', resource._id, 'value')
              );
            },
          },
        ],
      });
    };

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Detach Flow',
        }}
        data-test="detachFlow"
        size="small"
        onClick={handleDetachFlow}>
        <Icon />
      </IconButtonWithTooltip>
    );
  },
};
