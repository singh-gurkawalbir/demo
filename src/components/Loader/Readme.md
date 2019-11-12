```js
const Grid = require('@material-ui/core/Grid').default;
const Typography = require('@material-ui/core/Typography').default;
const CircularProgress = require('@material-ui/core/CircularProgress').default;
const Button = require('@material-ui/core/Button').default;

<Grid container  justify="flex-start" spacing={3}>
  <Grid item>
    <Loader open>
      <Typography variant="h4">Loading child jobs </Typography>
      <CircularProgress variant="indeterminate" disableShrink/>
      <Button variant="outlined" color="primary">Close</Button>
   </Loader>
  </Grid>

</Grid>

```