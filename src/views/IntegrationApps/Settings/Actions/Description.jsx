import { IconButton } from '@material-ui/core';
import { confirmDialog } from '../../../../components/ConfirmDialog';
import InfoIcon from '../../../../components/icons/InfoIcon';

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
        <InfoIcon />
      </IconButton>
    );
  },
};
