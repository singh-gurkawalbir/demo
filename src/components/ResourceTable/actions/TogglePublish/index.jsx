import { useDispatch } from 'react-redux';
import UnpublishIcon from '../../../../components/icons/UnpublishedIcon';
import PublishIcon from '../../../../components/icons/PublishIcon';
import actions from '../../../../actions';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

export default {
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

      dispatch(actions.resource.patchStaged(resource._id, patchSet, 'value'));
      dispatch(actions.resource.commitStaged(resourceType, resource._id));
    };

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          title: resource.published ? 'Unpublish' : 'Publish',
        }}
        data-test="togglePublish"
        size="small"
        onClick={handleTogglePublishClick}>
        {resource.published ? <UnpublishIcon /> : <PublishIcon />}
      </IconButtonWithTooltip>
    );
  },
};
