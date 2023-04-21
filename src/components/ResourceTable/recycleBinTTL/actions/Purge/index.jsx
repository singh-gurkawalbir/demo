import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PurgeIcon from '../../../../icons/PurgeIcon';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../ConfirmDialog';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR } from '../../../../../constants/resource';

export default {
  key: 'purge',
  useLabel: () => 'Purge',
  icon: PurgeIcon,
  mode: 'delete',
  useOnClick: rowData => {
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const purgeResource = useCallback(() => {
      dispatch(
        actions.recycleBin.purge(
          `${RESOURCE_TYPE_LABEL_TO_SINGULAR[rowData.model]}s`,
          rowData.doc && rowData.doc._id
        )
      );
    }, [dispatch, rowData.doc, rowData.model]);
    const confirmPurge = useCallback(() => {
      confirmDialog({
        title: 'Confirm purge',
        message: `Are you sure you want to purge this ${
          RESOURCE_TYPE_LABEL_TO_SINGULAR[rowData.model].toLowerCase()
        }?`,
        buttons: [
          {
            label: 'Purge',
            onClick: purgeResource,
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }, [confirmDialog, purgeResource, rowData.model]);

    return confirmPurge;
  },
};
