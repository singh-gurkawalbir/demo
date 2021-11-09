import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TrashIcon from '../../../../../icons/TrashIcon';
import { selectors } from '../../../../../../reducers';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';
import useEnqueueSnackbar from '../../../../../../hooks/enqueueSnackbar';
import actions from '../../../../../../actions';
import useConfirmDialog from '../../../../../ConfirmDialog';
import { STANDALONE_INTEGRATION } from '../../../../../../utils/constants';
import { INTEGRATION_DELETE_VALIDATE } from '../../../../../../utils/messageStore';

export default {
  key: 'deleteIntegration',
  useLabel: () => 'Delete integration',
  icon: TrashIcon,
  useHasAccess: rowData => {
    const {_integrationId} = rowData;
    const canDelete = useSelector(state => selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId
    )?.delete);

    return canDelete;
  },
  useOnClick: rowData => {
    const {_integrationId} = rowData;
    const [enqueueSnackbar] = useEnqueueSnackbar();
    const { confirmDialog } = useConfirmDialog();
    const dispatch = useDispatch();

    const flowsFilterConfig = useMemo(
      () => ({
        type: 'flows',
        filter: {
          _integrationId:
          _integrationId === STANDALONE_INTEGRATION.id
            ? undefined
            : _integrationId,
        },
      }),
      [_integrationId]
    );
    const flows = useSelectorMemo(
      selectors.makeResourceListSelector,
      flowsFilterConfig
    ).resources;
    const cantDelete = flows.length > 0;

    const handleDelete = useCallback(() => {
      if (cantDelete) {
        enqueueSnackbar({
          message: INTEGRATION_DELETE_VALIDATE,
          variant: 'info',
        });

        return;
      }
      confirmDialog({
        title: 'Confirm delete',
        message: 'Are you sure you want to delete this integration?',
        buttons: [
          {
            label: 'Delete',
            onClick: () => {
              dispatch(actions.resource.integrations.delete(_integrationId));
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }, [
      cantDelete,
      confirmDialog,
      dispatch,
      enqueueSnackbar,
      _integrationId,
    ]);

    return handleDelete;
  },
};
