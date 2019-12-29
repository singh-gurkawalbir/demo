import HomeIcon from '../../components/icons/HomeIcon';
import ToolsIcon from '../../components/icons/ToolsIcon';
import ResourcesIcon from '../../components/icons/ResourcesIcon';
import MarketplaceIcon from '../../components/icons/MarketplaceIcon';
import SupportIcon from '../../components/icons/SupportIcon';
import ExportsIcon from '../../components/icons/ExportsIcon';
import FlowBuilderIcon from '../../components/icons/FlowBuilderIcon';
import DataLoaderIcon from '../../components/icons/DataLoaderIcon';
// import AppBuilderIcon from '../../components/icons/AppBuilderIcon';
import PermissionExplorerIcon from '../../components/icons/PermissionExplorerIcon';
import EditorsPlaygroundIcon from '../../components/icons/EditorsPlaygroundIcon';
import ConnectionsIcon from '../../components/icons/ConnectionsIcon';
import AgentsIcon from '../../components/icons/AgentsIcon';
import ScriptsIcon from '../../components/icons/ScriptsIcon';
import ImportsIcon from '../../components/icons/ImportsIcon';
import StacksIcon from '../../components/icons/StacksIcon';
import KnowledgeBaseIcon from '../../components/icons/KnowledgeBaseIcon';
import TicketTagIcon from '../../components/icons/TicketTagIcon';
import RecycleBinIcon from '../../components/icons/RecycleBinIcon';
import TokensApiIcon from '../../components/icons/TokensApiIcon';

export default function menuItems(userProfile, userPermissions) {
  let items = [
    {
      label: 'Home',
      path: '/',
      Icon: HomeIcon,
    },
    {
      label: 'Flow builder',
      path: '/integrations/none/flowBuilder/new',
      Icon: FlowBuilderIcon,
    },
    // Hiding Tools menu since only flow builder was present.
    // once we have multiple items under tools, we can restore
    // this parent menu node.
    // {
    //   label: 'Tools',
    //   Icon: ToolsIcon,
    //   children: [
    //     // hiding the data loader menu item until we build it.
    //     // { label: 'Data loader', path: '/dataLoader', Icon: DataLoaderIcon },
    //   ],
    // },
    {
      label: 'Resources',
      Icon: ResourcesIcon,
      children: [
        { label: 'Exports', path: '/exports', Icon: ExportsIcon },
        { label: 'Imports', path: '/imports', Icon: ImportsIcon },
        { label: 'Connections', path: '/connections', Icon: ConnectionsIcon },
        { label: 'Scripts', path: '/scripts', Icon: ScriptsIcon },
        { label: 'Agents', path: '/agents', Icon: AgentsIcon },
        { label: 'Stacks', path: '/stacks', Icon: StacksIcon },
        { label: 'Templates', path: '/templates', Icon: DataLoaderIcon },
        {
          label: 'Integration App',
          path: '/connectors',
          Icon: ConnectionsIcon,
        },
        { label: 'API Tokens', path: '/accesstokens', Icon: TokensApiIcon },
        { label: 'Recycle bin', path: '/recycleBin', Icon: RecycleBinIcon },
      ],
    },
    {
      label: 'Marketplace',
      path: '/marketplace',
      Icon: MarketplaceIcon,
    },
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
        // We can add this back once we move back to custom forms
        // and IA feature development.
        // {
        //   label: 'App builder',
        //   path: '/resources',
        //   Icon: AppBuilderIcon,
        // },
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

  if (
    userPermissions &&
    (userPermissions.accessLevel === 'monitor' ||
      userPermissions.accessLevel === 'tile')
  ) {
    items = items.filter(i => i.label !== 'Resources');
  } else {
    const resourceItems = items.find(i => i.label === 'Resources');

    if (userProfile && !userProfile.developer) {
      resourceItems.children = resourceItems.children.filter(
        i => !(i.label === 'Scripts' || i.label === 'Stacks')
      );
    }

    if (userProfile && !userProfile.allowedToPublish) {
      resourceItems.children = resourceItems.children.filter(
        i => !(i.label === 'Templates' || i.label === 'Integration App')
      );
    }

    if (userPermissions && userPermissions.accessLevel !== 'owner') {
      resourceItems.children = resourceItems.children.filter(
        i => i.label !== 'API Tokens'
      );
    }
  }

  return items;
}
