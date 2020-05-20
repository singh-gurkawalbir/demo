import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import Icon from '../../../../icons/PurgeIcon';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../ConfirmDialog';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR } from '../../../../../constants/resource';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  label: 'Purge',
  component: function Purge({ tooltipLabel, resource }) {
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const handleClick = () => {
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
            onClick: () => {
              dispatch(
                actions.recycleBin.purge(
                  `${RESOURCE_TYPE_LABEL_TO_SINGULAR[resource.model]}s`,
                  resource.doc && resource.doc._id
                )
              );
            },
          },
        ],
      });
    };

    return (
      <Fragment>
        <IconButtonWithTooltip
          tooltipProps={{
            label: tooltipLabel,
          }}
          size="small"
          onClick={handleClick}>
          <Icon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
