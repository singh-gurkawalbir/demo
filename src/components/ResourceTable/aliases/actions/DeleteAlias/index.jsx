import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import { ALIAS_FORM_KEY } from '../../../../../constants';
import { message } from '../../../../../utils/messageStore';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';
import useConfirmDialog from '../../../../ConfirmDialog';
import TrashIcon from '../../../../icons/TrashIcon';

export default {
  key: 'deleteAlias',
  useLabel: () => 'Delete alias',
  icon: TrashIcon,
  mode: 'delete',
  useOnClick: ({alias: aliasId}) => {
    const {resourceId: aliasContextResourceId, resourceType: aliasContextResourceType} = useGetTableContext();
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();

    const deleteResource = useCallback(() => {
      dispatch(actions.resource.aliases.delete(aliasContextResourceId, aliasContextResourceType, aliasId, ALIAS_FORM_KEY[aliasContextResourceType]));
    }, [dispatch, aliasContextResourceId, aliasContextResourceType, aliasId]);

    const handleDelete = useCallback(() => {
      confirmDialog({
        title: 'Delete alias?',
        message: message.ALIAS.DELETE_CONFIRM_MESSAGE,
        buttons: [
          {
            label: 'Delete alias',
            onClick: deleteResource,
            error: true,
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }, [confirmDialog, deleteResource]);

    return handleDelete;
  },
};
