import HomeIcon from '../../components/icons/HomeIcon';
import ToolsIcon from '../../components/icons/ToolsIcon';
import ResourcesIcon from '../../components/icons/ResourcesIcon';
import MarketplaceIcon from '../../components/icons/MarketplaceIcon';
import ExportsIcon from '../../components/icons/ExportsIcon';
import FlowBuilderIcon from '../../components/icons/FlowBuilderIcon';
import DataLoaderIcon from '../../components/icons/DataLoaderIcon';
// import AppBuilderIcon from '../../components/icons/AppBuilderIcon';
// import PermissionExplorerIcon from '../../components/icons/PermissionExplorerIcon';
import EditorsPlaygroundIcon from '../../components/icons/EditorsPlaygroundIcon';
import ConnectionsIcon from '../../components/icons/ConnectionsIcon';
import AgentsIcon from '../../components/icons/AgentsIcon';
import ScriptsIcon from '../../components/icons/ScriptsIcon';
import ImportsIcon from '../../components/icons/ImportsIcon';
import StacksIcon from '../../components/icons/StacksIcon';
import TicketTagIcon from '../../components/icons/TicketTagIcon';
import RecycleBinIcon from '../../components/icons/RecycleBinIcon';
import TokensApiIcon from '../../components/icons/TokensApiIcon';
import WhatsNewIcon from '../../components/icons/WhatsNewIcon';
import { getHelpUrl, getUniversityUrl } from '../../utils/resource';
import { SUBMIT_TICKET_URL, WHATS_NEW_URL } from '../../utils/constants';
import UniversityIcon from '../../components/icons/UniversityIcon';
import HelpCenterIcon from '../../components/icons/HelpCenterIcon';
import HelpIcon from '../../components/icons/HelpIcon';
import MyApiIcon from '../../components/icons/MyApiIcon';

export default function menuItems(
  userProfile,
  accessLevel,
  integrations,
  marketplaceConnectors
) {
  const isDeveloper = userProfile && userProfile.developer;
  const canPublish = userProfile && userProfile.allowedToPublish;
  let items = [
    {
      label: 'Home',
      Icon: HomeIcon,
      path: '/',
      routeProps: {
        path: ['/pg', '/pg/dashboard'],
        exact: true,
      },
    },
    {
      label: 'Tools',
      routeProps: [
        '/pg/integrations/:integrationId/flowBuilder',
        '/pg/integrations/:integrationId/dataLoader',
      ],
      Icon: ToolsIcon,
      children: [
        {
          label: 'Flow builder',
          Icon: FlowBuilderIcon,
          path: '/integrations/none/flowBuilder/new',
          routeProps: '/pg/integrations/:integrationId/flowBuilder',
        },
        {
          label: 'Data loader',
          Icon: DataLoaderIcon,
          path: '/integrations/none/dataLoader/new',
          routeProps: '/pg/integrations/:integrationId/dataloader',
        },
        {
          label: 'Dev playground',
          Icon: EditorsPlaygroundIcon,
          path: '/editors',
        },
      ],
    },
    {
      label: 'Resources',
      Icon: ResourcesIcon,
      routeProps: [
        '/pg/exports',
        '/pg/imports',
        '/pg/connections',
        '/pg/scripts',
        '/pg/agents',
        '/pg/stacks',
        '/pg/templates',
        '/pg/connectors',
        '/pg/recycleBin',
        '/pg/accessTokens',
        '/pg/apis',
      ],
      children: [
        { label: 'Exports', path: '/exports', Icon: ExportsIcon },
        { label: 'Imports', path: '/imports', Icon: ImportsIcon },
        { label: 'Connections', path: '/connections', Icon: ConnectionsIcon },
        { label: 'Scripts', path: '/scripts', Icon: ScriptsIcon },
        { label: 'Agents', path: '/agents', Icon: AgentsIcon },
        { label: 'Stacks', path: '/stacks', Icon: StacksIcon },
        { label: 'Templates', path: '/templates', Icon: DataLoaderIcon },
        {
          label: 'Integration apps',
          Icon: ConnectionsIcon,
          path: '/connectors',
        },
        { label: 'My APIs', path: '/apis', Icon: MyApiIcon },
        { label: 'API tokens', path: '/accesstokens', Icon: TokensApiIcon },
        { label: 'Recycle bin', path: '/recycleBin', Icon: RecycleBinIcon },
      ],
    },
    {
      label: 'Help',
      Icon: HelpIcon,
      children: [
        {
          label: 'Help center',
          Icon: HelpCenterIcon,
          component: 'a',
          href: getHelpUrl(integrations, marketplaceConnectors),
        },
        {
          label: "What's New",
          Icon: WhatsNewIcon,
          component: 'a',
          href: WHATS_NEW_URL,
        },
        {
          label: 'Submit ticket',
          Icon: TicketTagIcon,
          component: 'a',
          href: SUBMIT_TICKET_URL,
        },
      ],
    },
    {
      label: 'Celigo University',
      Icon: UniversityIcon,
      href: getUniversityUrl,
      component: 'a'
    },
    {
      label: 'Marketplace',
      Icon: MarketplaceIcon,
      path: '/marketplace',
    },
  ];

  if (['monitor', 'tile'].includes(accessLevel)) {
    items = items.filter(i => !['Resources', 'Tools'].includes(i.label));
  } else {
    const resourceItems = items.find(i => i.label === 'Resources');
    const toolItems = items.find(i => i.label === 'Tools');

    if (!isDeveloper) {
      toolItems.children = toolItems.children.filter(
        i => !i.label.startsWith('Dev play')
      );

      resourceItems.children = resourceItems.children.filter(
        i => !(i.label === 'Scripts' || i.label === 'Stacks' || i.label === 'My APIs')
      );
    }

    if (!canPublish) {
      resourceItems.children = resourceItems.children.filter(
        i => !(i.label === 'Templates' || i.label === 'Integration apps')
      );
    }

    if (accessLevel !== 'owner') {
      resourceItems.children = resourceItems.children.filter(
        i => i.label !== 'API tokens'
      );
    }
  }

  return items;
}
