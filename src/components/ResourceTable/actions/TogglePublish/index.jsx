import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import UnpublishIcon from '../../../icons/UnpublishedIcon';
import PublishIcon from '../../../icons/PublishIcon';
import actions from '../../../../actions';

export default {
  label: r => (r.published ? 'Unpublish' : 'Publish'),
  icon: r => (r.published ? UnpublishIcon : PublishIcon),
  component: function TogglePublish({ resourceType, rowData = {} }) {
    const { _id: resourceId, published: isPublished } = rowData;
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
