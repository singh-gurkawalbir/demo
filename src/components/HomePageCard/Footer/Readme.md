```js
const Info = require('./Info').default;
const Tag = require('./Tag').default;
const FooterActions = require('./FooterActions').default;
const Manage = require('./Manage').default;
const PermissionsManageIcon = require('../../icons/PermissionsManageIcon').default;
<Footer>
    <FooterActions>
        <Manage><PermissionsManageIcon /></Manage>
        <Tag  variant="production"/>
    </FooterActions> 
    <Info variant="Integration app" label="celigo" />
</Footer>
```