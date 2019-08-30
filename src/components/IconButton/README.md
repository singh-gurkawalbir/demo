```js
const SpacedContainer = require('../../styleguide/SpacedContainer').default;
const AddIcon = require('../icons/AddIcon').default;
const CloseIcon = require('../icons/CloseIcon').default;

<SpacedContainer>
  <IconButton variant="contained">
    <AddIcon /> Click Me
  </IconButton>

  <IconButton color="primary" variant="contained">
    <AddIcon /> Click Me Again <CloseIcon />
  </IconButton>

  <IconButton color="primary" variant="contained">
    Click Me <CloseIcon />
  </IconButton>

  <IconButton color="secondary" variant="outlined">
    <AddIcon /> Click Me <CloseIcon />
  </IconButton>
</SpacedContainer>
```
