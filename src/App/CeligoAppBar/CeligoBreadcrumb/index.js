import { matchPath, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Breadcrumbs, Typography } from '@material-ui/core';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import ArrowRightIcon from '../../../components/icons/ArrowRightIcon';
import IntegrationCrumb from './crumbs/Integration';

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
      { path: '/flowBuilder/:flowId', breadcrumb: () => 'Flow builder' },
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
  { path: '/pg/connectors', breadcrumb: () => 'Connectors' },
  { path: '/pg/marketplace', breadcrumb: () => 'Marketplace' },
  { path: '/pg/recycleBin', breadcrumb: () => 'Recycle-bin' },
  { path: '/pg/myAccount', breadcrumb: () => 'My account' },
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

function parseUrl(pathname, routes, params = {}) {
  const crumbs = [];

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
          breadcrumb: r.breadcrumb,
        });
      }

      // is there more of the url to parse?
      if (!match.isExact) {
        // drop what was already matched by the parent so we can use
        // relative child paths in the route metadata.
        const childPath = pathname.replace(match.url, '');

        // possibly child routes? time to recuse.
        if (r.childRoutes) {
          const childCrumbs = parseUrl(childPath, r.childRoutes, match.params);

          childCrumbs.forEach(s => crumbs.push(s));
        } else {
          // TODO: If the match is not exact and the matched route has no
          // child routes, then the remainder of the pathname could match
          // the recursive add/edit resource drawer routes.
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
      maxItems={3}
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
