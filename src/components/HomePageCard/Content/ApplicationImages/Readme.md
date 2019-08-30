```js
const Grid = require('@material-ui/core/Grid').default;
const ApplicationImg = require('../../../icons/ApplicationImg').default;
const AddIcon = require('../../../icons/AddIcon').default;

<Grid container  justify-content="center" spacing={4}>
    <Grid item>
        <ApplicationImages>
            <ApplicationImg type="magento" />
            <span><AddIcon /></span>
            <ApplicationImg type="netsuite" />
        </ApplicationImages>
    </Grid>
    <Grid item>
        <ApplicationImages>
            <ApplicationImg type="ftp" />
            <span><AddIcon /></span>
            <ApplicationImg type="netsuite" />
        </ApplicationImages>
    </Grid>
    <Grid item>
        <ApplicationImages>
            <ApplicationImg type="http" />
            <span><AddIcon /></span>
            <ApplicationImg type="magento" />
        </ApplicationImages>
    </Grid>
    <Grid item>
        <ApplicationImages>
            <ApplicationImg type="postgresql" />
            <span><AddIcon /></span>
            <ApplicationImg type="mssql" />
        </ApplicationImages>
    </Grid>
     <Grid item>
        <ApplicationImages>
            <ApplicationImg type="salesforce" />
            <span><AddIcon /></span>
            <ApplicationImg type="netsuite" />
        </ApplicationImages>
    </Grid>
</Grid>
```
