```js
const AddIcon = require('../../src/components/icons/AddIcon').default;
const AdjustInventoryIcon = require('../../src/components/icons/AdjustInventoryIcon').default;
const ArrowLeftIcon = require('../../src/components/icons/ArrowLeftIcon').default;
const ArrowRightIcon = require('../../src/components/icons/ArrowRightIcon').default;
const ArrowDownIcon = require('../../src/components/icons/ArrowDownIcon').default;
const ArrowUpIcon = require('../../src/components/icons/ArrowUpIcon').default;
const AuditLogIcon = require('../../src/components/icons/AuditLogIcon').default;
const CalendarIcon = require('../../src/components/icons/CalendarIcon').default;
const CloseIcon = require('../../src/components/icons/CloseIcon').default;
const DebugIcon = require('../../src/components/icons/DebugIcon').default;
const DownloadIcon = require('../../src/components/icons/DownloadIcon').default;
const EditIcon = require('../../src/components/icons/EditIcon').default;
const ErrorIcon = require('../../src/components/icons/ErrorIcon').default;
const EllipsisHorizontalIcon = require('../../src/components/icons/EllipsisHorizontalIcon').default;
const EllipsisVerticalIcon = require('../../src/components/icons/EllipsisVerticalIcon').default;
const ExitIcon = require('../../src/components/icons/ExitIcon').default;
const FilterIcon = require('../../src/components/icons/FilterIcon').default;
const GettingStartedIcon = require('../../src/components/icons/GettingStartedIcon').default;
const HomeIcon = require('../../src/components/icons/HomeIcon').default;
const HookIcon = require('../../src/components/icons/HookIcon').default;
const MarketplaceIcon = require('../../src/components/icons/MarketplaceIcon').default;
const PermissionsManageIcon = require('../../src/components/icons/PermissionsManageIcon').default;
const SubtractIcon = require('../../src/components/icons/SubtractIcon').default;
const TransferOrderIcon = require('../../src/components/icons/TransferOrderIcon').default;

const sizes = [24, 48];
const containerStyle = () => {
  return {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: '15px',
  };
};
const svgFontSizes = (size) => {
  return{
    fontSize: size,
  };
};

<div>
  {sizes.map(size => (
    <div key={size} style={containerStyle()}>
      <AddIcon style={svgFontSizes(size)}/>
      <AdjustInventoryIcon style={svgFontSizes(size)}/> 
      <ArrowLeftIcon style={svgFontSizes(size)} />
      <ArrowRightIcon style={svgFontSizes(size)}/>
      <ArrowDownIcon style={svgFontSizes(size)} />
      <ArrowUpIcon style={svgFontSizes(size)}/>
      <AuditLogIcon style={svgFontSizes(size)} />
      <CalendarIcon style={svgFontSizes(size)} />
      <CloseIcon style={svgFontSizes(size)} />
      <DownloadIcon style={svgFontSizes(size)} />
      <DebugIcon style={svgFontSizes(size)} />
      <EditIcon style={svgFontSizes(size)} />
      <ErrorIcon style={svgFontSizes(size)} />
      <EllipsisHorizontalIcon style={svgFontSizes(size)} />
      <EllipsisVerticalIcon style={svgFontSizes(size)}/>
      <ExitIcon style={svgFontSizes(size)} />
      <FilterIcon style={svgFontSizes(size)} />
      <GettingStartedIcon style={svgFontSizes(size)} />
      <HookIcon style={svgFontSizes(size)} />
      <HomeIcon style={svgFontSizes(size)} />
      <MarketplaceIcon style={svgFontSizes(size)} />
      <PermissionsManageIcon style={svgFontSizes(size)} />
      <SubtractIcon style={svgFontSizes(size)} />
      <TransferOrderIcon style={svgFontSizes(size)} />
    </div>    
    ))
  }
</div>
```
