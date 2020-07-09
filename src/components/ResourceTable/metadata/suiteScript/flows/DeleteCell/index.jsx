import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TrashIcon from '../../../../../icons/TrashIcon';
import IconButtonWithTooltip from '../../../../../IconButtonWithTooltip';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import useConfirmDialog from '../../../../../ConfirmDialog';
import getRoutePath from '../../../../../../utils/routePaths';
import RemoveMargin from '../RemoveMargin';

export default function DeleteCell({ssLinkedConnectionId, flow, isFlowBuilderView}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const deleteResource = useCallback(() => {
    dispatch(
      actions.suiteScript.flow.delete({
        ssLinkedConnectionId,
        integrationId: flow._integrationId,
        _id: flow._id,
      })
    );
    if (isFlowBuilderView) {
      history.replace(
        getRoutePath(
          `/suitescript/${ssLinkedConnectionId}/integrations/${flow._integrationId}`
        )
      );
    }
  }, [dispatch, flow._id, flow._integrationId, history, isFlowBuilderView, ssLinkedConnectionId]);
  const handleClick = useCallback(() => {
    confirmDialog({
      title: 'Confirm delete',
      message: 'Are you sure you want to delete this flow?',
      buttons: [
        {
          label: 'Delete',
          onClick: deleteResource,
        },
        {
          label: 'Cancel',
          color: 'secondary',
        },
      ],
    });
  }, [confirmDialog, deleteResource]);
  const isManageLevelUser = useSelector(state => selectors.userHasManageAccessOnSuiteScriptAccount(state, ssLinkedConnectionId));

  return (
    <>
      <RemoveMargin>
        <IconButtonWithTooltip
          tooltipProps={{title: 'Delete', placement: 'bottom'}}
          onClick={handleClick}
          disabled={!isManageLevelUser}>
          <TrashIcon />
        </IconButtonWithTooltip>
      </RemoveMargin>
    </>
  );
}
