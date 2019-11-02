import { matchPath } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Breadcrumbs, Link, Typography } from '@material-ui/core';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import ArrowRightIcon from '../../../components/icons/ArrowRightIcon';
import IntegrationSegment from './segments/IntegrationSegment';

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

  addons: {
    textTransform: 'unset',
    fontSize: 13,
  },
}));
const routes = [
  {
    path: '/pg/integrations/:integrationId/',
    render: IntegrationSegment,
    childRoutes: [
      {
        path: '/pg/integrations/:integrationId/dashboard',
        render: () => 'Dashboard',
      },
      {
        path: '/pg/integrations/:integrationId/settings/flows',
        render: () => 'Flows',
      },
      {
        path: '/pg/integrations/:integrationId/settings/general',
        render: () => 'General',
      },
      {
        path: '/pg/integrations/:integrationId/settings/users',
        render: () => 'Users',
      },
      {
        path: '/pg/integrations/:integrationId/settings/audit',
        render: () => 'Audit',
      },
      {
        path: '/pg/integrations/:integrationId/settings/connections',
        render: () => 'Connections',
      },
      {
        path: '/pg/integrations/:integrationId/settings/notifications',
        render: () => 'Notifications',
      },
      {
        path: '/pg/integrations/:integrationId/flowBuilder/:flowId',
        render: () => 'Flow builder',
      },
    ],
  },
  {
    path: '/pg/connectors/:connectorId/connectorLicenses',
    render: () => 'licenses',
  },
  {
    path: '/pg/connectors/:connectorId/installBase',
    render: () => 'installBase',
  },
  { path: '/pg/dashboard' }, // exclusion of render prop will skip this segment.
  { path: '/pg/connectors', render: () => 'Connectors' },
  { path: '/pg/marketplace', render: () => 'Marketplace' },
  { path: '/pg/recycleBin', render: () => 'Recycle-bin' },
  { path: '/pg/resources', render: () => 'Resources' },
  { path: '/pg/editors', render: () => 'Editors Playground' },
  { path: '/pg/permissions', render: () => 'permissions' },
  { path: '/pg/myAccount', render: () => 'My account' },
  { path: '/pg/templates', render: () => 'Templates' },
  { path: '/pg/accesstokens', render: () => 'Access Tokens' },
  {
    path: '/pg/:resourceType',
    render: ({ resourceType }) => `${MODEL_PLURAL_TO_LABEL[resourceType]}s`,
  },
];

function parseUrl(pathname, routes) {
  const segments = [];

  // stop iterating once we find a match. (return true)
  routes.some(r => {
    const match = matchPath(pathname, r);

    if (match) {
      // Some routes may not be desired in the breadcrumb...
      // we handle this by not including a render prop in the route metadata
      if (r.render) {
        segments.push({ ...match, render: r.render });
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
    { url: '/pg', render: () => 'Home' },
    ...parseUrl(location, routes),
  ];

  return (
    <Breadcrumbs
      maxItems={3}
      separator={<ArrowRightIcon fontSize="small" />}
      aria-label="breadcrumb"
      className={classes.breadCrumb}>
      {breadcrumbs.map(b =>
        b.isExact ? (
          <Typography key={b.url} variant="body2" className={classes.addons}>
            {b.render(b.params)}
          </Typography>
        ) : (
          <Link key={b.url} color="inherit" href={b.url}>
            {b.render(b.params)}
          </Link>
        )
      )}
    </Breadcrumbs>
  );
}
