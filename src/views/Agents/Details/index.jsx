import { Typography } from '@material-ui/core';
import LoadResources from '../../../components/LoadResources';
import ResourceForm from '../../../components/ResourceFormFactory';

export default function Add(props) {
  const { match } = props;
  const { id } = match.params;

  return (
    <div>
      <Typography variant="h5">New Agents</Typography>

      <LoadResources required resources="agents">
        <ResourceForm resourceType="agents" resourceId={id} />
      </LoadResources>
    </div>
  );
}
