Icons Components
```js
const colors = require('../../src/theme/colors.js').default;
const AddIcon = require('../../src/components/icons/AddIcon').default;
const AdjustInventoryIcon = require('../../src/components/icons/AdjustInventoryIcon').default;
const AppBuilderIcon = require('../../src/components/icons/AppBuilderIcon').default;
const ArrowLeftIcon = require('../../src/components/icons/ArrowLeftIcon').default;
const AgentsIcon = require('../../src/components/icons/AgentsIcon').default;
const ArrowRightIcon = require('../../src/components/icons/ArrowRightIcon').default;
const ArrowDownIcon = require('../../src/components/icons/ArrowDownIcon').default;
const ArrowUpIcon = require('../../src/components/icons/ArrowUpIcon').default;
const AuditLogIcon = require('../../src/components/icons/AuditLogIcon').default;
const CalendarIcon = require('../../src/components/icons/CalendarIcon').default;
const CloseIcon = require('../../src/components/icons/CloseIcon').default;
const CopyIcon = require('../../src/components/icons/CopyIcon').default;
const ConnectionsIcon = require('../../src/components/icons/ConnectionsIcon').default;
const DataTransformationIcon = require('../../src/components/icons/DataTransformationIcon').default;
const DataLoaderIcon = require('../../src/components/icons/DataLoaderIcon').default;
const DebugIcon = require('../../src/components/icons/DebugIcon').default;
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
const HelpIcon = require('../../src/components/icons/HelpIcon').default;
const HomeIcon = require('../../src/components/icons/HomeIcon').default;
const HookIcon = require('../../src/components/icons/HookIcon').default;
const InfoIcon = require('../../src/components/icons/InfoIcon').default;
const InstallIcon = require('../../src/components/icons/InstallIcon').default;
const ImportsIcon = require('../../src/components/icons/ImportsIcon').default;
const KnowledgeBaseIcon = require('../../src/components/icons/KnowledgeBaseIcon').default;
const MapDataIcon = require('../../src/components/icons/MapDataIcon').default;
const MarketplaceIcon = require('../../src/components/icons/MarketplaceIcon').default;
const NotificationsIcon = require('../../src/components/icons/NotificationsIcon').default;
const PermissionsManageIcon = require('../../src/components/icons/PermissionsManageIcon').default;
const PermissionExplorerIcon = require('../../src/components/icons/PermissionExplorerIcon').default;
const ResourcesIcon = require('../../src/components/icons/ResourcesIcon').default;
const StacksIcon = require('../../src/components/icons/StacksIcon').default;
const SuccessIcon = require('../../src/components/icons/SuccessIcon').default;
const ScriptsIcon = require('../../src/components/icons/ScriptsIcon').default;
const SearchIcon = require('../../src/components/icons/SearchIcon').default;
const SettingsIcon = require('../../src/components/icons/SettingsIcon').default;
const SubtractIcon = require('../../src/components/icons/SubtractIcon').default;
const SupportIcon = require('../../src/components/icons/SupportIcon').default;
const TransferOrderIcon = require('../../src/components/icons/TransferOrderIcon').default;
const ToolsIcon = require('../../src/components/icons/ToolsIcon').default;
const TransferIcon = require('../../src/components/icons/TransferIcon').default;
const TrashIcon = require('../../src/components/icons/TrashIcon').default;
const ViewReferencesIcon = require('../../src/components/icons/ViewReferencesIcon').default;
const WarningIcon = require('../../src/components/icons/WarningIcon').default;

const container = {
  display: 'grid',
  gridTemplateColumns: `repeat(8, 1fr)`,
}
const wrapper = {
  margin: 15,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};
const icon = {
    fontSize: 24,
    background: colors.celigoNeutral2,
    borderRadius: '10%',
    color: colors.celigoNeutral8,
    padding: 10,
    border: '1px solid',
    borderColor: colors.celigoNeutral3,
};
const title = {
  whiteSpace: 'nowrap',
};

<div style={container}>
    <div style={wrapper}>
        <AddIcon style={icon}/>
        <p style={title}>Add</p>
    </div>
    <div style={wrapper}>
      <AdjustInventoryIcon style={icon}/> 
      <p style={title}>AdjustInventory</p>
    </div>
    <div style={wrapper}>
      <AppBuilderIcon style={icon}/> 
      <p style={title}>AppBuilder</p>
    </div>
    <div style={wrapper}>
      <AgentsIcon style={icon}/> 
      <p style={title}>Agents</p>
    </div>
    <div style={wrapper}>
        <ArrowLeftIcon style={icon} />
      <p style={title}>ArrowLeft</p>
    </div>
    <div style={wrapper}>
      <ArrowRightIcon style={icon}/>
      <p style={title}>ArrowRight</p>
    </div>
    <div style={wrapper}>
      <ArrowDownIcon style={icon}/>
      <p style={title}>ArrowDown</p>
    </div>
    <div style={wrapper}>
      <ArrowUpIcon style={icon}/>
      <p style={title}>ArrowUp</p>
    </div>
    <div style={wrapper}>
      <AuditLogIcon style={icon}/>
      <p style={title}>AuditLog</p>
    </div>
    <div style={wrapper}>
      <CalendarIcon style={icon}/>
      <p style={title}>Calendar</p>
    </div>
    <div style={wrapper}>
      <CloseIcon style={icon}/>
      <p style={title}>Close</p>
    </div>
    <div style={wrapper}>
      <CopyIcon style={icon} />
      <p style={title}>Copy</p>
    </div>
    <div style={wrapper}>
      <ConnectionsIcon style={icon} />
      <p style={title}>Connections</p>
    </div>
    <div style={wrapper}>
      <DataTransformationIcon style={icon} />
      <p style={title}>DataTransformation</p>
    </div>
    <div style={wrapper}>
      <DataLoaderIcon style={icon} />
      <p style={title}>DataLoader</p>
    </div>
    <div style={wrapper}>
      <DebugIcon style={icon} />
      <p style={title}>Debug</p>
    </div>
     <div style={wrapper}>
      <DownloadIcon style={icon} />
      <p style={title}>Download</p>
    </div>
     <div style={wrapper}>
      <EditIcon style={icon} />
      <p style={title}>Edit</p>
    </div>
     <div style={wrapper}>
      <EditorsPlaygroundIcon style={icon} />
      <p style={title}>EditorsPlayground </p>
    </div>
     <div style={wrapper}>
      <ErrorIcon style={icon} />
      <p style={title}>Error</p>
    </div>
     <div style={wrapper}>
      <EllipsisHorizontalIcon style={icon} />
      <p style={title}>EllipsisHorizontal </p>
    </div>
     <div style={wrapper}>
      <EllipsisVerticalIcon style={icon} />
      <p style={title}>EllipsisVertical </p>
    </div>
     <div style={wrapper}>
      <ExitIcon style={icon} />
      <p style={title}>Exit</p>
    </div>
     <div style={wrapper}>
      <ExportsIcon style={icon} />
      <p style={title}>Exports</p>
    </div>
     <div style={wrapper}>
      <FilterIcon style={icon} />
      <p style={title}>Filter</p>
    </div>
     <div style={wrapper}>
      <FlowBuilderIcon style={icon} />
      <p style={title}>FlowBuilder</p>
    </div>
     <div style={wrapper}>
      <GettingStartedIcon style={icon} />
      <p style={title}>GettingStarted</p>
    </div>
     <div style={wrapper}>
      <HelpIcon style={icon} />
      <p style={title}>Help</p>
    </div>
     <div style={wrapper}>
      <HomeIcon style={icon} />
      <p style={title}>Home</p>
    </div>
    <div style={wrapper}>
      <HookIcon style={icon} />
      <p style={title}>Hook</p>
    </div>
    <div style={wrapper}>
      <InfoIcon style={icon} />
      <p style={title}>Info</p>
    </div>
    <div style={wrapper}>
      <InstallIcon style={icon} />
      <p style={title}>Install</p>
    </div>
    <div style={wrapper}>
      <ImportsIcon style={icon} />
      <p style={title}>Imports</p>
    </div>
    <div style={wrapper}>
      <KnowledgeBaseIcon style={icon} />
      <p style={title}>KnowledgeBase</p>
    </div>
    <div style={wrapper}>
      <MapDataIcon style={icon} />
      <p style={title}>MapData</p>
    </div>
    <div style={wrapper}>
      <MarketplaceIcon style={icon} />
      <p style={title}>Marketplace</p>
    </div>
    <div style={wrapper}>
      <NotificationsIcon style={icon} />
      <p style={title}>Notifications</p>
    </div>
    <div style={wrapper}>
      <PermissionsManageIcon style={icon} />
      <p style={title}>PermissionsManage</p>
    </div>
    <div style={wrapper}>
      <PermissionExplorerIcon style={icon} />
      <p style={title}>PermissionExplorer</p>
    </div>
     <div style={wrapper}>
      <ResourcesIcon style={icon} />
      <p style={title}>Resources</p>
    </div>
    <div style={wrapper}>
      <StacksIcon style={icon} />
      <p style={title}>Stacks</p>
    </div>
    <div style={wrapper}>
      <SuccessIcon style={icon} />
      <p style={title}>Success</p>
    </div>
    <div style={wrapper}>
      <ScriptsIcon style={icon} />
      <p style={title}>Scripts</p>
    </div>
    <div style={wrapper}>
      <SearchIcon style={icon} />
      <p style={title}>Search</p>
    </div>
    <div style={wrapper}>
      <SettingsIcon style={icon} />
      <p style={title}>Settings</p>
    </div>
    <div style={wrapper}>
      <SubtractIcon style={icon} />
      <p style={title}>Subtract</p>
    </div>
    <div style={wrapper}>
      <SupportIcon style={icon} />
      <p style={title}>Support</p>
    </div>
    <div style={wrapper}>
      <TransferOrderIcon style={icon} />
      <p style={title}>TransferOrder</p>
    </div>
    <div style={wrapper}>
      <ToolsIcon style={icon} />
      <p style={title}>ToolsIcon</p>
    </div>
    <div style={wrapper}>
      <TransferIcon style={icon} />
      <p style={title}>Transfer</p>
    </div>
    <div style={wrapper}>
      <TrashIcon style={icon} />
      <p style={title}>Trash</p>
    </div>
    <div style={wrapper}>
      <ViewReferencesIcon style={icon} />
      <p style={title}>ViewReferences</p>
    </div>
    <div style={wrapper}>
      <WarningIcon style={icon} />
      <p style={title}>Warning</p>
    </div>
</div>
```
