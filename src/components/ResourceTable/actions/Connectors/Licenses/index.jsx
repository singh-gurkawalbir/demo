import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../icons/EditIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  label: 'Licenses',
  component: function Licenses({ resource }) {
    return (
      <Link to={getRoutePath(`/connectors/${resource._id}/connectorLicenses`)}>
        <IconButton size="small">
          <Icon />
        </IconButton>
      </Link>
    );
  },
};
