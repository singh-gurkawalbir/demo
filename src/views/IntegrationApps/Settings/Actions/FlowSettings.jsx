import { IconButton } from '@material-ui/core';
import { confirmDialog } from '../../../../components/ConfirmDialog';
import SettingsIcon from '../../../../components/icons/SettingsIcon';

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
        <SettingsIcon />
      </IconButton>
    );
  },
};
