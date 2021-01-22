
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import useConfirmDialog from '../../../../ConfirmDialog';
import CeligoSwitch from '../../../../CeligoSwitch';
import Spinner from '../../../../Spinner';

export default function OnOffCell({
  connectorId: resourceId,
  published: isPublished,
  applications,
  resourceType,
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
          label,
          onClick: () => dispatch(actions.connectors.publish.request(resourceId, isPublished)),
        },
        {
          label: 'Cancel',
          color: 'secondary',
        },
      ],
    });
  }, [confirmDialog, isPublished, resourceId, dispatch]);

  if (resourceType !== 'connectors' && !applications?.length) {
    return null;
  }

  if (toggleStatus === 'loading') {
    return <Spinner size={24} />;
  }

  return (
    <CeligoSwitch
      checked={isPublished}
      onChange={handleTogglePublishConfirm}
    />
  );
}
