import { matchPath, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Breadcrumbs, Typography } from '@material-ui/core';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import ArrowRightIcon from '../../../components/icons/ArrowRightIcon';
import IntegrationCrumb from './crumbs/Integration';
import MarketplaceCrumb from './crumbs/Marketplace';
import TemplateCrumb from './crumbs/Template';
import IntegrationAppCrumb from './crumbs/IntegrationApp';

const useStyles = makeStyles(theme => ({
  breadCrumb: {
    flexGrow: 1,
    '& li': {
      fontSize: 13,
      '& a': {
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
}));
const routes = [
  {
    path: '/pg/integrations/:integrationId/',
    breadcrumb: IntegrationCrumb,
    childRoutes: [
      { path: '/dashboard', breadcrumb: () => 'Dashboard' },
      { path: '/settings/flows', breadcrumb: () => 'Flows' },
      { path: '/settings/general', breadcrumb: () => 'General' },
      { path: '/settings/users', breadcrumb: () => 'Users' },
      { path: '/settings/audit', breadcrumb: () => 'Audit log' },
      { path: '/settings/connections', breadcrumb: () => 'Connections' },
      { path: '/settings/notifications', breadcrumb: () => 'Notifications' },
      {
        path: '/flowBuilder/:flowId',
        breadcrumb: () => 'Flow builder',
        childRoutes: [
          { path: '/schedule', breadcrumb: () => 'Schedule' },
          { path: '/settings', breadcrumb: () => 'Settings' },
        ],
      },
    ],
  },
  {
    path: '/pg/connectors/:connectorId/connectorLicenses',
    breadcrumb: () => 'licenses',
  },
  {
    path: '/pg/connectors/:connectorId/installBase',
    breadcrumb: () => 'installBase',
  },
  { path: '/pg/dashboard' }, // exclusion of breadcrumb prop will skip this segment.
  {
    path: '/pg/connectors/:integrationId/settings',
    breadcrumb: IntegrationAppCrumb,
    childRoutes: [
      { path: '/users', breadcrumb: () => 'Users' },
      { path: '/uninstall', breadcrumb: () => 'Uninstall' },
      { path: '/connections', breadcrumb: () => 'Connections' },
      { path: '/tokens', breadcrumb: () => 'API Tokens' },
      { path: '/audit', breadcrumb: () => 'Audit Log' },
      { path: '/subscription', breadcrumb: () => 'Subscription' },
      { path: '/notifications', breadcrumb: () => 'Notifications' },
    ],
  },
  {
    path: '/pg/marketplace',
    breadcrumb: () => 'Marketplace',
    childRoutes: [
      { path: '/:app', breadcrumb: MarketplaceCrumb },
      {
        path: '/templates/:templateId',
        breadcrumb: TemplateCrumb,
        childRoutes: [
          { path: 'preview', breadcrumb: () => 'Preview' },
          { path: 'install', breadcrumb: () => 'Install' },
        ],
      },
    ],
  },
  { path: '/pg/recycleBin', breadcrumb: () => 'Recycle-bin' },
  {
    path: '/pg/myAccount',
    breadcrumb: () => 'My account',
    childRoutes: [
      { path: '/users', breadcrumb: () => 'Users' },
      { path: '/profile', breadcrumb: () => 'Profile' },
      { path: '/subscription', breadcrumb: () => 'Subscription' },
      { path: '/audit', breadcrumb: () => 'Audit Log' },
      { path: '/transfers', breadcrumb: () => 'Transfers' },
    ],
  },
  { path: '/pg/templates', breadcrumb: () => 'Templates' },
  { path: '/pg/accesstokens', breadcrumb: () => 'Access Tokens' },
  // Dev tools
  { path: '/pg/resources', breadcrumb: () => 'Resources' },
  { path: '/pg/editors', breadcrumb: () => 'Editor playground' },
  { path: '/pg/permissions', breadcrumb: () => 'Permission Explorer' },
  {
    path: '/pg/:resourceType',
    breadcrumb: ({ resourceType }) => `${MODEL_PLURAL_TO_LABEL[resourceType]}s`,
  },
];
const commonChildRoutes = [
  {
    path: '/:operation/:resourceType/:id',
    breadcrumb: ({ operation, resourceType }) =>
      `${operation === 'add' ? 'Add' : 'Edit'} ${
        MODEL_PLURAL_TO_LABEL[resourceType]
      }`,
  },
  // TODO: clone resource, once complete is accessible from various pages and
  // acts like the resource drawer, in that it preserves the url and simple
  // appends to any existing route url.
];

function parseUrl(pathname, routes, url = '', params = {}) {
  let crumbs = [];

  // stop iterating once we find a match. (return true)
  routes.some(r => {
    const match = matchPath(pathname, r);

    if (match) {
      // Some routes may not be desired in the breadcrumb...
      // we handle this by not including a breadcrumb prop in the route metadata
      if (r.breadcrumb) {
        crumbs.push({
          ...match,
          // carry forward any params from parent routes in case a child crumb
          // needs parent route params to render (lookup data in app state for example)
          params: { ...params, ...match.params },
          url: `${url}${match.url}`,
          breadcrumb: r.breadcrumb,
        });
      }

      // is there more of the url to parse?
      if (!match.isExact) {
        // drop what was already matched by the parent so we can use
        // relative child paths in the route metadata.
        const childPath = pathname.replace(match.url, '');
        let childCrumbs;

        // possibly child routes? time to recuse.
        if (r.childRoutes) {
          childCrumbs = parseUrl(
            childPath,
            r.childRoutes,
            match.url,
            match.params
          );

          crumbs = [...crumbs, ...childCrumbs];
        }

        // If the match is not exact and the matched route has no
        // child routes, then the remainder of the pathname could match
        // the common child add/edit/clone resource drawer routes.
        if (!childCrumbs || childCrumbs.length === 0) {
          childCrumbs = parseUrl(
            childPath,
            commonChildRoutes,
            match.url,
            match.params
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

export default function CeligoBreadcrumb({ location }) {
  const classes = useStyles();
  const breadcrumbs = [
    { url: '/pg', breadcrumb: () => 'Home' },
    ...parseUrl(location, routes),
  ];

  return (
    <Breadcrumbs
      maxItems={4}
      separator={<ArrowRightIcon fontSize="small" />}
      aria-label="breadcrumb"
      className={classes.breadCrumb}>
      {breadcrumbs.map(({ breadcrumb: Crumb, url, isExact, params }) =>
        isExact ? (
          <Typography key={url} variant="body2" className={classes.activeCrumb}>
            <Crumb {...params} />
          </Typography>
        ) : (
          <Link key={url} color="inherit" to={url}>
            <Crumb {...params} />
          </Link>
        )
      )}
    </Breadcrumbs>
  );
}
