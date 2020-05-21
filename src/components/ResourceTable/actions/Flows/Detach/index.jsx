import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../icons/CloseIcon';
import useConfirmDialog from '../../../../ConfirmDialog';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  component: function DetachFlow({ resource }) {
    const { name: resourceName, _id: resourceId } = resource;
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
    const handleDetachFlowClick = useCallback(() => {
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

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Detach flow',
        }}
        data-test="detachFlow"
        size="small"
        onClick={handleDetachFlowClick}>
        <Icon />
      </IconButtonWithTooltip>
    );
  },
};
