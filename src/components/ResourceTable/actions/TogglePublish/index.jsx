import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import UnpublishIcon from '../../../../components/icons/UnpublishedIcon';
import PublishIcon from '../../../../components/icons/PublishIcon';
import actions from '../../../../actions';

export default {
  label: r => (r.published ? 'Unpublish' : 'Publish'),
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
      <IconButton
        data-test="togglePublish"
        size="small"
        onClick={handleTogglePublishClick}>
        {resource.published ? <UnpublishIcon /> : <PublishIcon />}
      </IconButton>
    );
  },
};
