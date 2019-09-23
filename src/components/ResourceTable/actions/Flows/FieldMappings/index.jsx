import { IconButton } from '@material-ui/core';
import Icon from '../../../../icons/CloseIcon';

export default {
  label: 'Field Mappings',
  component: function FiledMappings() {
    const onFieldMappingsClick = () => {};

    return (
      <IconButton size="small" onClick={onFieldMappingsClick}>
        <Icon />
      </IconButton>
    );
  },
};
