when we use StatusTag component we have to use the hook useTheme to give our brand colors as a prop.
```js
const Grid = require('@material-ui/core/Grid').default;
const Typography = require('@material-ui/core/Typography').default;

<Grid container  justify="flex-start" spacing={3} >
  <Grid item>
    <StatusTag>Default</StatusTag>
  </Grid>  <Grid item>
    <StatusTag variant="success">Success!</StatusTag>
  </Grid>
   <Grid item>
    <StatusTag variant="error">ERROR</StatusTag>
  </Grid>
  <Grid item>
    <StatusTag variant="warn">Waring :P</StatusTag>
  </Grid>
  <Grid item>
    <StatusTag variant="info">Info</StatusTag>
  </Grid>
  <Grid item>
    <StatusTag variant="realtime">
      <Typography variant="h3">
        realtime variant using H3 as child.
      </ Typography>
    </StatusTag>
  </Grid>
</Grid>

```