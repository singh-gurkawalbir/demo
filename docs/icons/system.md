```js
const AddIcon = require('../../src/components/icons/AddIcon').default;
const AdjustInventoryIcon = require('../../src/components/icons/AdjustInventoryIcon').default;
const ArrowLeftIcon = require('../../src/components/icons/ArrowLeftIcon').default;
const ArrowRightIcon = require('../../src/components/icons/ArrowRightIcon').default;
const ArrowDownIcon = require('../../src/components/icons/ArrowDownIcon').default;
const ArrowUpIcon = require('../../src/components/icons/ArrowUpIcon').default;
const AuditLogIcon = require('../../src/components/icons/AuditLogIcon').default;
const CloseIcon = require('../../src/components/icons/CloseIcon').default;
const ErrorIcon = require('../../src/components/icons/ErrorIcon').default;
const EllipsisHorizontalIcon = require('../../src/components/icons/EllipsisHorizontalIcon').default;
const EllipsisVerticalIcon = require('../../src/components/icons/EllipsisVerticalIcon').default;
const ExitIcon = require('../../src/components/icons/ExitIcon').default;
const GettingStartedIcon = require('../../src/components/icons/GettingStartedIcon').default;
const HookIcon = require('../../src/components/icons/HookIcon').default;
const PermissionsManageIcon = require('../../src/components/icons/PermissionsManageIcon').default;
const SubtractIcon = require('../../src/components/icons/SubtractIcon').default;
const TransferOrderIcon = require('../../src/components/icons/TransferOrderIcon').default;

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
      <AddIcon />
      <AdjustInventoryIcon />
      <ArrowLeftIcon />
      <ArrowRightIcon />
      <ArrowDownIcon />
      <ArrowUpIcon />
      <AuditLogIcon />
      <CloseIcon />
      <ErrorIcon />
      <EllipsisHorizontalIcon />
      <EllipsisVerticalIcon />
      <ExitIcon />
      <GettingStartedIcon />
      <HookIcon />
      <PermissionsManageIcon />
      <SubtractIcon />
      <TransferOrderIcon />
    </div>    
    ))
  }
</div>
```