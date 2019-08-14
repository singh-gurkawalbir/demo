System  Toasters
```js
const SpacedContainer = require('../../styleguide/SpacedContainer').default;
const Typography = require('@material-ui/core/Typography').default;
const wrapper = {
display: 'flex',
justifyContent: 'flex-start',
flexFlow: 'column',
};
<div style={wrapper}>
  <SpacedContainer>
    <NotificationToaster variant="error" size="small">
      <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake. </Typography>
    </NotificationToaster>
  </SpacedContainer>
  <SpacedContainer>
    <NotificationToaster variant="success">
    <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake. I love Pineapplecake. I love sweets.</Typography>
    </NotificationToaster>
  </SpacedContainer>
  <SpacedContainer>
    <NotificationToaster variant="warning">
      <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake. I love Pineapplecake. I love sweets.</Typography>
    </NotificationToaster>
  </SpacedContainer>
  <SpacedContainer>
    <NotificationToaster variant="info">
      <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake. I love Pineapplecake. I love sweets.</Typography>
    </NotificationToaster>
  </SpacedContainer>
</div>
```
Notification Banners
```js
const SpacedContainer = require('../../styleguide/SpacedContainer').default;
const Typography = require('@material-ui/core/Typography').default;
const wrapper = {
display: 'flex',
justifyContent: 'flex-start',
flexFlow: 'column',
};
<div style={wrapper}>
  <SpacedContainer>
    <NotificationToaster variant="error" size="large">
      <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake. </Typography>
    </NotificationToaster>
  </SpacedContainer>
  <SpacedContainer>
    <NotificationToaster variant="success" size="large">
      <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake. </Typography>
    </NotificationToaster>
  </SpacedContainer>
  <SpacedContainer>
    <NotificationToaster variant="warning" size="large">
     <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake. </Typography>
    </NotificationToaster>
  </SpacedContainer>
  <SpacedContainer>
    <NotificationToaster variant="info" size="large">
   <Typography>I love candy. I love cookies. I love cupcakes. I love cheesecake. </Typography>
    </NotificationToaster>
  </SpacedContainer>
</div>
```