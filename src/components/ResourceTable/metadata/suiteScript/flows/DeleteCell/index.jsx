import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TrashIcon from '../../../../../icons/TrashIcon';
import IconButtonWithTooltip from '../../../../../IconButtonWithTooltip';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import useConfirmDialog from '../../../../../ConfirmDialog';
import getRoutePath from '../../../../../../utils/routePaths';

export default function DeleteCell({ssLinkedConnectionId, flow, isFlowBuilderView}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { defaultConfirmDialog } = useConfirmDialog();
  const handleClick = useCallback(() => {
    defaultConfirmDialog('delete this Flow?', () => {
      dispatch(
        actions.suiteScript.flow.delete({
          ssLinkedConnectionId,
          integrationId: flow._integrationId,
          _id: flow._id,
        })
      );
      if (isFlowBuilderView) {
        history.push(
          getRoutePath(
            `/suitescript/${ssLinkedConnectionId}/integrations/${flow._integrationId}`
          )
        );
      }
    });
  }, [
    defaultConfirmDialog,
    dispatch,
    flow._id,
    flow._integrationId,
    history,
    isFlowBuilderView,
    ssLinkedConnectionId,
  ]);
  const isManageLevelUser = useSelector(state => selectors.userHasManageAccessOnSuiteScriptAccount(state, ssLinkedConnectionId));

  return (
    <IconButtonWithTooltip
      tooltipProps={{title: 'Delete', placement: 'bottom'}}
      onClick={handleClick}
      disabled={!isManageLevelUser}>
      <TrashIcon />
    </IconButtonWithTooltip>
  );
}
