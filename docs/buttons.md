Round button
```js
const Button = require('@material-ui/core/Button').default;
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;
const IconButton =  require('../src/components/iconButton').default;
const DownIcon = require('../src/components/icons/DownIcon').default;
const StacksIcon = require('../src/components/icons/StacksIcon').default;


<SpacedContainer>
  <Button variant="contained" color="primary">Primary</Button>
  <Button size="small" variant="contained" color="primary">primary</Button>
  <Button variant="contained" color="primary" disabled>primary</Button>
  <IconButton variant="contained" color="primary">
   Primary <DownIcon />
  </IconButton>
  <IconButton variant="contained" color="primary"> 
   <StacksIcon />Primary
  </IconButton>
  <br />
  <Button variant="contained" color="secondary">Secondary</Button>
  <Button variant="contained" color="secondary" size="small">Secondary</Button>
  <IconButton variant="contained" color="secondary">Secondary <DownIcon /></IconButton>
  <Button variant="contained" color="secondary" disabled >Disabled</Button>
</SpacedContainer>
```

Rectangle Buttons
```js
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;
const Button = require('@material-ui/core/Button').default;
const IconButton =  require('../src/components/iconButton').default;
const DownIcon = require('../src/components/icons/DownIcon').default;

<SpacedContainer>
  <Button variant="outlined" color="primary">Primary</Button>
  <IconButton variant="outlined" color="primary">Primary <DownIcon /></IconButton>
  <Button variant="outlined" color="primary" size="small">Primary</Button>
  <Button variant="outlined" color="primary" disabled>Primary</Button>
  <br />
  <Button variant="outlined" color="secondary">Secondary</Button>
  <IconButton color="primary" variant="outlined" color="secondary">Secondary <DownIcon /></IconButton>
  <Button variant="outlined" color="secondary" size="small">Secondary</Button>
  <Button variant="outlined" color="primary" disabled>Disabled</Button>
</SpacedContainer>
```

Text Buttons
```js
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;
const Button = require('@material-ui/core/Button').default;
const IconButton =  require('../src/components/iconButton').default;
const DownIcon = require('../src/components/icons/DownIcon').default;

<SpacedContainer>
  <Button variant="text" color="primary">Link Button</Button>
  <Button variant="text" color="secondary">Link Button</Button>
  <Button variant="text" color="primary" disabled>Disabled</Button>
  <br />
  <Button variant="text" color="primary" size="small">save and go to settings</Button>
  <IconButton variant="text" color="secondary" size="small">save and go to settings <DownIcon /></IconButton>
  <IconButton variant="text" color="secondary" size="small" disabled>save and go to settings <DownIcon /></IconButton>
</SpacedContainer>
```

Button Groups
```js
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;
const Button = require('@material-ui/core/Button').default;
const ButtonsGroup = require('../src/components/ButtonGroup').default;

<SpacedContainer>
    <ButtonsGroup>
      <Button variant="contained" color="primary" >Save</Button>
      <Button variant="text" color="primary">Cancel</Button>
    </ButtonsGroup>
    <ButtonsGroup>
      <Button variant="text" color="primary">Cancel</Button>
      <Button variant="contained" color="primary" >Save</Button>
    </ButtonsGroup>
  <ButtonsGroup>
    <Button variant="text" color="primary">Cancel</Button>
    <span style={{color: '#677A89'}}> | </span>
    <Button variant="text" color="primary">Install</Button>
  </ButtonsGroup>
</SpacedContainer>
```