import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
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
      { label: 'Imports', path: '/imports', Icon: InboxIcon },
      { label: 'Connections', path: '/connections', Icon: MailIcon },
      { label: 'Scripts', path: '/scripts', Icon: MailIcon },
      { label: 'Agents', path: '/agents', Icon: MailIcon },
      { label: 'Stacks', path: '/stacks', Icon: MailIcon },
      { label: 'Templates', path: '/templates', Icon: MailIcon },
    ],
  },
  { label: 'Marketplace', path: '/marketplace', Icon: MarketplaceIcon },
  {
    label: 'Support',
    Icon: SupportIcon,
    children: [
      { label: 'Knowledge base', Icon: InboxIcon },
      { label: 'Support ticket', Icon: MailIcon },
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
