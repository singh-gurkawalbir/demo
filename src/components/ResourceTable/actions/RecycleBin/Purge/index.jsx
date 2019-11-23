import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../icons/PurgeIcon';
import actions from '../../../../../actions';
import { confirmDialog } from '../../../../ConfirmDialog';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR } from '../../../../../constants/resource';

export default {
  label: 'Purge',
  component: function Purge({ resource }) {
    const dispatch = useDispatch();
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
        <IconButton size="small" onClick={handleClick}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
