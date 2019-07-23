
Round button
```js
const Button = require('@material-ui/core/Button').default;
const mr10 = {
  marginRight: '10px',
};

<div>
     <Button variant="contained" color="primary" style={mr10}>Primary</Button>
     <Button variant="contained"  color="primary" disabled style={mr10}>P Disabled</Button>
     <Button variant="contained" color="secondary" style={mr10}>Secondary</Button>
      <Button variant="contained"  color="secondary" disabled  style={mr10}>S Disabled</Button>
</div>
```
Rectangle Buttons
```js
const Button = require('@material-ui/core/Button').default;
const mr10 = {
  marginRight: '10px',
};
<div>

    <Button variant="outlined" color="primary" style={mr10}>Primary</Button>
    <Button variant="outlined"  color="secondary" style={mr10}>Secondary</Button>
     <Button variant="outlined"  color="primary" style={mr10}disabled>Disabled</Button>
      <Button variant="outlined"  color="secondary" disabled  style={mr10}>Secondary Disabled</Button>
    
  
</div>
```

Text Buttons
```js
const Button = require('@material-ui/core/Button').default;
const mr10 = {
  marginRight: '10px',
};
<div>
      <Button variant="text" color="primary">Primary Button</Button>
      <Button variant="text" color="secondary">Link Button</Button>
      <Button variant="text"  color="primary" style={mr10} disabled>Disabled</Button>
</div>
```

Button Groups
```js
const Button = require('@material-ui/core/Button').default;
const buttonGroup = {
  float: 'left',
};
const ButtonsGroup = require('../src/components/ButtonGroup').default;
const tempStyle = {
  marginBottom: '20px',
};
<div>
    <div style={tempStyle}>
       <ButtonsGroup>
        <Button variant="contained" color="primary" >Save</Button>
        <Button variant="text" color="primary">Cancel</Button>
      </ButtonsGroup>
    </div>
   <div style={tempStyle}>
    <ButtonsGroup style={tempStyle}>
       
        <Button variant="text" color="primary">Cancel</Button>
         <Button variant="contained" color="primary" >Save</Button>
    </ButtonsGroup>
     </div>
   
    <ButtonsGroup>
        <Button variant="text" color="primary">Cancel</Button>
        <span style={{color: '#677A89'}}> | </span>
          <Button variant="text" color="primary">Install</Button>
    </ButtonsGroup>
</div>
```
