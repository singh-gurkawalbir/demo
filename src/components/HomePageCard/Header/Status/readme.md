```js
const Grid = require('@material-ui/core/Grid').default;
const StatusCircle = require('./StatusCircle').default;
<Grid container  justify="flex-start" spacing={3} >
  <Grid item>
    <Status label="success">
      <StatusCircle variant="success" />
    </Status>
  </Grid>
  <Grid item>
    <Status  count= "5324" label="ERRORS">
      <StatusCircle variant="error" />
    </Status>
  </Grid>
  <Grid item>
    <Status label="Info">
      <StatusCircle variant="info" />
    </Status>
  </Grid>
  <Grid item>
    <Status label="Continue setup">
      <StatusCircle variant="warning" />
    </Status>
  </Grid>
</Grid>
```