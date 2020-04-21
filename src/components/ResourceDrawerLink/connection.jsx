import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import ResourceDrawerLink from '.';

// Wrapper of ResourceDrawerLink for connection with permission check
// integrationId is passed in case it is used inside Integration
export default function ConnectionResourceDrawerLink({
  resource,
  integrationId,
}) {
  const isEditable = useSelector(
    state =>
      selectors.resourcePermissions(
        state,
        'integrations',
        integrationId,
        'connections'
      ).edit
  );

  return (
    <ResourceDrawerLink
      resourceType="connections"
      resource={resource}
      disabled={!isEditable}
    />
  );
}
