
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Spinner } from '@celigo/fuse-ui';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import useConfirmDialog from '../../../../ConfirmDialog';

export default function OnOffCell({
  connectorId: resourceId,
  published: isPublished,
  applications,
  resourceType,
  tooltip,
}) {
  const { confirmDialog } = useConfirmDialog();
  const dispatch = useDispatch();
  const toggleStatus = useSelector(state => selectors.connectorPublishStatus(state, resourceId));
  const handleTogglePublishConfirm = useCallback(() => {
    const label = isPublished ? 'unpublish' : 'publish';

    confirmDialog({
      title: `Confirm ${label}`,
      message: `Are you sure you want to ${label} this integration app?`,
      buttons: [
        {
          label: isPublished ? 'Unpublish' : 'Publish',
          onClick: () => dispatch(actions.connectors.publish.request(resourceId, isPublished)),
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, isPublished, resourceId, dispatch]);

  if (resourceType !== 'connectors' && !applications?.length) {
    return null;
  }

  if (toggleStatus === 'loading') {
    return <Spinner />;
  }

  return (
    <Switch
      checked={isPublished}
      tooltip={tooltip}
      onChange={handleTogglePublishConfirm}
      sx={{
        mr: 2,
      }}
    />
  );
}
