import { Fragment, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Icon from '../../../../icons/PurgeIcon';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../ConfirmDialog';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR } from '../../../../../constants/resource';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  component: function Purge({ resource = {} }) {
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const purgeResource = useCallback(() => {
      dispatch(
        actions.recycleBin.purge(
          `${RESOURCE_TYPE_LABEL_TO_SINGULAR[resource.model]}s`,
          resource.doc && resource.doc._id
        )
      );
    }, [dispatch, resource.doc, resource.model]);
    const handlePurgeClick = useCallback(() => {
      confirmDialog({
        title: 'Confirm',
        message: `Are you sure you want to delete this ${
          RESOURCE_TYPE_LABEL_TO_SINGULAR[resource.model]
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
    }, [confirmDialog, purgeResource, resource.model]);

    return (
      <Fragment>
        <IconButtonWithTooltip
          tooltipProps={{
            title: 'Purge',
          }}
          size="small"
          onClick={handlePurgeClick}>
          <Icon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
