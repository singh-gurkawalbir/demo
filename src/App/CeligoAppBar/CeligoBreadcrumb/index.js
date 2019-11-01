import { makeStyles } from '@material-ui/core/styles';
import { Breadcrumbs, Link, Typography } from '@material-ui/core';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import ArrowRightIcon from '../../../components/icons/ArrowRightIcon';

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
    path: '/pg/integrations/:integrationId/dashboard',
    render: () => 'dashboard',
  },
  {
    path: '/pg/integrations/:integrationId/settings',
    render: () => 'settings',
  },
  {
    path: '/pg/integrations/:integrationId/flowBuilder/:flowId',
    render: () => 'flowbuider',
  },
  {
    path: '/pg/connectors/:connectorId/connectorLicenses',
    render: () => 'licenses',
  },
  {
    path: '/pg/connectors/:connectorId/installBase',
    render: () => 'installBase',
  },
  { path: '/pg/connectors', render: () => 'connectors' },
  { path: '/pg/marketplace', render: () => 'marketplace' },
  { path: '/pg/dashboard', render: () => 'dashboard' },
  { path: '/pg/recycleBin', render: () => 'recycleBin' },
  { path: '/pg/resources', render: () => 'resources' },
  { path: '/pg/editors', render: () => 'editors' },
  { path: '/pg/permissions', render: () => 'permissions' },
  { path: '/pg/myAccount', render: () => 'myAccount' },
  { path: '/pg/templates', render: () => 'templates' },
  { path: '/pg/accesstokens', render: () => 'accesstokens' },
  { path: '/pg/:resourceType', render: () => 'resourceType' },
];

function CeligoBreadcrumb(props) {
  const classes = useStyles();

  console.log(props);

  const { breadcrumbs } = props;

  return (
    <Breadcrumbs
      maxItems={3}
      separator={<ArrowRightIcon fontSize="small" />}
      aria-label="breadcrumb"
      className={classes.breadCrumb}>
      {breadcrumbs.map(({ breadcrumb, match }) =>
        match.isExact ? (
          <Typography
            key={match.url}
            variant="body2"
            className={classes.addons}>
            {breadcrumb}
          </Typography>
        ) : (
          <Link key={match.url} color="inherit" href="/pg">
            {breadcrumb}
          </Link>
        )
      )}
    </Breadcrumbs>
  );
}

export default withBreadcrumbs(routes)(CeligoBreadcrumb);
