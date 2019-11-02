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
      {
        path: '/pg/integrations/:integrationId/dashboard',
        breadcrumb: () => 'Dashboard',
      },
      {
        path: '/pg/integrations/:integrationId/settings/flows',
        breadcrumb: () => 'Flows',
      },
      {
        path: '/pg/integrations/:integrationId/settings/general',
        breadcrumb: () => 'General',
      },
      {
        path: '/pg/integrations/:integrationId/settings/users',
        breadcrumb: () => 'Users',
      },
      {
        path: '/pg/integrations/:integrationId/settings/audit',
        breadcrumb: () => 'Audit log',
      },
      {
        path: '/pg/integrations/:integrationId/settings/connections',
        breadcrumb: () => 'Connections',
      },
      {
        path: '/pg/integrations/:integrationId/settings/notifications',
        breadcrumb: () => 'Notifications',
      },
      {
        path: '/pg/integrations/:integrationId/flowBuilder/:flowId',
        breadcrumb: () => 'Flow builder',
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

function parseUrl(pathname, routes) {
  const segments = [];

  // stop iterating once we find a match. (return true)
  routes.some(r => {
    const match = matchPath(pathname, r);

    if (match) {
      // Some routes may not be desired in the breadcrumb...
      // we handle this by not including a breadcrumb prop in the route metadata
      if (r.breadcrumb) {
        segments.push({ ...match, breadcrumb: r.breadcrumb });
      }

      // is there more of the url to parse? possibly child routes? time to recuse.
      if (!match.isExact && r.childRoutes) {
        parseUrl(pathname, r.childRoutes).forEach(s => segments.push(s));
      }

      return true;
    }

    return false;
  });

  return segments;
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
      {breadcrumbs.map(({ breadcrumb: Breadcrumb, url, isExact, params }) =>
        isExact ? (
          <Typography key={url} variant="body2" className={classes.activeCrumb}>
            <Breadcrumb {...params} />
          </Typography>
        ) : (
          <Link key={url} color="inherit" to={url}>
            <Breadcrumb {...params} />
          </Link>
        )
      )}
    </Breadcrumbs>
  );
}
