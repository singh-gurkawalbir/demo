This component is used to render an img tag for any 
resource type.

Examples:
```js
const SpacedContainer = require('../../../../src/styleguide/SpacedContainer').default;
// I added few of the Resource type which are pointing to same END POINT in the existing application, so I included them
// Some of the Resource types are being duplicated in the "system Icon Component" so do we remove from there ?
<SpacedContainer>
  <ResourceImg resourceType="connections" />
  <ResourceImg resourceType="exports" />
  <ResourceImg resourceType="imports" />
  <ResourceImg resourceType="scripts" />
  <ResourceImg resourceType="stacks" />
  <ResourceImg resourceType="token" />
  <ResourceImg resourceType="agents" />
  <ResourceImg resourceType="flowbuilder" />
  <ResourceImg resourceType="recycle-bin" />
  <ResourceImg resourceType="upload" />
  <ResourceImg resourceType="getting-started" />
  <ResourceImg resourceType="whats-new" />
  <ResourceImg resourceType="knowledge-base" />
  <ResourceImg resourceType="submit-a-ticket" />
</SpacedContainer>
```
