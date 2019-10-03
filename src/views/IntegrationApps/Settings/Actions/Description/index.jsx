import { IconButton } from '@material-ui/core';
import CloseIcon from '../../../../../components/icons/CloseIcon';
import { confirmDialog } from '../../../../../components/ConfirmDialog';

export default {
  label: 'Description',
  component: function Description({ resource }) {
    const handleClick = () => {
      const message = (resource && resource.description) || 'No description';

      confirmDialog({
        message,
        title: '',
        buttons: [
          {
            label: 'Ok',
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
