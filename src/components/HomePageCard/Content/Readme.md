```js
const Typography = require('@material-ui/core/Typography').default;
const CardTitle = require('./CardTitle').default;
const ApplicationImages = require('./ApplicationImages').default;
const ApplicationImg = require('../../icons/ApplicationImg').default;
const AddIcon = require('../../icons/AddIcon').default;

<Content>
    <CardTitle>
        <Typography  variant="h3">
            Magento & NetSuite 2018 Sales Report
        </Typography>
    </CardTitle>
     <ApplicationImages>
            <ApplicationImg type="magento" />
            <span><AddIcon /></span>
            <ApplicationImg type="netsuite" />
        </ApplicationImages>
</Content>

```