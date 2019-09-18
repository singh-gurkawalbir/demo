import { IconButton } from '@material-ui/core';
import Icon from '../../../../../../components/icons/CloseIcon';

export default {
  label: 'Schedule',
  component: function Schedule() {
    const onScheduleClick = () => {};

    return (
      <IconButton size="small" onClick={onScheduleClick}>
        <Icon />
      </IconButton>
    );
  },
};
