import { IconButton } from '@material-ui/core';
import Icon from '../../../../../../components/icons/CloseIcon';

export default {
  label: 'Clone Flow',
  component: function CloneFlow() {
    const onCloneFlowClick = () => {};

    return (
      <IconButton size="small" onClick={onCloneFlowClick}>
        <Icon />
      </IconButton>
    );
  },
};
