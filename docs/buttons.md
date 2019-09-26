Round button
```js
const Button = require('@material-ui/core/Button').default;
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;
const IconTextButton =  require('../src/components/IconTextButton').default;
const ArrowDownIcon = require('../src/components/icons/ArrowDownIcon').default;
const StacksIcon = require('../src/components/icons/StacksIcon').default;

<SpacedContainer>
  <Button size="small" variant="contained" color="primary">Small</Button>
  <Button variant="contained" color="primary">Default</Button>
  <Button size="large" variant="contained" color="primary">Large</Button>
  <br />
  <br />

  <IconTextButton variant="contained" color="primary">Icon Button<ArrowDownIcon /></IconTextButton>
  <IconTextButton variant="contained" color="primary"><StacksIcon />Primary</IconTextButton>

  <br />
  <br />
  <Button variant="contained" color="secondary">Secondary</Button>
  <IconTextButton variant="contained" color="secondary">Secondary <ArrowDownIcon /></IconTextButton>
  <Button variant="contained" color="secondary" disabled >Disabled</Button>
</SpacedContainer>
```

Rectangle Buttons
```js
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;
const Button = require('@material-ui/core/Button').default;
const IconTextButton =  require('../src/components/IconTextButton').default;
const ArrowDownIcon = require('../src/components/icons/ArrowDownIcon').default;

<SpacedContainer>
  <Button variant="outlined" color="primary">Primary</Button>
  <IconTextButton variant="outlined" color="primary">Primary <ArrowDownIcon /></IconTextButton>
    <Button variant="outlined" color="primary" disabled>Disabled</Button>
  <br />
  <br />
  <Button variant="outlined" color="secondary">Secondary</Button>
  <IconTextButton color="primary" variant="outlined" color="secondary">Secondary <ArrowDownIcon /></IconTextButton>
  <Button variant="outlined" color="primary" disabled>Disabled</Button>
</SpacedContainer>
```

Text Buttons
```js
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;
const Button = require('@material-ui/core/Button').default;
const IconTextButton =  require('../src/components/IconTextButton').default;
const ArrowDownIcon = require('../src/components/icons/ArrowDownIcon').default;

<SpacedContainer>
  <Button variant="text" color="primary">Link button</Button>
  <Button variant="text" color="secondary">Link button</Button>
  <Button variant="text" color="primary" disabled>Disabled</Button>
  <br />
  <Button variant="text" color="primary">Save & go to settings</Button>
  <IconTextButton variant="text" color="secondary">Save & go to settings <ArrowDownIcon /></IconTextButton>
  <IconTextButton variant="text" color="secondary" disabled>Link button disabled <ArrowDownIcon /></IconTextButton>
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
</SpacedContainer>
```
