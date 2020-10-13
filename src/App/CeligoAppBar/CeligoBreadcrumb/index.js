import React, {useMemo} from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { matchPath, Link, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Breadcrumbs, Typography } from '@material-ui/core';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import { selectors } from '../../../reducers';
import ArrowRightIcon from '../../../components/icons/ArrowRightIcon';
import IntegrationCrumb from './crumbs/Integration';
import MarketplaceCrumb from './crumbs/Marketplace';
import TemplateCrumb from './crumbs/Template';
import CloneCrumb from './crumbs/Clone';
import { IntegrationAppCrumb, StoreCrumb } from './crumbs/IntegrationApp';
import EditResourceTypeCrumb from './crumbs/EditResourceType';
import AddResourceTypeCrumb from './crumbs/AddResourceType';
import suiteScriptRoutes from './suiteScript';
import getRoutePath from '../../../utils/routePaths';
import ConnectorCrumb from './crumbs/Connector';

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
    [theme.breakpoints.down('sm')]: {
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
    breadcrumb: 'Flow Builder',
    childRoutes: [
      { path: '/schedule', breadcrumb: 'Schedule' },
      { path: '/settings', breadcrumb: 'Settings' },
    ],
  },
  {
    path: '/dataLoader/:flowId',
    breadcrumb: 'Data Loader',
    childRoutes: [{ path: '/settings', breadcrumb: 'Settings' }],
  },
];
// These routes are shared for IAs with and without /child/ url segment.
// to keep the code DRY, lets extract the common sub-set of routes.
const integrationAppRoutes = [
  ...flowBuilderRoutes,
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
        path: '/admin',
        breadcrumb: 'Admin',
        childRoutes: [
          { path: '/flows', breadcrumb: 'Flows' },
          { path: '/dashboard', breadcrumb: 'Dashboard' },
          { path: '/connections', breadcrumb: 'Connections' },
          { path: '/readme', breadcrumb: 'Readme' },
          { path: '/users', breadcrumb: 'Users' },
          { path: '/audit', breadcrumb: 'Audit log' },
          { path: '/notifications', breadcrumb: 'Notifications' },
        ],
      },
      ...flowBuilderRoutes,
    ],
  },
  { path: getRoutePath('/dashboard') }, // exclusion of breadcrumb prop will skip this segment.
  {
    path: getRoutePath('/integrationapps/:integrationAppName/:integrationId'),
    breadcrumb: IntegrationAppCrumb,
    childRoutes: [
      ...integrationAppRoutes,
      {
        path: '/child/:storeId',
        breadcrumb: StoreCrumb,
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
    path: getRoutePath('/templates/:integrationAppName/:integrationId'),
    breadcrumb: IntegrationCrumb,
  },
  { path: getRoutePath('/templates'), breadcrumb: 'Templates' },

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
        path: '/:storeId',
        breadcrumb: StoreCrumb,
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
    breadcrumb: 'Integration Apps',
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
        childRoutes: [
          { path: '/preview', breadcrumb: 'Clone-details' },
          { path: '/setup', breadcrumb: 'Install' },
        ],
      },
    ],
  },
  { path: getRoutePath('/recycleBin'), breadcrumb: 'Recycle-bin' },
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
    ],
  },

  { path: getRoutePath('/accesstokens'), breadcrumb: 'API tokens' },
  // Dev tools
  { path: getRoutePath('/resources'), breadcrumb: 'Resources' },
  { path: getRoutePath('/editors'), breadcrumb: 'Dev playground' },
  { path: getRoutePath('/permissions'), breadcrumb: 'Permission explorer' },
  { path: getRoutePath('/migrate'), breadcrumb: 'Our new error management' },
  {
    path: getRoutePath('/:resourceType'),
    breadcrumb: ({ resourceType }) => MODEL_PLURAL_TO_LABEL[resourceType] ? `${MODEL_PLURAL_TO_LABEL[resourceType]}s` : '',
  },
];
const commonChildRoutes = [
  // TODO: The clone resource feature will be accessible from various pages and
  // acts like the resource drawer. They share the property of preserving the url and
  // append a /clone route to the end of an existing route url. Possibly more
  // metadata needs to be carried in the url.. keeping it simple for now.
  { path: '/clone', breadcrumb: 'Clone' },
  {
    path: '/add/:resourceType/:id',
    breadcrumb: AddResourceTypeCrumb,
  },
  {
    path: '/edit/:resourceType/:id',
    breadcrumb: EditResourceTypeCrumb,
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
  const breadcrumbs = useMemo(() => [
    { url: getRoutePath(''), breadcrumb: 'Home' },
    ...parseUrl(pathname, shouldShowAppRouting ? routes : []),
  ], [pathname, shouldShowAppRouting]);

  return (
    <Breadcrumbs
      maxItems={4}
      separator={<ArrowRightIcon fontSize="small" />}
      aria-label="breadcrumb"
      className={classes.breadCrumb}>
      {breadcrumbs.map(({ breadcrumb: Crumb, url, isExact, params }) =>
        isExact ? (
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
