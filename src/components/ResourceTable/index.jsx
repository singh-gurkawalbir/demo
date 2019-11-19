import metadata from './metadata';
import CeligoTable from '../CeligoTable';

// TODO: confirm that this const ref to an empty []
// prevents re-renders when the 'resources' prop is undefined.
// If it does, search the codebase for places we make
// this same mistake. Its a common pattern in oir current codebase
// to default a prop to a new instance of [] or {}.
const noResources = [];

export default function ResourceTable({
  resourceType,
  resources = noResources,
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
