export default function suiteScriptResourceKey({
  ssLinkedConnectionId,
  integrationId,
  resourceType,
  resourceId,
}) {
  //   return `${ssLinkedConnectionId}-${
  //     integrationId ? `${integrationId}-` : ''
  //   }-${resourceType}-${resourceId}`;
  return `${ssLinkedConnectionId}-${resourceType}-${resourceId}`;
}
