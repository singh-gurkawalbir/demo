import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import DetachIcon from '../../../../icons/unLinkedIcon';

import useConfirmDialog from '../../../../ConfirmDialog';

export default {
  label: 'Detach flow',
  icon: DetachIcon,
  component: function DetachFlow({ rowData = {} }) {
    const { name: resourceName, _id: resourceId } = rowData;
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
      const message = `Are you sure you want to detach 
      ${resourceName || resourceId} flow from this integration?`;

      confirmDialog({
        title: 'Confirm',
        message,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
            onClick: detachFlow,
          },
        ],
      });
    }, [confirmDialog, detachFlow, resourceId, resourceName]);

    useEffect(() => {
      confirmDetachFlow();
    }, [confirmDetachFlow]);

    return null;
  },
};
