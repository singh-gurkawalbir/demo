import React, {useMemo} from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { matchPath, Link, useLocation } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Breadcrumbs, Typography } from '@mui/material';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import { selectors } from '../../../reducers';
import ArrowRightIcon from '../../../components/icons/ArrowRightIcon';
import IntegrationCrumb from './crumbs/Integration';
import MarketplaceCrumb from './crumbs/Marketplace';
import TemplateCrumb from './crumbs/Template';
import CloneCrumb from './crumbs/Clone';
import { IntegrationAppCrumb, ChildCrumb } from './crumbs/IntegrationApp';
import EditResourceTypeCrumb from './crumbs/EditResourceType';
import AddResourceTypeCrumb from './crumbs/AddResourceType';
import suiteScriptRoutes from './suiteScript';
import getRoutePath from '../../../utils/routePaths';
import ConnectorCrumb from './crumbs/Connector';
import {HOME_PAGE_PATH} from '../../../constants';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import FlowStepDebugLogs from './crumbs/FlowStepDebugLogs';
import FlowGroupCrumb from './crumbs/FlowGroup';

const modelLabelToPlural = resourceType => MODEL_PLURAL_TO_LABEL[resourceType] ? `${MODEL_PLURAL_TO_LABEL[resourceType]}s` : '';
const useStyles = makeStyles(theme => ({
  breadCrumb: {
    flexGrow: 1,
    '& li': {
      fontSize: 13,
      '& a': {
        color: theme.palette.secondary.light,
        '&:hover': {
          textDecoration: 'none',
          color: theme.palette.primary.main,
        },
      },
    },
  },

  activeCrumb: {
    textTransform: 'unset',
    fontSize: 13,
  },
  crumb: {
    paddingTop: 2,
    maxWidth: 300,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('md')]: {
      maxWidth: 150,
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 200,
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: 300,
    },
  },
}));
// These routes are shared for IA and DIY routes.
const flowBuilderRoutes = [
  {
    path: '/flowBuilder/:flowId',
    breadcrumb: 'Flow builder',
    childRoutes: [
      { path: buildDrawerUrl({path: drawerPaths.FLOW_BUILDER.SCHEDULE}), breadcrumb: 'Schedule' },
      { path: buildDrawerUrl({path: drawerPaths.FLOW_BUILDER.SETTINGS}), breadcrumb: 'Settings' },
    ],
  },
  {
    path: '/dataLoader/:flowId',
    breadcrumb: 'Data loader',
    childRoutes: [{ path: buildDrawerUrl({path: drawerPaths.FLOW_BUILDER.SETTINGS}), breadcrumb: 'Settings' }],
  },
];
// These routes are shared for IAs with and without /child/ url segment.
// to keep the code DRY, lets extract the common sub-set of routes.
const integrationAppRoutes = [
  ...flowBuilderRoutes,
  {
    path: '/flows/sections/:sectionId',
    breadcrumb: FlowGroupCrumb,
    childRoutes: [
      ...flowBuilderRoutes,
    ],
  },
  {
    path: '/admin',
    breadcrumb: 'Admin',
    childRoutes: [
      { path: '/general', breadcrumb: 'General' },
      { path: '/addons', breadcrumb: 'Add-ons' },
      { path: '/dashboard', breadcrumb: 'Dashboard' },
      { path: '/connections', breadcrumb: 'Connections' },
      { path: '/apitokens', breadcrumb: 'Api tokens' },
      { path: '/users', breadcrumb: 'Users' },
      { path: '/audit', breadcrumb: 'Audit log' },
      { path: '/subscription', breadcrumb: 'Subscription' },
      { path: '/uninstall', breadcrumb: 'Uninstall' },
      { path: '/notifications', breadcrumb: 'Notifications' },
      { path: '/apitoken', breadcrumb: 'API tokens' },
      {
        path: '/flows',
        breadcrumb: 'Flows',
        childRoutes: [
          {
            path: '/:section',
            breadcrumb: a => a.section,
            childRoutes: [{ path: '/:section', breadcrumb: a => a.section }],
          },
        ],
      },
    ],
  },
];
// Main route table.
const routes = [
  ...suiteScriptRoutes,
  {
    path: getRoutePath('/integrations/:integrationId/'),
    breadcrumb: IntegrationCrumb,
    childRoutes: [
      {
        path: '/flows/sections/:sectionId',
        breadcrumb: FlowGroupCrumb,
        childRoutes: [
          ...flowBuilderRoutes,
        ],
      },
      { path: '/dashboard', breadcrumb: 'Dashboard' },
      { path: '/connections', breadcrumb: 'Connections' },
      { path: '/users', breadcrumb: 'Users' },
      { path: '/auditlog', breadcrumb: 'Audit log' },
      { path: '/notifications', breadcrumb: 'Notifications' },
      { path: '/analytics', breadcrumb: 'Analytics' },
      { path: '/aliases', breadcrumb: 'Aliases' },
      {
        path: '/admin',
        breadcrumb: 'Admin',
        childRoutes: [
          { path: '/flows', breadcrumb: 'Flows'},
          { path: '/dashboard', breadcrumb: 'Dashboard' },
          { path: '/connections', breadcrumb: 'Connections' },
          { path: '/readme', breadcrumb: 'Readme' },
          { path: '/users', breadcrumb: 'Users' },
          { path: '/audit', breadcrumb: 'Audit log' },
          { path: '/notifications', breadcrumb: 'Notifications' },
        ],
      },
      {
        path: '/revisions',
        breadcrumb: 'Revisions',
      },
      ...flowBuilderRoutes,
    ],
  },
  { path: getRoutePath(HOME_PAGE_PATH) }, // exclusion of breadcrumb prop will skip this segment.
  {
    path: getRoutePath('/integrationapps/:integrationAppName/:integrationId'),
    breadcrumb: IntegrationAppCrumb,
    childRoutes: [
      ...integrationAppRoutes,
      {
        path: '/child/:childId',
        breadcrumb: ChildCrumb,
        childRoutes: integrationAppRoutes,
      },
    ],
  },
  {
    path: getRoutePath('/clone/integrationapps/:integrationAppName/:integrationId'),
    breadcrumb: IntegrationAppCrumb,
    childRoutes: [
      {
        path: '/setup',
        breadcrumb: 'Clone-configure and install',
        childRoutes: integrationAppRoutes,
      },
    ],
  },
  {
    path: getRoutePath('/templates'),
    breadcrumb: 'Templates',
    skipLink: true,
    childRoutes: [
      {
        path: buildDrawerUrl({path: drawerPaths.RESOURCE.ADD}),
        breadcrumb: AddResourceTypeCrumb,
      },
      {
        path: buildDrawerUrl({path: drawerPaths.RESOURCE.EDIT}),
        breadcrumb: EditResourceTypeCrumb,
        childRoutes: [
          { path: '/logs', breadcrumb: FlowStepDebugLogs },
        ],
      },
      {
        path: getRoutePath('/:integrationAppName/:integrationId'),
        breadcrumb: IntegrationCrumb,
        childRoutes: [
          {
            path: '/flows/sections/:sectionId',
            breadcrumb: FlowGroupCrumb,
            childRoutes: [
              ...flowBuilderRoutes,
            ],
          },
          { path: '/dashboard', breadcrumb: 'Dashboard' },
          { path: '/connections', breadcrumb: 'Connections' },
          { path: '/users', breadcrumb: 'Users' },
          { path: '/auditlog', breadcrumb: 'Audit log' },
          { path: '/notifications', breadcrumb: 'Notifications' },
          { path: '/admin', breadcrumb: 'Admin' },
          { path: '/analytics', breadcrumb: 'Analytics' },
          ...flowBuilderRoutes,
        ],
      },
    ],
  },
  {
    path: getRoutePath('/connectors/:integrationId/settings'),
    breadcrumb: IntegrationAppCrumb,
    childRoutes: [
      { path: '/users', breadcrumb: 'Users' },
      { path: '/uninstall', breadcrumb: 'Uninstall' },
      { path: '/connections', breadcrumb: 'Connections' },
      { path: '/tokens', breadcrumb: 'API tokens' },
      { path: '/general', breadcrumb: 'General' },
      { path: '/audit', breadcrumb: 'Audit log' },
      { path: '/subscription', breadcrumb: 'Subscription' },
      { path: '/notifications', breadcrumb: 'Notifications' },
      { path: '/addons', breadcrumb: 'Add-ons' },
      {
        path: '/:childId',
        breadcrumb: ChildCrumb,
        childRoutes: [
          { path: '/users', breadcrumb: 'Users' },
          { path: '/uninstall', breadcrumb: 'Uninstall' },
          { path: '/connections', breadcrumb: 'Connections' },
          { path: '/tokens', breadcrumb: 'API tokens' },
          { path: '/general', breadcrumb: 'General' },
          { path: '/audit', breadcrumb: 'Audit log' },
          { path: '/subscription', breadcrumb: 'Subscription' },
          { path: '/addons', breadcrumb: 'Add-ons' },
          { path: '/notifications', breadcrumb: 'Notifications' },
          { path: '/:section', breadcrumb: a => a.section },
        ],
      },
      { path: '/:section', breadcrumb: a => a.section },
    ],
  },
  {
    path: getRoutePath('/connectors'),
    breadcrumb: 'Integration apps',
    childRoutes: [
      { path: '/edit/:resourceType/:resourceId', breadcrumb: EditResourceTypeCrumb },
      { path: '/add/:resourceType/:resourceId', breadcrumb: AddResourceTypeCrumb },
      { path: '/:connectorId',
        breadcrumb: ConnectorCrumb,
        childRoutes: [
          { path: '/connectorLicenses', breadcrumb: 'Licenses' },
          { path: '/installBase', breadcrumb: 'Install base' }]},
    ],
  },
  {
    path: getRoutePath('/dashboard'),
    breadcrumb: 'Dashboard',
  },
  {
    path: getRoutePath('/marketplace'),
    breadcrumb: 'Marketplace',
    childRoutes: [
      { path: '/:app', breadcrumb: MarketplaceCrumb },
      {
        path: '/templates/:templateId',
        breadcrumb: TemplateCrumb,
        childRoutes: [
          { path: 'preview', breadcrumb: 'Preview' },
          { path: 'install', breadcrumb: 'Install' },
        ],
      },
    ],
  },
  {
    path: getRoutePath('/clone'),
    childRoutes: [
      {
        path: '/:resourceType/:resourceId',
        breadcrumb: CloneCrumb,
        skipLink: true,
        childRoutes: [
          { path: '/preview', breadcrumb: 'Clone details' },
          { path: '/setup', breadcrumb: 'Install' },
        ],
      },
    ],
  },
  { path: getRoutePath('/recycleBin'), breadcrumb: 'Recycle bin' },
  { path: getRoutePath('/productPortal'), breadcrumb: 'Product portal' },
  { path: getRoutePath('/apis'), breadcrumb: 'My APIs' },
  {
    path: getRoutePath('/myAccount'),
    breadcrumb: 'My account',
    childRoutes: [
      { path: '/users', breadcrumb: 'Users' },
      { path: '/profile', breadcrumb: 'Profile' },
      { path: '/subscription', breadcrumb: 'Subscription' },
      { path: '/audit', breadcrumb: 'Audit log' },
      { path: '/transfers', breadcrumb: 'Transfers' },
      { path: '/security', breadcrumb: 'Security' },
    ],
  },

  { path: getRoutePath('/accesstokens'), breadcrumb: 'API tokens' },
  // Dev tools
  { path: getRoutePath('/resources'), breadcrumb: 'Resources' },
  { path: getRoutePath('/playground'), breadcrumb: 'Playground' },
  { path: getRoutePath('/permissions'), breadcrumb: 'Permission explorer' },
  { path: getRoutePath('/migrate'), breadcrumb: 'Our new error management' },
  { path: getRoutePath('/reports'), breadcrumb: 'Reports' },
  {
    path: getRoutePath('/:resourceType'),
    breadcrumb: ({ resourceType }) => modelLabelToPlural(resourceType),
  },
];
const commonChildRoutes = [
  // TODO: The clone resource feature will be accessible from various pages and
  // acts like the resource drawer. They share the property of preserving the url and
  // append a /clone route to the end of an existing route url. Possibly more
  // metadata needs to be carried in the url.. keeping it simple for now.
  { path: '/clone', breadcrumb: 'Clone' },
  {
    path: buildDrawerUrl({path: drawerPaths.RESOURCE.ADD}),
    breadcrumb: AddResourceTypeCrumb,
  },
  {
    path: buildDrawerUrl({path: drawerPaths.RESOURCE.EDIT}),
    breadcrumb: EditResourceTypeCrumb,
    childRoutes: [
      { path: '/logs', breadcrumb: FlowStepDebugLogs },
    ],
  },
];

function parseUrl(pathname, routes, url = '', params = {}) {
  let crumbs = [];

  // console.log(pathname, url, params);

  // stop iterating once we find a match. (return true)
  routes.some(r => {
    const match = matchPath(pathname, r);

    if (match) {
      const newUrl = `${url}${match.url}`;
      const newParams = { ...params, ...match.params };

      // Some routes may not be desired in the breadcrumb...
      // we handle this by not including a breadcrumb prop in the route metadata
      if (r.breadcrumb) {
        crumbs.push({
          ...match,
          // carry forward any params from parent routes in case a child crumb
          // needs parent route params to render (lookup data in app state for example)
          params: newParams,
          url: newUrl,
          breadcrumb: r.breadcrumb,
          skipLink: r.skipLink, // to avoid creating link OR if required, adding Link to child component
        });
      }

      // is there more of the url to parse?
      if (!match.isExact) {
        // drop what was already matched by the parent so we can use
        // relative child paths in the route metadata.
        const childPath = pathname.replace(match.url, '');
        let childCrumbs;

        // possibly child routes? time to recurse.
        if (r.childRoutes) {
          childCrumbs = parseUrl(childPath, r.childRoutes, newUrl, newParams);

          crumbs = [...crumbs, ...childCrumbs];
        }

        // If the match is not exact and the matched route has no
        // child routes, then the remainder of the pathname could match
        // the common child add/edit/clone resource drawer routes.
        if (!childCrumbs || childCrumbs.length === 0) {
          childCrumbs = parseUrl(
            childPath,
            commonChildRoutes,
            newUrl,
            newParams
          );

          crumbs = [...crumbs, ...childCrumbs];
        }
      }

      return true;
    }

    return false;
  });

  return crumbs;
}
export default function CeligoBreadcrumb() {
  const { pathname } = useLocation();

  const classes = useStyles();
  const shouldShowAppRouting = useSelector(state =>
    selectors.shouldShowAppRouting(state)
  );
  const hideBreadcrumbs = useSelector(state =>
    // isMFASetupIncomplete - determines if the user is in incomplete mfa setup where he can only access Security/MFA page where we do not need breadcrumb
    !selectors.mfaSessionInfoStatus(state) || selectors.isMFASetupIncomplete(state)
  );
  const breadcrumbs = useMemo(() => [
    { url: getRoutePath(''), breadcrumb: 'Home' },
    ...parseUrl(pathname, shouldShowAppRouting ? routes : []),
  ], [pathname, shouldShowAppRouting]);

  if (hideBreadcrumbs) {
    // renders an empty Div so as to use classes.breadCrumb and handle UI to not distort due to flex
    // todo:@Azhar/Karthik can be handled to not render from parent component itself
    return <div className={classes.breadCrumb} />;
  }

  return (
    <Breadcrumbs
      maxItems={4}
      separator={<ArrowRightIcon fontSize="small" />}
      aria-label="breadcrumb"
      className={classes.breadCrumb}>
      {breadcrumbs.map(({ breadcrumb: Crumb, url, isExact, params, skipLink }) =>
        (isExact || skipLink) ? (
          <Typography
            key={url}
            variant="body2"
            className={clsx(classes.activeCrumb, classes.crumb)}>
            {typeof Crumb === 'function' ? <Crumb {...params} /> : Crumb}
          </Typography>
        ) : (
          <Link key={url} color="inherit" to={url}>
            <div className={classes.crumb}>
              {typeof Crumb === 'function' ? <Crumb {...params} /> : Crumb}
            </div>
          </Link>
        )
      )}
    </Breadcrumbs>
  );
}
