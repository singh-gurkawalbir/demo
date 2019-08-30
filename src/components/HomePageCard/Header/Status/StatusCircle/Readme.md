```js
const Grid = require('@material-ui/core/Grid').default;
<Grid container  justify="flex-start" spacing={3} >
  <Grid item>
    <StatusCircle />
  </Grid>
  <Grid item>
    <StatusCircle variant="error" />
  </Grid>
  <Grid item>
    <StatusCircle variant="info" />
  </Grid>
  <Grid item>
    <StatusCircle variant="warning" />
  </Grid>
  <Grid item>
    <StatusCircle variant="success" />
  </Grid>
</Grid>
```