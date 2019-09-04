import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import EditIcon from 'mdi-react/EditIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default function Clone({ resourceType }) {
  return (
    <Link to={getRoutePath(`/${resourceType}/clone`)}>
      <IconButton size="small">
        <EditIcon />
      </IconButton>
    </Link>
  );
}
