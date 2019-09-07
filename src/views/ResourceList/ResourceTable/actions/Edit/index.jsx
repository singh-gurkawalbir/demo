import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import EditIcon from 'mdi-react/EditIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default function Edit({ resourceType, resource }) {
  return (
    <Link
      to={getRoutePath(
        `/${resourceType}/edit/${resourceType}/${resource._id}`
      )}>
      <IconButton size="small">
        <EditIcon />
      </IconButton>
    </Link>
  );
}
