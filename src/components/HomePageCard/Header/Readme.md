```js
const HeaderAction = require('./HeaderAction').default;
const Status = require('../../Status').default;
const StatusCircle = require('../../StatusCircle').default;
<Header>
 <Status label=" 5234 Errors">
        <StatusCircle variant="error"></StatusCircle>
      </Status>
  <HeaderAction variants={['item1', 'item2', 'item3']} />
</Header>
```