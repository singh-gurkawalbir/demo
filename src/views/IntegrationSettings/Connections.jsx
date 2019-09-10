import ResourceList from '../../views/ResourceList';

function Connections(props) {
  return (
    <ResourceList
      resourceType="connections"
      integrationId={props.match.params.integrationId}
    />
  );
}

export default Connections;
