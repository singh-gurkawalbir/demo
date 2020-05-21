import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import UnpublishIcon from '../../../../components/icons/UnpublishedIcon';
import PublishIcon from '../../../../components/icons/PublishIcon';
import actions from '../../../../actions';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

export default {
  component: function TogglePublish({ resourceType, resource = {} }) {
    const { _id: resourceId, published: isPublished } = resource;
    const dispatch = useDispatch();
    const handleTogglePublishClick = useCallback(() => {
      const patchSet = [
        {
          op: 'replace',
          path: '/published',
          value: !isPublished,
        },
      ];

      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged(resourceType, resourceId));
    }, [dispatch, isPublished, resourceId, resourceType]);

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          title: isPublished ? 'Unpublish' : 'Publish',
        }}
        data-test="togglePublish"
        size="small"
        onClick={handleTogglePublishClick}>
        {isPublished ? <UnpublishIcon /> : <PublishIcon />}
      </IconButtonWithTooltip>
    );
  },
};
