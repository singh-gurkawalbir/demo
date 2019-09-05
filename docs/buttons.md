Round button
```js
const Button = require('@material-ui/core/Button').default;
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;
const IconButton =  require('../src/components/IconButton').default;
const ArrowDownIcon = require('../src/components/icons/ArrowDownIcon').default;
const StacksIcon = require('../src/components/icons/StacksIcon').default;

<SpacedContainer>
  <Button size="small" variant="contained" color="primary">Small</Button>
  <Button variant="contained" color="primary">Default</Button>
  <Button size="large" variant="contained" color="primary">Large</Button>
  <br />
  <br />
  <IconButton variant="contained" color="primary">Primary<ArrowDownIcon /></IconButton>
  <IconButton variant="contained" color="primary"><StacksIcon />Primary</IconButton>
  <br />
  <br />
  <Button variant="contained" color="secondary">Secondary</Button>
  <IconButton variant="contained" color="secondary">Secondary <ArrowDownIcon /></IconButton>
  <Button variant="contained" color="secondary" disabled >Disabled</Button>
</SpacedContainer>
```

Rectangle Buttons
```js
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;
const Button = require('@material-ui/core/Button').default;
const IconButton =  require('../src/components/IconButton').default;
const ArrowDownIcon = require('../src/components/icons/ArrowDownIcon').default;

<SpacedContainer>
  <Button variant="outlined" color="primary">Primary</Button>
  <IconButton variant="outlined" color="primary">Primary <ArrowDownIcon /></IconButton>
    <Button variant="outlined" color="primary" disabled>Disabled</Button>
  <br />
  <br />
  <Button variant="outlined" color="secondary">Secondary</Button>
  <IconButton color="primary" variant="outlined" color="secondary">Secondary <ArrowDownIcon /></IconButton>
  <Button variant="outlined" color="primary" disabled>Disabled</Button>
</SpacedContainer>
```

Text Buttons
```js
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;
const Button = require('@material-ui/core/Button').default;
const IconButton =  require('../src/components/IconButton').default;
const ArrowDownIcon = require('../src/components/icons/ArrowDownIcon').default;

<SpacedContainer>
  <Button variant="text" color="primary">Link button</Button>
  <Button variant="text" color="secondary">Link button</Button>
  <Button variant="text" color="primary" disabled>Disabled</Button>
  <br />
  <Button variant="text" color="primary">Save & go to settings</Button>
  <IconButton variant="text" color="secondary">Save & go to settings <ArrowDownIcon /></IconButton>
  <IconButton variant="text" color="secondary" disabled>Link button disabled <ArrowDownIcon /></IconButton>
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
    <Button variant="text" color="primary">Install</Button>
  </ButtonsGroup>
</SpacedContainer>
```
