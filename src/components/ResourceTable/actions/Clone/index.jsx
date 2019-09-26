import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import Icon from '../../../icons/CopyIcon';
import getRoutePath from '../../../../utils/routePaths';

export default {
  label: 'Clone',
  component: function Clone({ resourceType }) {
    return (
      <Link to={getRoutePath(`/${resourceType}/clone`)}>
        <IconButton size="small">
          <Icon />
        </IconButton>
      </Link>
    );
  },
};
