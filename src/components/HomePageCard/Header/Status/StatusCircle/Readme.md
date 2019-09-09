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
  <Grid item>
    <StatusCircle variant="success" size="small"/>
  </Grid>
   <Grid item>
    <StatusCircle variant="warning" size="small" />
  </Grid>
   <Grid item>
    <StatusCircle variant="info" size="small" />
  </Grid>
  <Grid item>
    <StatusCircle variant="error" size="small"/>
  </Grid>
</Grid>

```