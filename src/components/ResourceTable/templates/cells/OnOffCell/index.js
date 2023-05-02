import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Spinner } from '@celigo/fuse-ui';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../ConfirmDialog';
import { selectors } from '../../../../../reducers';

export default function OnOffCell({
  templateId: resourceId,
  published: isPublished,
  applications,
  resourceType,
  tooltip,
}) {
  const { confirmDialog } = useConfirmDialog();
  const dispatch = useDispatch();

  const toggleStatus = useSelector(state => selectors.templatePublishStatus(state, resourceId));
  const handleTogglePublishConfirm = useCallback(() => {
    const label = isPublished ? 'unpublish' : 'publish';

    confirmDialog({
      title: `Confirm ${label}`,
      message: `Are you sure you want to ${label} this template?`,
      buttons: [
        {
          label: isPublished ? 'Unpublish' : 'Publish',
          onClick: () => dispatch(actions.template.publish.request(resourceId, isPublished)),
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, isPublished, resourceId, dispatch]);

  if (resourceType !== 'templates' && !applications?.length) {
    return null;
  }

  if (toggleStatus === 'loading') {
    return <Spinner />;
  }

  return (
    <Switch
      sx={{mr: 2}}
      checked={isPublished}
      onChange={handleTogglePublishConfirm}
      tooltip={tooltip}
    />
  );
}
