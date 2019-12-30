import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../icons/RestoreIcon';
import actions from '../../../../../actions';
import getRoutePath from '../../../../../utils/routePaths';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR } from '../../../../../constants/resource';

export default {
  label: 'Restore',
  component: function Restore({ resource }) {
    const dispatch = useDispatch();
    const handleClick = () => {
      dispatch(
        actions.recycleBin.restore(
          `${RESOURCE_TYPE_LABEL_TO_SINGULAR[resource.model]}s`,
          resource.doc && resource.doc._id
        )
      );
    };

    return (
      <Fragment>
        <IconButton
          size="small"
          onClick={handleClick}
          component={Link}
          to={getRoutePath(
            `/${RESOURCE_TYPE_LABEL_TO_SINGULAR[resource.model]}s`
          )}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
