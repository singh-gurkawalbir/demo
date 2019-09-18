import { IconButton } from '@material-ui/core';
import Icon from '../../../../../../components/icons/CloseIcon';

export default {
  label: 'Attach Flow',
  component: function AttachFlow() {
    const onAttachFlowClick = () => {};

    return (
      <IconButton size="small" onClick={onAttachFlowClick}>
        <Icon />
      </IconButton>
    );
  },
};
