export default function suiteScriptResourceKey({
  ssLinkedConnectionId,
  integrationId,
  resourceType,
  resourceId,
  flowType,
}) {
  //   return `${ssLinkedConnectionId}-${
  //     integrationId ? `${integrationId}-` : ''
  //   }-${resourceType}-${resourceId}`;
  if (['flows', 'exports', 'imports'].includes(resourceType)) {
    return `${ssLinkedConnectionId}-${resourceType}-${flowType}-${resourceId}`;
  }

  return `${ssLinkedConnectionId}-${resourceType}-${resourceId}`;
}
