import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import actions from '../../../../../actions';
import Icon from '../../../../icons/CloseIcon';
import { confirmDialog } from '../../../../ConfirmDialog';

export default {
  label: 'Detach Flow',
  component: function DetachFlow({ resource }) {
    const dispatch = useDispatch();
    const handleDetachFlow = () => {
      const message = [
        'Are you sure you want to detach',
        resource.name || resource._id,
        'flow from this integration?',
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
      <IconButton
        data-test="detachFlow"
        size="small"
        onClick={handleDetachFlow}>
        <Icon />
      </IconButton>
    );
  },
};
