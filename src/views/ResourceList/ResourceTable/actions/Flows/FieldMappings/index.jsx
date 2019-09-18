import { IconButton } from '@material-ui/core';
import Icon from '../../../../../../components/icons/CloseIcon';

export default {
  label: 'Filed Mappings',
  component: function FiledMappings() {
    const onFieldMappingsClick = () => {};

    return (
      <IconButton size="small" onClick={onFieldMappingsClick}>
        <Icon />
      </IconButton>
    );
  },
};
