import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PurgeIcon from '../../../../icons/PurgeIcon';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../ConfirmDialog';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR } from '../../../../../constants/resource';

export default {
  label: 'purge',
  icon: PurgeIcon,
  component: function Purge({ rowData = {} }) {
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
        title: 'Confirm',
        message: `Are you sure you want to delete this ${
          RESOURCE_TYPE_LABEL_TO_SINGULAR[rowData.model]
        }?`,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
            onClick: purgeResource,
          },
        ],
      });
    }, [confirmDialog, purgeResource, rowData.model]);

    useEffect(() => {
      confirmPurge();
    }, [confirmPurge]);

    return null;
  },
};
