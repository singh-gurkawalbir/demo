import metadata from './metadata';
import CeligoTable from '../CeligoTable';

export default function ResourceTable({
  resourceType,
  resources = [],
  actionProps,
  ...rest
}) {
  return (
    <CeligoTable
      data={resources}
      filterKey={resourceType}
      {...metadata(resourceType)}
      {...rest}
      actionProps={{ ...actionProps, resourceType }}
    />
  );
}
