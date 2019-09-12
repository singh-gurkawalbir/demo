import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { confirmDialog } from '../../../../../components/ConfirmDialog';
import Icon from '../../../../../components/icons/CloseIcon';
import actions from '../../../../../actions';
import { MODEL_PLURAL_TO_LABEL } from '../../../../../utils/resource';

export default {
  label: 'Delete',
  component: function Delete({ resourceType, resource }) {
    const dispatch = useDispatch();
    const handleClick = () => {
      confirmDialog({
        title: 'Confirm',
        message: `Are you sure you want to delete this ${MODEL_PLURAL_TO_LABEL[resourceType]}?`,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
            onClick: () => {
              dispatch(actions.resource.delete(resourceType, resource._id));
            },
          },
        ],
      });
    };

    return (
      <IconButton size="small" onClick={handleClick}>
        <Icon />
      </IconButton>
    );
  },
};
