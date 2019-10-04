import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { confirmDialog } from '../../../../ConfirmDialog';
import Icon from '../../../../icons/TrashIcon';
import actions from '../../../../../actions';

export default {
  label: 'Delete',
  component: function Delete({ resource }) {
    const dispatch = useDispatch();
    const handleClick = () => {
      confirmDialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete this license',
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
            onClick: () => {
              dispatch(
                actions.resource.delete(
                  `connectors/${resource._connectorId}/licenses`,
                  resource._id
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
