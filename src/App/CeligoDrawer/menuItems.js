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
import IClientsIcon from '../../components/icons/IClientsIcon';
import ScriptsIcon from '../../components/icons/ScriptsIcon';
import ImportsIcon from '../../components/icons/ImportsIcon';
import StacksIcon from '../../components/icons/StacksIcon';
import SubmitTicketIcon from '../../components/icons/SubmitTicketIcon';
import RecycleBinIcon from '../../components/icons/RecycleBinIcon';
import TokensApiIcon from '../../components/icons/TokensApiIcon';
import WhatsNewIcon from '../../components/icons/KnowledgeBaseIcon';
import { getHelpUrl, getUniversityUrl } from '../../utils/resource';
import { SUBMIT_TICKET_URL, USER_ACCESS_LEVELS, WHATS_NEW_URL, HOME_PAGE_PATH, COMMUNITY_URL} from '../../constants';
import UniversityIcon from '../../components/icons/UniversityIcon';
import HelpCenterIcon from '../../components/icons/HelpCenterIcon';
import CommunityIcon from '../../components/icons/CommunityIcon';
import HelpIcon from '../../components/icons/HelpIcon';
import MyApiIcon from '../../components/icons/MyApiIcon';
import IntegrationAppsIcon from '../../components/icons/IntegrationAppsIcon';
import getRoutePath from '../../utils/routePaths';
import PortalIcon from '../../components/icons/PortalIcon';
import { isProduction } from '../../forms/formFactory/utils';

export default function menuItems({
  userProfile,
  accessLevel,
  integrations,
  canUserPublish,
  marketplaceConnectors,
  isUserInErrMgtTwoDotZero,
  isMFASetupIncomplete,
}
) {
  const isDeveloper = userProfile && userProfile.developer;

  if (isMFASetupIncomplete) {
    return [{
      label: 'Help center',
      Icon: HelpCenterIcon,
      component: 'a',
      href: getHelpUrl(integrations, marketplaceConnectors),
      dataTest: 'help_center',
    }];
  }
  let items = [
    {
      label: 'Home',
      Icon: HomeIcon,
      path: '/',
      routeProps: {
        path: [getRoutePath(''), getRoutePath(HOME_PAGE_PATH)],
        exact: true,
      },
    },
    ...(isUserInErrMgtTwoDotZero
      ? [{ label: 'Dashboard',
        Icon: DashboardIcon,
        path: '/dashboard',
        dataTest: 'account-dashboard' }]
      : []),
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
          label: 'Flow builder',
          Icon: FlowBuilderIcon,
          path: '/integrations/none/flowBuilder/new',
          routeProps: getRoutePath('/integrations/:integrationId/flowBuilder'),
        },
        {
          label: 'Data loader',
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
          label: 'Developer playground',
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
        getRoutePath('/iClients'),
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
        { label: 'iClients', path: '/iClients', Icon: IClientsIcon },
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
          label: 'Community',
          Icon: CommunityIcon,
          component: 'a',
          href: COMMUNITY_URL,
          dataTest: 'community',
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
    // Celigo university should only be accessible in production
    ...(isProduction() ? [{
      label: 'Celigo university',
      Icon: UniversityIcon,
      href: getUniversityUrl,
      component: 'a',
      dataTest: 'celigo_university',
    }] : []),
    {
      label: 'Marketplace',
      Icon: MarketplaceIcon,
      path: '/marketplace',
    },
    {
      label: 'Product portal',
      Icon: PortalIcon,
      path: '/productPortal',
    },
  ];

  if (['monitor', 'tile'].includes(accessLevel)) {
    items = items.filter(i => !['Resources'].includes(i.label));
    const toolsSubSectIndex = items.findIndex(i => i.label === 'Tools');
    let toolsSectionMenuItems = ['Reports'];

    if (isDeveloper) {
      toolsSectionMenuItems = [...toolsSectionMenuItems, 'Developer playground'];
    }

    items[toolsSubSectIndex].children = items[toolsSubSectIndex].children.filter(i => toolsSectionMenuItems.includes(i.label));
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
