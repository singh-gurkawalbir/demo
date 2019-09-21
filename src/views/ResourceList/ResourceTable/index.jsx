import metadata from './metadata';
import CeligoTable from '../../../components/CeligoTable';

export default function ResourceTable({
  resourceType,
  resources = [],
  ...rest
}) {
  return (
    <CeligoTable
      data={resources}
      filterKey={resourceType}
      {...metadata(resourceType)}
      {...rest}
    />
  );
}
