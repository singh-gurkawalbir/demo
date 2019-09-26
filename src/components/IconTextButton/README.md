```js
const SpacedContainer = require('../../styleguide/SpacedContainer').default;
const AddIcon = require('../icons/AddIcon').default;
const CloseIcon = require('../icons/CloseIcon').default;

<SpacedContainer>
  <IconTextButton variant="contained">
    <AddIcon /> Click Me
  </IconTextButton>

  <IconTextButton color="primary" variant="contained">
    <AddIcon /> Click Me Again <CloseIcon />
  </IconTextButton>

  <IconTextButton color="primary" variant="contained">
    Click Me <CloseIcon />
  </IconTextButton>

  <IconTextButton color="secondary" variant="outlined">
    <AddIcon /> Click Me <CloseIcon />
  </IconTextButton>
</SpacedContainer>
```
