import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { matchPath, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Breadcrumbs, Typography } from '@material-ui/core';
import * as selectors from '../../../reducers';
import ArrowRightIcon from '../../../components/icons/ArrowRightIcon';
import IntegrationCrumb from './crumbs/Integration';
import EditResourceTypeCrumb from './crumbs/EditResourceType';

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

const flowBuilderRoutes = [
  {
    path: '/flowBuilder/:flowId',
    breadcrumb: () => 'Flow builder',
    childRoutes: [
      { path: '/schedule', breadcrumb: () => 'Schedule' },
      { path: '/settings', breadcrumb: () => 'Settings' },
      {
        path: '/edit/:resourceType/:id',
        breadcrumb: EditResourceTypeCrumb,
      },
    ],
  },
];

const suiteScriptRoutes = [
  {
    path: '/pg/suitescript/:ssLinkedConnectionId/integrations/:integrationId',
    breadcrumb: IntegrationCrumb,
    childRoutes: [
      {
        path: '/admin',
        breadcrumb: () => 'Admin',
        childRoutes: [
          { path: '/general', breadcrumb: () => 'General' },
          { path: '/legacy', breadcrumb: () => 'Legacy' },
        ],
      },
      { path: '/flows', breadcrumb: () => 'Flows' },
      { path: '/dashboard', breadcrumb: () => 'Dashboard' },
      { path: '/connections', breadcrumb: () => 'Connections' },
      ...flowBuilderRoutes,
    ],
  },
  {
    path: '/pg/suitescript/:ssLinkedConnectionId/integrationapps/:integrationAppName/:integrationId',
    breadcrumb: IntegrationCrumb,
    childRoutes: [
      {
        path: '/admin',
        breadcrumb: () => 'Admin',
        childRoutes: [
          { path: '/general', breadcrumb: () => 'General' },
          { path: '/legacy', breadcrumb: () => 'Legacy' },
        ],
      },
      { path: '/flows', breadcrumb: () => 'Flows' },
      { path: '/dashboard', breadcrumb: () => 'Dashboard' },
      { path: '/connections', breadcrumb: () => 'Connections' },
      ...flowBuilderRoutes,
    ],
  }
];

// Main route table.
const routes = [
  ...suiteScriptRoutes,
];
const commonChildRoutes = [];

function parseUrl(pathname, routes, url = '', params = {}) {
  let crumbs = [];

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

        // possibly child routes? time to recuse.
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

export default function CeligoSuiteScriptBreadcrumb({ location }) {
  const classes = useStyles();
  const shouldShowAppRouting = useSelector(state =>
    selectors.shouldShowAppRouting(state)
  );
  const breadcrumbs = [
    { url: '/pg', breadcrumb: () => 'Home' },
    ...parseUrl(location, shouldShowAppRouting ? routes : []),
  ];

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
            <Crumb {...params} />
          </Typography>
        ) : (
          <Link key={url} color="inherit" to={url}>
            <div className={classes.crumb}>
              <Crumb {...params} />
            </div>
          </Link>
        )
      )}
    </Breadcrumbs>
  );
}
