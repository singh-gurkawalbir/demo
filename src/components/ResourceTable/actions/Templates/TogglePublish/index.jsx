import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import HookIcon from '../../../../../components/icons/HookIcon';
import actions from '../../../../../actions';

export default {
  label: 'Toggle Publish',
  component: function TogglePublish({ resourceType, resource }) {
    const dispatch = useDispatch();
    const handleTogglePublishClick = () => {
      dispatch(actions.template.publish(resource, resourceType));
      const patchSet = [
        {
          op: 'replace',
          path: '/published',
          value: !resource.published,
        },
      ];

      dispatch(actions.resource.patchStaged(resource._id, patchSet));
      dispatch(actions.resource.commitStaged(resourceType, resource._id));
    };

    return (
      <IconButton size="small" onClick={handleTogglePublishClick}>
        {resource.published ? <HookIcon /> : <HookIcon />}
      </IconButton>
    );
  },
};
