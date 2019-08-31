```js
const status = require('./Status').default;
const StatusCircle = require('./Status/StatusCircle').default;
const HeaderAction = require('./HeaderAction').default;
<Header>
  <Status label="success">
    <StatusCircle variant="success" />
  </Status>
  <HeaderAction variants={['item1', 'item2', 'item3']} />
</Header>
```