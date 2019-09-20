import HomeIcon from '../../components/icons/HomeIcon';
import ToolsIcon from '../../components/icons/ToolsIcon';
import ResourcesIcon from '../../components/icons/ResourcesIcon';
import MarketplaceIcon from '../../components/icons/MarketplaceIcon';
import SupportIcon from '../../components/icons/SupportIcon';
import ExportsIcon from '../../components/icons/ExportsIcon';
import FlowBuilderIcon from '../../components/icons/FlowBuilderIcon';
import DataLoaderIcon from '../../components/icons/DataLoaderIcon';
import AppBuilderIcon from '../../components/icons/AppBuilderIcon';
import PermissionExplorerIcon from '../../components/icons/PermissionExplorerIcon';
import EditorsPlaygroundIcon from '../../components/icons/EditorsPlaygroundIcon';
import ConnectionsIcon from '../../components/icons/ConnectionsIcon';
import AgentsIcon from '../../components/icons/AgentsIcon';
import ScriptsIcon from '../../components/icons/ScriptsIcon';
import ImportsIcon from '../../components/icons/ImportsIcon';
import KnowledgeBaseIcon from '../../components/icons/KnowledgeBaseIcon';
import TicketTagIcon from '../../components/icons/TicketTagIcon';

export default [
  { label: 'Home', path: '/', Icon: HomeIcon },
  {
    label: 'Tools',
    Icon: ToolsIcon,
    children: [
      { label: 'Flow builder', path: '/flowbuilder', Icon: FlowBuilderIcon },
      { label: 'Data loader', path: '/dataloader', Icon: DataLoaderIcon },
    ],
  },
  {
    label: 'Resources',
    Icon: ResourcesIcon,
    children: [
      { label: 'Exports', path: '/exports', Icon: ExportsIcon },
      { label: 'Imports', path: '/imports', Icon: ImportsIcon },
      { label: 'Connections', path: '/connections', Icon: ConnectionsIcon },
      { label: 'Scripts', path: '/scripts', Icon: ScriptsIcon },
      { label: 'Agents', path: '/agents', Icon: AgentsIcon },
    ],
  },
  { label: 'Marketplace', path: '/marketplace', Icon: MarketplaceIcon },
  {
    label: 'Support',
    Icon: SupportIcon,
    children: [
      { label: 'Knowledge base', Icon: KnowledgeBaseIcon },
      { label: 'Submit ticket', Icon: TicketTagIcon },
    ],
  },
  {
    label: 'Dev Tools',
    Icon: ToolsIcon,
    children: [
      { label: 'App builder', path: '/resources', Icon: AppBuilderIcon },
      {
        label: 'Editor playground',
        path: '/editors',
        Icon: EditorsPlaygroundIcon,
      },
      {
        label: 'Permission explorer',
        path: '/permissions',
        Icon: PermissionExplorerIcon,
      },
    ],
  },
];
