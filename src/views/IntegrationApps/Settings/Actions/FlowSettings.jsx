import { IconButton } from '@material-ui/core';
import SettingsIcon from '../../../../components/icons/SettingsIcon';

export default {
  label: 'Description',
  component: function FlowSettings() {
    const handleClick = () => {};

    return (
      <IconButton size="small" onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
    );
  },
};
