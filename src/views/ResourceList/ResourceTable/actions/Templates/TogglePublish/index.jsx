import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import HookIcon from '../../../../../../components/icons/HookIcon';
import actions from '../../../../../../actions';

export default {
  label: 'Toggle Publish',
  component: function TogglePublish({ resourceType, resource }) {
    const dispatch = useDispatch();
    const handleTogglePublishClick = () => {
      dispatch(actions.template.publish(resource, resourceType));
    };

    return (
      <IconButton size="small" onClick={handleTogglePublishClick}>
        {resource.published ? <HookIcon /> : <HookIcon />}
      </IconButton>
    );
  },
};
