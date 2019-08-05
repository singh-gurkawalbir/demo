```js
const SpacedContainer = require('../../styleguide/SpacedContainer').default;
const AddIcon = require('../icons/AddIcon').default;
const ScheduleIcon = require('../icons/ScheduleIcon').default;
const CloseIcon = require('../icons/CloseIcon').default;
const MenuBarsIcon = require('../icons/MenuBarsIcon').default;

<SpacedContainer>
  <IconButton variant="contained">
    <AddIcon /> Click Me
  </IconButton>

  <IconButton color="primary" variant="contained">
    <CloseIcon /> Click Me Again <MenuBarsIcon />
  </IconButton>

  <IconButton color="primary" variant="contained">
    Click Me <ScheduleIcon />
  </IconButton>

  <IconButton color="secondary" variant="outlined">
    <CloseIcon /> Click Me <MenuBarsIcon />
  </IconButton>
</SpacedContainer>
```
