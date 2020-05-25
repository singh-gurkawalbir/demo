import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import UnpublishIcon from '../../../../components/icons/UnpublishedIcon';
import PublishIcon from '../../../../components/icons/PublishIcon';
import actions from '../../../../actions';

export default {
  label: r => (r.published ? 'Unpublish' : 'Publish'),
  icon: r => (r.published ? UnpublishIcon : PublishIcon),
  component: function TogglePublish({ resourceType, resource = {} }) {
    const { _id: resourceId, published: isPublished } = resource;
    const dispatch = useDispatch();
    const togglePublish = useCallback(() => {
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

    useEffect(() => {
      togglePublish();
    }, [togglePublish]);

    return null;
  },
};
