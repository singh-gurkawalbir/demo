```js
const AddIcon = require('../icons/AddIcon').default;
const ScheduleIcon = require('../icons/ScheduleIcon').default;
const CloseIcon = require('../icons/CloseIcon').default;
const MenuBarsIcon = require('../icons/MenuBarsIcon').default;

const container = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  };

<div style={container}>
  <IconButton variant="contained">
    <AddIcon /> Click Me
  </IconButton>

  <IconButton color="primary" variant="contained">
    <CloseIcon /> Click Me Softly <MenuBarsIcon />
  </IconButton>

  <IconButton color="primary" variant="contained">
    Click Me <ScheduleIcon />
  </IconButton>

  <IconButton color="secondary" variant="outlined">
    <CloseIcon /> Click Me <MenuBarsIcon />
  </IconButton>
  </div>
```
