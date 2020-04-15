export default function suiteScriptResourceKey({
  ssLinkedConnectionId,
  resourceType,
  resourceId,
}) {
  return `${ssLinkedConnectionId}-${resourceType}-${resourceId}`;
}
