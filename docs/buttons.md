Round button
```js
const Button = require('@material-ui/core/Button').default;
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;

<SpacedContainer>
  <Button size="small" variant="contained" color="primary">Small</Button>
  <Button size="medium" variant="contained" color="primary">Medium</Button>
  <Button size="large" variant="contained" color="primary">Large</Button>
  <br />
  <Button variant="contained" color="primary">Primary</Button>
  <Button variant="contained" color="primary" disabled>P Disabled</Button>
  <Button variant="contained" color="secondary">Secondary</Button>
  <Button variant="contained" color="secondary" disabled >S Disabled</Button>
</SpacedContainer>
```

Rectangle Buttons
```js
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;
const Button = require('@material-ui/core/Button').default;

<SpacedContainer>
  <Button variant="outlined" color="primary">Primary</Button>
  <Button variant="outlined" color="secondary">Secondary</Button>
  <Button variant="outlined" color="primary" disabled>Disabled</Button>
  <Button variant="outlined" color="secondary" disabled>Secondary Disabled</Button>
</SpacedContainer>
```

Text Buttons
```js
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;
const Button = require('@material-ui/core/Button').default;

<SpacedContainer>
  <Button variant="text" color="primary">Primary Button</Button>
  <Button variant="text" color="secondary">Link Button</Button>
  <Button variant="text" color="primary" disabled>Disabled</Button>
</SpacedContainer>
```

Button Groups
```js
const SpacedContainer = require('../src/styleguide/SpacedContainer').default;
const Button = require('@material-ui/core/Button').default;
const ButtonsGroup = require('../src/components/ButtonGroup').default;

<SpacedContainer>
  <div>
    <ButtonsGroup>
      <Button variant="contained" color="primary" >Save</Button>
      <Button variant="text" color="primary">Cancel</Button>
    </ButtonsGroup>
  </div>
  <div>
    <ButtonsGroup>
      <Button variant="text" color="primary">Cancel</Button>
      <Button variant="contained" color="primary" >Save</Button>
    </ButtonsGroup>
  </div>
  <ButtonsGroup>
    <Button variant="text" color="primary">Cancel</Button>
    <span style={{color: '#677A89'}}> | </span>
    <Button variant="text" color="primary">Install</Button>
  </ButtonsGroup>
</SpacedContainer>
```