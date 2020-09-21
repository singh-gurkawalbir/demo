import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Button } from '@material-ui/core';
import CeligoPageBar from '../../components/CeligoPageBar';
import ButtonGroup from '../../components/ButtonGroup';
import { selectors } from '../../reducers';
import getRoutePath from '../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  upgradeContainer: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.secondary.lightest}`,
  },
  footer: {
    height: 50,
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
}));
export default function UpgradeErrorManagement() {
  const classes = useStyles();
  const history = useHistory();
  const kbURL = 'https://docs.celigo.com/hc/en-us/articles/360048814732';
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  useEffect(() => {
    if (isUserInErrMgtTwoDotZero) {
      // This page is not accessible to EM 2.0 user.. so redirect him to dashboard page
      history.replace(getRoutePath('/'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserInErrMgtTwoDotZero]);

  return (
    <>
      <CeligoPageBar title="We&apos;ve a new and enhanced way to manage errors!" />
      <Paper className={classes.upgradeContainer} elevation={0}>
        <Typography variant="body2">
          Our new error management infrastructure gives you access <a href={`${kbURL}`} rel="noreferrer" target="_blank"> a lot of great new features</a>,
          with many more on the way! This new error management <br /> will eventually be rolled out to all accounts.

          When you upgrade your account to our new error management platform:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">
              It will automatically upgrade all integrations that you have shared with other users
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              You cannot switch to the current error management version. The two platforms are very different and not compatible.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Error count may be lower because our new error management platform is already working for you, resolving duplicate errors during the upgrade process.
            </Typography>
          </li>
        </ul>

        <div className={classes.footer}>
          <ButtonGroup>
            <Button variant="outlined" color="primary" >Upgrade</Button>
            <Button variant="text" color="primary">I&apos;ll do this later</Button>
          </ButtonGroup>
        </div>

      </Paper>
    </>
  );
}
