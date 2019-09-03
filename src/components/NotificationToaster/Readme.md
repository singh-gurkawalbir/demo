System  Toasters
```js
const Grid = require('@material-ui/core/Grid').default;
const Typography = require('@material-ui/core/Typography').default;
<Grid container justify-content="center" spacing={2}>
  <Grid item>
    <NotificationToaster variant="error" size="small">
      <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake.</Typography>
    </NotificationToaster>
  </Grid>
  <Grid item>
    <NotificationToaster variant="success">
      <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake. I love Pineapplecake. I love sweets.</Typography>
    </NotificationToaster>
  </Grid>
  <Grid item>
    <NotificationToaster variant="warning">
      <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake. I love Pineapplecake. I love sweets.</Typography>
    </NotificationToaster>
  </Grid>
  <Grid item>
    <NotificationToaster variant="info">
      <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake. I love Pineapplecake. I love sweets.</Typography>
    </NotificationToaster>
  </Grid>
</Grid>
```
Notification Banners
```js
const Grid = require('@material-ui/core/Grid').default;
const Typography = require('@material-ui/core/Typography').default;
<Grid container justify-content="center" spacing={2}>
  <Grid item xs={12}>
    <NotificationToaster variant="error" size="large">
      <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake.</Typography>
    </NotificationToaster>
  </Grid>
  <Grid item xs={12}>
    <NotificationToaster variant="success" size="large">
      <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake.</Typography>
    </NotificationToaster>
  </Grid>
  <Grid item xs={12}>
    <NotificationToaster variant="warning" size="large">
      <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake.</Typography>
    </NotificationToaster>
  </Grid>
  <Grid item xs={12}>
    <NotificationToaster variant="info" size="large">
      <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake.</Typography>
    </NotificationToaster>
  </Grid>
</Grid>
```