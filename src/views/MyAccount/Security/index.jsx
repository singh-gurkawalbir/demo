import React from 'react';
import { Switch, Route, useRouteMatch, useLocation, matchPath, useHistory } from 'react-router-dom';
import { Grid, makeStyles } from '@material-ui/core';
import MFA from './MFA';
import SSO from './SSO';
import LeftNav from './LeftNav';

const useStyles = makeStyles(theme => ({
  subNav: {
    minWidth: 200,
    maxWidth: 240,
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    borderRight: 'none',
  },
  content: {
    width: '100%',
  },
}));

export default function Security() {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const { pathname } = useLocation();

  const { mode } = matchPath(pathname, {
    path: `${match.url}/:mode`,
  })?.params || {};

  if (!mode) {
    history.replace(`${match.url}/sso`);
  }

  return (
    <>
      <Grid container wrap="nowrap">
        <Grid item className={classes.subNav}>
          <LeftNav />
        </Grid>
        <Grid item className={classes.content}>
          <Switch>
            <Route path={`${match.url}/sso`}>
              <SSO />
            </Route>
            <Route path={`${match.url}/mfa`}>
              <MFA />
            </Route>
          </Switch>
        </Grid>
      </Grid>
    </>
  );
}

