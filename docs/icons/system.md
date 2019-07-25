```js
const AddIcon = require('../../src/components/icons/AddIcon').default;
const ArrowLeftIcon = require('../../src/components/icons/ArrowLeftIcon').default;
const CloseIcon = require('../../src/components/icons/CloseIcon').default;
const DownIcon = require('../../src/components/icons/DownIcon').default;
const ExitIcon = require('../../src/components/icons/ExitIcon').default;
const GettingStartedIcon = require('../../src/components/icons/GettingStartedIcon').default;
const MenuBarsIcon = require('../../src/components/icons/MenuBarsIcon').default;
const ScheduleIcon = require('../../src/components/icons/ScheduleIcon').default;
const ScriptsIcon = require('../../src/components/icons/ScriptsIcon').default;
const SettingsIcon = require('../../src/components/icons/SettingsIcon').default;
const StacksIcon = require('../../src/components/icons/StacksIcon').default;
const ConnectionsIcon = require('../../src/components/icons/ConnectionsIcon').default;
const TransferOwnershipIcon = require('../../src/components/icons/TransferOwnershipIcon').default;
const UpIcon = require('../../src/components/icons/UpIcon').default;
const SearchIcon = require('../../src/components/icons/SearchIcon').default;

const sizes = [12, 16, 20, 24, 32, 64];
const containerStyle = (size) => {
  return {
    fontSize: size,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: '15px',
  };
};

<div>
  {sizes.map(size => (
    <div key={size} style={containerStyle(size)}>
      <SearchIcon />
      <AddIcon />
      <ArrowLeftIcon />
      <CloseIcon />
      <DownIcon />
      <ExitIcon />
      <GettingStartedIcon />
      <MenuBarsIcon />
      <ScheduleIcon />
      <ScriptsIcon />
      <SettingsIcon />
      <StacksIcon />
      <ConnectionsIcon />
      <TransferOwnershipIcon />
      <UpIcon />
    </div>    
    ))
  }
</div>
```