import HomeIcon from '../../components/icons/HomeIcon';
import DashboardIcon from '../../components/icons/DashboardIcon';
import ToolsIcon from '../../components/icons/ToolsIcon';
import ResourcesIcon from '../../components/icons/ResourcesIcon';
import MarketplaceIcon from '../../components/icons/MarketplaceIcon';
import ExportsIcon from '../../components/icons/ExportsIcon';
import FlowBuilderIcon from '../../components/icons/FlowBuilderIcon';
import DataLoaderIcon from '../../components/icons/DataLoaderIcon';
import FileIcon from '../../components/icons/FileIcon';
import EditorsPlaygroundIcon from '../../components/icons/EditorsPlaygroundIcon';
import ConnectionsIcon from '../../components/icons/ConnectionsIcon';
import AgentsIcon from '../../components/icons/AgentsIcon';
import ScriptsIcon from '../../components/icons/ScriptsIcon';
import ImportsIcon from '../../components/icons/ImportsIcon';
import StacksIcon from '../../components/icons/StacksIcon';
import SubmitTicketIcon from '../../components/icons/SubmitTicketIcon';
import RecycleBinIcon from '../../components/icons/RecycleBinIcon';
import TokensApiIcon from '../../components/icons/TokensApiIcon';
import WhatsNewIcon from '../../components/icons/KnowledgeBaseIcon';
import { getHelpUrl, getUniversityUrl } from '../../utils/resource';
import { SUBMIT_TICKET_URL, USER_ACCESS_LEVELS, WHATS_NEW_URL } from '../../utils/constants';
import UniversityIcon from '../../components/icons/UniversityIcon';
import HelpCenterIcon from '../../components/icons/HelpCenterIcon';
import HelpIcon from '../../components/icons/HelpIcon';
import MyApiIcon from '../../components/icons/MyApiIcon';
import IntegrationAppsIcon from '../../components/icons/IntegrationAppsIcon';
import getRoutePath from '../../utils/routePaths';

export default function menuItems(
  userProfile,
  accessLevel,
  integrations,
  canUserPublish,
  marketplaceConnectors,
  isUserInErrMgtTwoDotZero,
) {
  const isDeveloper = userProfile && userProfile.developer;
  let items = [
    {
      label: 'Home',
      Icon: HomeIcon,
      path: '/',
      routeProps: {
        path: [getRoutePath(''), getRoutePath('/home')],
        exact: true,
      },
    },
    {
      label: 'Dashboard',
      Icon: DashboardIcon,
      path: '/dashboard',
    },
    {
      label: 'Tools',
      routeProps: [
        getRoutePath('/integrations/:integrationId/flowBuilder'),
        getRoutePath('/integrations/:integrationId/dataLoader'),
        getRoutePath('/eventreports'),
      ],
      Icon: ToolsIcon,
      children: [
        {
          label: 'Flow Builder',
          Icon: FlowBuilderIcon,
          path: '/integrations/none/flowBuilder/new',
          routeProps: getRoutePath('/integrations/:integrationId/flowBuilder'),
        },
        {
          label: 'Data Loader',
          Icon: DataLoaderIcon,
          path: '/integrations/none/dataLoader/new',
          routeProps: getRoutePath('/integrations/:integrationId/dataloader'),
        },
        {
          label: 'Reports',
          Icon: FileIcon,
          path: '/reports',
          routeProps: getRoutePath('/reports'),
        },
        {
          label: 'Dev playground',
          Icon: EditorsPlaygroundIcon,
          path: '/playground',
        },
      ],
    },
    {
      label: 'Resources',
      Icon: ResourcesIcon,
      routeProps: [
        getRoutePath('/exports'),
        getRoutePath('/imports'),
        getRoutePath('/connections'),
        getRoutePath('/scripts'),
        getRoutePath('/agents'),
        getRoutePath('/stacks'),
        getRoutePath('/templates'),
        getRoutePath('/connectors'),
        getRoutePath('/recycleBin'),
        getRoutePath('/accessTokens'),
        getRoutePath('/apis'),
      ],
      children: [
        { label: 'Connections', path: '/connections', Icon: ConnectionsIcon },
        { label: 'Imports', path: '/imports', Icon: ImportsIcon },
        { label: 'Exports', path: '/exports', Icon: ExportsIcon },
        { label: 'Scripts', path: '/scripts', Icon: ScriptsIcon },
        { label: 'Agents', path: '/agents', Icon: AgentsIcon },
        { label: 'Stacks', path: '/stacks', Icon: StacksIcon },
        { label: 'My APIs', path: '/apis', Icon: MyApiIcon },
        { label: 'API tokens', path: '/accesstokens', Icon: TokensApiIcon },
        { label: 'Templates', path: '/templates', Icon: DataLoaderIcon },
        { label: 'Integration apps', Icon: IntegrationAppsIcon, path: '/connectors' },
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
          dataTest: 'help_center',
        },
        {
          label: "What's new",
          Icon: WhatsNewIcon,
          component: 'a',
          href: WHATS_NEW_URL,
        },
        {
          label: 'Submit ticket',
          Icon: SubmitTicketIcon,
          component: 'a',
          href: SUBMIT_TICKET_URL,
        },
      ],
    },
    {
      label: 'Celigo University',
      Icon: UniversityIcon,
      href: getUniversityUrl,
      component: 'a',
      dataTest: 'celigo_university',
    },
    {
      label: 'Marketplace',
      Icon: MarketplaceIcon,
      path: '/marketplace',
    },
  ];

  if (!isUserInErrMgtTwoDotZero) {
    items = items.filter(i => !['Dashboard'].includes(i.label));
  }

  if (['monitor', 'tile'].includes(accessLevel)) {
    items = items.filter(i => !['Resources'].includes(i.label));
    const toolsSubSectIndex = items.findIndex(i => i.label === 'Tools');

    items[toolsSubSectIndex].children = items[toolsSubSectIndex].children.filter(i => ['Reports', 'Dev playground'].includes(i.label));
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

    if (!canUserPublish) {
      resourceItems.children = resourceItems.children.filter(
        i => !(i.label === 'Templates' || i.label === 'Integration apps')
      );
    }

    if (accessLevel !== USER_ACCESS_LEVELS.ACCOUNT_OWNER && accessLevel !== USER_ACCESS_LEVELS.ACCOUNT_ADMIN) {
      resourceItems.children = resourceItems.children.filter(
        i => !(i.label === 'API tokens' || i.label === 'My APIs')
      );
    }
  }

  return items;
}
