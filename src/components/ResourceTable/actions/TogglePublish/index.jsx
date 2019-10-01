import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
// TODO Azhar
import UnpublishIcon from '../../../../components/icons/ExportsIcon';
import PublishIcon from '../../../../components/icons/ImportsIcon';
import actions from '../../../../actions';

export default {
  label: 'Toggle Publish',
  component: function TogglePublish({ resourceType, resource }) {
    const dispatch = useDispatch();
    const handleTogglePublishClick = () => {
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
        {resource.published ? <UnpublishIcon /> : <PublishIcon />}
      </IconButton>
    );
  },
};
