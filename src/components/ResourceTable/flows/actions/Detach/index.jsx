import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DetachIcon from '../../../../icons/unLinkedIcon';

import useConfirmDialog from '../../../../ConfirmDialog';

export default {
  key: 'detachFlow',
  useLabel: () => 'Detach flow',
  icon: DetachIcon,
  useHasAccess: rowData => {
    const { _integrationId } = rowData;

    const canDetach = useSelector(state => selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId,
      'flows'
    ))?.detach;

    return canDetach;
  },
  useOnClick: rowData => {
    const { _id: resourceId, _flowGroupingId: flowGroupId } = rowData;
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const detachFlow = useCallback(() => {
      const patchSet = [
        {
          op: 'replace',
          path: '/_integrationId',
          value: undefined,
        },
      ];

      if (flowGroupId) {
        patchSet.push({
          op: 'replace',
          path: '/_flowGroupingId',
          value: undefined,
        });
      }

      dispatch(actions.resource.patchAndCommitStaged('flows', resourceId, patchSet));
    }, [dispatch, flowGroupId, resourceId]);
    const confirmDetachFlow = useCallback(() => {
      confirmDialog({
        title: 'Confirm detach',
        message: 'Are you sure you want to detach this flow? The flow will be moved to the standalone flows tile.',
        buttons: [
          {
            label: 'Detach',
            onClick: detachFlow,
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }, [confirmDialog, detachFlow]);

    return confirmDetachFlow;
  },
};
