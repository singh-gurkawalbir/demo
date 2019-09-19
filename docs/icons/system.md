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
const CloudTransferIcon = require('../../src/components/icons/CloudTransferIcon').default;
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
const ListnerIcon = require('../../src/components/icons/ListnerIcon').default;
const LookUpIcon = require('../../src/components/icons/LookUpIcon').default;
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
  gridTemplateColumns: `repeat(6, 1fr)`,
}
const wrapper = {
  margin: 15,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  
};
const icon = {
    fontSize: 48,
    background: colors.celigoNeutral2,
    borderRadius: '10%',
    color: colors.celigoNeutral6,
    padding: 10,
    border: '1px solid',
    borderColor: colors.celigoNeutral3,
};


<div style={container}>
    <div style={wrapper}>
        <AddIcon style={icon}/>
        <p>Add</p>
    </div>
    <div style={wrapper}>
      <AdjustInventoryIcon style={icon}/> 
      <p>AdjustInventory</p>
    </div>
    <div style={wrapper}>
      <AppBuilderIcon style={icon}/> 
      <p>AppBuilder</p>
    </div>
    <div style={wrapper}>
      <AgentsIcon style={icon}/> 
      <p>Agents</p>
    </div>
    <div style={wrapper}>
        <ArrowLeftIcon style={icon} />
      <p>ArrowLeft</p>
    </div>
    <div style={wrapper}>
      <ArrowRightIcon style={icon}/>
      <p>ArrowRight</p>
    </div>
    <div style={wrapper}>
      <ArrowDownIcon style={icon}/>
      <p>ArrowDown</p>
    </div>
    <div style={wrapper}>
      <ArrowUpIcon style={icon}/>
      <p>ArrowUp</p>
    </div>
    <div style={wrapper}>
      <AuditLogIcon style={icon}/>
      <p>AuditLog</p>
    </div>
    <div style={wrapper}>
      <CalendarIcon style={icon}/>
      <p>Calendar</p>
    </div>
    <div style={wrapper}>
      <CloseIcon style={icon}/>
      <p>Close</p>
    </div>
    <div style={wrapper}>
      <CopyIcon style={icon} />
      <p>Copy</p>
    </div>
    <div style={wrapper}>
      <ConnectionsIcon style={icon} />
      <p>Connections</p>
    </div>
    <div style={wrapper}>
      < CloudTransferIcon style={icon} />
      <p> CloudTransfer(FB)</p>
    </div>
    <div style={wrapper}>
      <DataTransformationIcon style={icon} />
      <p>DataTransformation</p>
    </div>
    <div style={wrapper}>
      <DataLoaderIcon style={icon} />
      <p>DataLoader</p>
    </div>
    <div style={wrapper}>
      <DebugIcon style={icon} />
      <p>Debug</p>
    </div>
     <div style={wrapper}>
      <DownloadIcon style={icon} />
      <p>Download</p>
    </div>
     <div style={wrapper}>
      <EditIcon style={icon} />
      <p>Edit</p>
    </div>
     <div style={wrapper}>
      <EditorsPlaygroundIcon style={icon} />
      <p>EditorsPlayground </p>
    </div>
     <div style={wrapper}>
      <ErrorIcon style={icon} />
      <p>Error</p>
    </div>
     <div style={wrapper}>
      <EllipsisHorizontalIcon style={icon} />
      <p>EllipsisHorizontal </p>
    </div>
     <div style={wrapper}>
      <EllipsisVerticalIcon style={icon} />
      <p>EllipsisVertical </p>
    </div>
     <div style={wrapper}>
      <ExitIcon style={icon} />
      <p>Exit</p>
    </div>
     <div style={wrapper}>
      <ExportsIcon style={icon} />
      <p>Exports</p>
    </div>
     <div style={wrapper}>
      <FilterIcon style={icon} />
      <p>Filter</p>
    </div>
    <div style={wrapper}>
      <FlowBuilderIcon style={icon} />
      <p>FlowBuilder</p>
    </div>
     <div style={wrapper}>
      <GettingStartedIcon style={icon} />
      <p>GettingStarted</p>
    </div>
     <div style={wrapper}>
      <HelpIcon style={icon} />
      <p>Help</p>
    </div>
     <div style={wrapper}>
      <HomeIcon style={icon} />
      <p>Home</p>
    </div>
    <div style={wrapper}>
      <HookIcon style={icon} />
      <p>Hook</p>
    </div>
    <div style={wrapper}>
      <InfoIcon style={icon} />
      <p>Info</p>
    </div>
    <div style={wrapper}>
      <InstallIcon style={icon} />
      <p>Install</p>
    </div>
    <div style={wrapper}>
      <ImportsIcon style={icon} />
      <p>Imports</p>
    </div>
    <div style={wrapper}>
      <KnowledgeBaseIcon style={icon} />
      <p>KnowledgeBase</p>
    </div>
     <div style={wrapper}>
      <ListnerIcon style={icon} />
      <p>Listner (FB)</p>
    </div>
    <div style={wrapper}>
      <LookUpIcon style={icon} />
      <p>LookUp</p>
    </div>
    <div style={wrapper}>
      <MapDataIcon style={icon} />
      <p>MapData</p>
    </div>
    <div style={wrapper}>
      <MarketplaceIcon style={icon} />
      <p>Marketplace</p>
    </div>
    <div style={wrapper}>
      <NotificationsIcon style={icon} />
      <p>Notifications</p>
    </div>
    <div style={wrapper}>
      <PermissionsManageIcon style={icon} />
      <p>PermissionsManage</p>
    </div>
    <div style={wrapper}>
      <PermissionExplorerIcon style={icon} />
      <p>PermissionExplorer</p>
    </div>
     <div style={wrapper}>
      <ResourcesIcon style={icon} />
      <p>Resources</p>
    </div>
    <div style={wrapper}>
      <StacksIcon style={icon} />
      <p>Stacks</p>
    </div>
    <div style={wrapper}>
      <SuccessIcon style={icon} />
      <p>Success</p>
    </div>
    <div style={wrapper}>
      <ScriptsIcon style={icon} />
      <p>Scripts</p>
    </div>
    <div style={wrapper}>
      <SearchIcon style={icon} />
      <p>Search</p>
    </div>
    <div style={wrapper}>
      <SettingsIcon style={icon} />
      <p>Settings</p>
    </div>
    <div style={wrapper}>
      <SubtractIcon style={icon} />
      <p>Subtract</p>
    </div>
    <div style={wrapper}>
      <SupportIcon style={icon} />
      <p>Support</p>
    </div>
    <div style={wrapper}>
      <TransferOrderIcon style={icon} />
      <p>TransferOrder</p>
    </div>
    <div style={wrapper}>
      <ToolsIcon style={icon} />
      <p>ToolsIcon</p>
    </div>
    <div style={wrapper}>
      <TransferIcon style={icon} />
      <p>Transfer</p>
    </div>
    <div style={wrapper}>
      <TrashIcon style={icon} />
      <p>Trash</p>
    </div>
    <div style={wrapper}>
      <ViewReferencesIcon style={icon} />
      <p>ViewReferences</p>
    </div>
    <div style={wrapper}>
      <WarningIcon style={icon} />
      <p>Warning</p>
    </div>
</div>
```
