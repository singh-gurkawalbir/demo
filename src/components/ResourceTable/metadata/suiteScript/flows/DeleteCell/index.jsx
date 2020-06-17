import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TrashIcon from '../../../../../icons/TrashIcon';
import IconButtonWithTooltip from '../../../../../IconButtonWithTooltip';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import useConfirmDialog from '../../../../../ConfirmDialog';

export default function DeleteCell({ssLinkedConnectionId, flow}) {
  const dispatch = useDispatch();
  const { defaultConfirmDialog } = useConfirmDialog();
  const handleClick = useCallback(() => {
    defaultConfirmDialog(
      'delete this Flow?',
      () => {
        dispatch(actions.suiteScript.flow.delete({ ssLinkedConnectionId, integrationId: flow._integrationId, _id: flow._id}));
      }
    );
  }, [defaultConfirmDialog, dispatch, flow._id, flow._integrationId, ssLinkedConnectionId]);
  const hasManagePermissions = useSelector(
    state =>
      selectors.resourcePermissions(state, 'connections', ssLinkedConnectionId)
        .edit
  );

  return (
    <IconButtonWithTooltip
      tooltipProps={{title: 'Delete', placement: 'bottom'}}
      onClick={handleClick}
      disabled={!hasManagePermissions}>
      <TrashIcon />
    </IconButtonWithTooltip>
  );
}
