import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
// import UnpublishIcon from '../../../icons/UnpublishedIcon';
import PublishIcon from '../../../icons/PublishIcon';
import actions from '../../../../actions';
import useConfirmDialog from '../../../ConfirmDialog';
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  key: 'togglePublish',
  useLabel: r => (r.published ? 'Unpublish app' : 'Publish app'),
  // icon: r => (r.published ? UnpublishIcon : PublishIcon),
  // ToDo: Need to do changes here to render icon dynamically.
  icon: PublishIcon,
  useHasAccess: rowData => {
    const {resourceType} = useGetTableContext();

    return !(resourceType === 'templates' && !rowData.applications?.length);
  },
  useOnClick: rowData => {
    const { _id: resourceId, published: isPublished } = rowData;
    const { confirmDialog } = useConfirmDialog();
    const {resourceType} = useGetTableContext();

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
    const togglePublishConfirm = useCallback(() => {
      confirmDialog({
        title: `Confirm ${isPublished ? 'unpublish' : 'publish'}`,
        message: `Are you sure you want to ${isPublished ? 'unpublish' : 'publish'} this ${resourceType === 'templates' ? 'template' : 'integration app'}?`,
        buttons: [
          {
            label: isPublished ? 'Unpublish' : 'Publish',
            onClick: togglePublish,
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    }, [confirmDialog, isPublished, resourceType, togglePublish]);

    return togglePublishConfirm;
  },
};
