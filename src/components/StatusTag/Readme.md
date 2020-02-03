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
    <StatusTag variant="error" label="Completed"  successValue={50} resolvedValue={20} />
  </Grid>
  <Grid item>
    <StatusTag variant="error" label="error"  successValue={30}  />
  </Grid>
  <Grid item>
    <StatusTag variant="warning" label="success"  successValue={40} />
  </Grid>
</Grid>

```