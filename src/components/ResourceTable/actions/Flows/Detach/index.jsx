import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import DetachIcon from '../../../../icons/unLinkedIcon';

import useConfirmDialog from '../../../../ConfirmDialog';

export default {
  label: 'Detach flow',
  icon: DetachIcon,
  component: function DetachFlow({ rowData = {} }) {
    const { _id: resourceId } = rowData;
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

      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', resourceId, 'value'));
    }, [dispatch, resourceId]);
    const confirmDetachFlow = useCallback(() => {
      confirmDialog({
        title: 'Confirm detach',
        message: 'Are you sure you want to detach this flow? The flow will be moved to the standalone flows tile.',
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Detach',
            onClick: detachFlow,
          },
        ],
      });
    }, [confirmDialog, detachFlow]);

    useEffect(() => {
      confirmDetachFlow();
    }, [confirmDetachFlow]);

    return null;
  },
};
