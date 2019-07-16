Here we will show the avatars
```js
    const Avatar = require('@material-ui/core/Avatar').default;
    const Grid = require('@material-ui/core/Grid').default;
    
    
    <Grid container justify="center" alignItems="center">
        <Avatar alt="Remy Sharp" src="./src/static/images/profile.jpg" alt="UserName" />
   </Grid>
    
```

Application Icon Imported
```js
    const Grid = require('@material-ui/core/Grid').default;
    const applicationIcon = '../src/components/ApplicationIcons';
    <Grid container justify="center" alignItems="center">
         <div style= {{ marginBottom: '15px', marginRight: '15px' }}>
         <ApplicationIcon name="3dcard"/>
         </div>
   </Grid>
     
```