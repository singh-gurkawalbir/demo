```js
const Grid = require('@material-ui/core/Grid').default;

<Grid container  justify="flex-start" spacing={3} >
  <Grid item>
    <Status label="success">
    </Status>
  </Grid>
  <Grid item>
    <Status  count= "5324" label="ERRORS">
    </Status>
  </Grid>
  <Grid item>
    <Status label="Info">
    </Status>
  </Grid>
  <Grid item>
    <Status label="Continue setup">
    </Status>
  </Grid>
</Grid>
```