import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../icons/HookIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  label: 'InstallBase',
  component: function InstallBase({ resource }) {
    return (
      <Link to={getRoutePath(`/connectors/${resource._id}/installBase`)}>
        <IconButton size="small">
          <Icon />
        </IconButton>
      </Link>
    );
  },
};
