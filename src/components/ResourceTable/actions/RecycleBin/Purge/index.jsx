import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../icons/TrashIcon';
import actions from '../../../../../actions';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR } from '../../../../../constants/resource';

export default {
  label: 'Purge',
  component: function Purge({ resource }) {
    const dispatch = useDispatch();
    const handlePurgeClick = () => {
      dispatch(
        actions.recycleBin.purge(
          `${RESOURCE_TYPE_LABEL_TO_SINGULAR[resource.model]}s`,
          resource.doc && resource.doc._id
        )
      );
    };

    return (
      <Fragment>
        <IconButton size="small" onClick={handlePurgeClick}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
