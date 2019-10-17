when we use StatusTag component we have to use the hook useTheme to give our brand colors as a prop.
```js
const Grid = require('@material-ui/core/Grid').default;

<Grid container  justify="flex-start" spacing={3} >
  <Grid item>
    <StatusTag variant="Success" backgroundcolor="#4CBB02"></StatusTag>
  </Grid>
   <Grid item>
    <StatusTag variant="Error" backgroundcolor="#FF3C3C"></StatusTag>
  </Grid>
  <Grid item>
    <StatusTag variant="warning" backgroundcolor="#FFB30C"></StatusTag>
  </Grid>
  <Grid item>
    <StatusTag variant="info" backgroundcolor="#00A1E1"></StatusTag>
  </Grid>
  <Grid item>
    <StatusTag variant="Realtime" backgroundcolor="#95ABBC"></StatusTag>
  </Grid>
  <Grid item>
    <StatusTag variant="Notistack Success bg" backgroundcolor="#43a047"></StatusTag>
  </Grid>
  <Grid item>
    <StatusTag variant="Custom Info bg" backgroundcolor="#0188be"></StatusTag>
  </Grid>
</Grid>

```