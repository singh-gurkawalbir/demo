```js
const AddIcon = require('../../src/components/icons/AddIcon').default;
const AdjustInventoryIcon = require('../../src/components/icons/AdjustInventoryIcon').default;
const AppBuilderIcon = require('../../src/components/icons/AppBuilderIcon').default;
const ArrowLeftIcon = require('../../src/components/icons/ArrowLeftIcon').default;
const ArrowRightIcon = require('../../src/components/icons/ArrowRightIcon').default;
const ArrowDownIcon = require('../../src/components/icons/ArrowDownIcon').default;
const ArrowUpIcon = require('../../src/components/icons/ArrowUpIcon').default;
const AuditLogIcon = require('../../src/components/icons/AuditLogIcon').default;
const CalendarIcon = require('../../src/components/icons/CalendarIcon').default;
const CloseIcon = require('../../src/components/icons/CloseIcon').default;
const CopyIcon = require('../../src/components/icons/CopyIcon').default;
const DebugIcon = require('../../src/components/icons/DebugIcon').default;
const DataLoaderIcon = require('../../src/components/icons/DataLoaderIcon').default;
const DownloadIcon = require('../../src/components/icons/DownloadIcon').default;
const EditIcon = require('../../src/components/icons/EditIcon').default;
const EditorsPlaygroundIcon = require('../../src/components/icons/EditorsPlaygroundIcon').default;
const ErrorIcon = require('../../src/components/icons/ErrorIcon').default;
const EllipsisHorizontalIcon = require('../../src/components/icons/EllipsisHorizontalIcon').default;
const EllipsisVerticalIcon = require('../../src/components/icons/EllipsisVerticalIcon').default;
const ExitIcon = require('../../src/components/icons/ExitIcon').default;
const ExportsIcon = require('../../src/components/icons/ExportsIcon').default;
const FilterIcon = require('../../src/components/icons/FilterIcon').default;
const FlowBuilderIcon = require('../../src/components/icons/FlowBuilderIcon').default;
const GettingStartedIcon = require('../../src/components/icons/GettingStartedIcon').default;
const MenuBarsIcon = require('../../src/components/icons/MenuBarsIcon').default;
const ScheduleIcon = require('../../src/components/icons/ScheduleIcon').default;
const ScriptsIcon = require('../../src/components/icons/ScriptsIcon').default;
const StacksIcon = require('../../src/components/icons/StacksIcon').default;
const ConnectionsIcon = require('../../src/components/icons/ConnectionsIcon').default;
const TransferOwnershipIcon = require('../../src/components/icons/TransferOwnershipIcon').default;
const HomeIcon = require('../../src/components/icons/HomeIcon').default;
const HookIcon = require('../../src/components/icons/HookIcon').default;
const MarketplaceIcon = require('../../src/components/icons/MarketplaceIcon').default;
const NotificationsIcon = require('../../src/components/icons/NotificationsIcon').default;
const PermissionsManageIcon = require('../../src/components/icons/PermissionsManageIcon').default;
const PermissionExplorerIcon = require('../../src/components/icons/PermissionExplorerIcon').default;
const ResourcesIcon = require('../../src/components/icons/ResourcesIcon').default;
const SettingsIcon = require('../../src/components/icons/SettingsIcon').default;
const SubtractIcon = require('../../src/components/icons/SubtractIcon').default;
const SupportIcon = require('../../src/components/icons/SupportIcon').default;
const TransferOrderIcon = require('../../src/components/icons/TransferOrderIcon').default;
const ToolsIcon = require('../../src/components/icons/ToolsIcon').default;
const TransferIcon = require('../../src/components/icons/TransferIcon').default;
const TrashIcon = require('../../src/components/icons/TrashIcon').default;
const ViewReferencesIcon = require('../../src/components/icons/ViewReferencesIcon').default;

const sizes = [24, 48];
const containerStyle = () => {
  return {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: 30,
  };
};
const svgFontSizes = (size) => {
  return{
    fontSize: size,
    margin: 15,
  };
};

<div>
  {sizes.map(size => (
    <div key={size} style={containerStyle()}>
      <AddIcon style={svgFontSizes(size)}/>
      <AdjustInventoryIcon style={svgFontSizes(size)}/> 
      <AppBuilderIcon style={svgFontSizes(size)}/> 
      <ArrowLeftIcon style={svgFontSizes(size)} />
      <ArrowRightIcon style={svgFontSizes(size)}/>
      <ArrowDownIcon style={svgFontSizes(size)} />
      <ArrowUpIcon style={svgFontSizes(size)}/>
      <AuditLogIcon style={svgFontSizes(size)} />
      <CalendarIcon style={svgFontSizes(size)} />
      <CopyIcon style={svgFontSizes(size)} />
      <CloseIcon style={svgFontSizes(size)} />
      <DataLoaderIcon style={svgFontSizes(size)} />
      <DownloadIcon style={svgFontSizes(size)} />
      <DebugIcon style={svgFontSizes(size)} />
      <EditIcon style={svgFontSizes(size)} />
      <EditorsPlaygroundIcon style={svgFontSizes(size)} />
      <ErrorIcon style={svgFontSizes(size)} />
      <EllipsisHorizontalIcon style={svgFontSizes(size)} />
      <EllipsisVerticalIcon style={svgFontSizes(size)}/>
      <ExitIcon style={svgFontSizes(size)} />
      <ExportsIcon style={svgFontSizes(size)} />
      <FilterIcon style={svgFontSizes(size)} />
      <FlowBuilderIcon style={svgFontSizes(size)} />
      <GettingStartedIcon style={svgFontSizes(size)} />
      <HookIcon style={svgFontSizes(size)} />
      <HomeIcon style={svgFontSizes(size)} />
      <MarketplaceIcon style={svgFontSizes(size)} />
      <NotificationsIcon style={svgFontSizes(size)} />
      <PermissionsManageIcon style={svgFontSizes(size)} />
      <PermissionExplorerIcon style={svgFontSizes(size)} />
      <ResourcesIcon style={svgFontSizes(size)} />
      <SettingsIcon style={svgFontSizes(size)} />
      <StacksIcon style={svgFontSizes(size)} />
      <SubtractIcon style={svgFontSizes(size)} />
      <SupportIcon style={svgFontSizes(size)} />
      <TransferIcon style={svgFontSizes(size)} />
      <TransferOrderIcon style={svgFontSizes(size)} />
      <ToolsIcon style={svgFontSizes(size)} />
      <TrashIcon style={svgFontSizes(size)} />
      <ViewReferencesIcon style={svgFontSizes(size)} />
    </div>    
    ))
  }
</div>
```
