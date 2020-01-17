```js
const Grid = require('@material-ui/core/Grid').default;

<Grid container  justify="flex-start" spacing={3}>
  <Grid item>
    <StatusTag variant="default" label="default" />
  </Grid>
  <Grid item>
    <StatusTag variant="success" label="completed" />
  </Grid>
  <Grid item>
    <StatusTag variant="warning" label="warning" />
  </Grid>
  <Grid item>
    <StatusTag variant="error" label="2 Errors" />
  </Grid>
  <Grid item>
    <StatusTag variant="info" label="Info" />
  </Grid>
  <Grid item>
    <StatusTag variant="realtime" label="Realtime" />
  </Grid>
  <Grid item>
    <StatusTag variant="error" label="info"  successValue={50} />
  </Grid>
  <Grid item>
    <StatusTag variant="error" label="info"  successValue={90} />
  </Grid>
  <Grid item>
    <StatusTag variant="info" label="success"  successValue={10} />
  </Grid>
</Grid>

```