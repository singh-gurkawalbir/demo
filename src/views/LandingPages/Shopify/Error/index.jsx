import React from 'react';
import { Button, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import { CeligoLogo } from '@celigo/fuse-ui';
import useQuery from '../../../../hooks/useQuery';
import ShopifyLandingPageHeader from '../PageHeader';
import NotificationToaster from '../../../../components/NotificationToaster';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    background: theme.palette.background.paper,
  },
  headerBorder: {
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(2),
    height: theme.spacing(10),
  },
  shopifyBody: {
    height: 'calc(100vh - 78px)',
    position: 'relative',
  },
  shopifyContentWrapper: {
    width: '500px',
    position: 'absolute',
    top: 'calc(50% - 78px)',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  card: {
    border: `1px solid ${theme.palette.secondary.lightest}`,
    background: '#F8FAFF',
    boxShadow: '0px 4px 4px rgb(0 0 0 / 25%)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 24px',
    flexWrap: 'wrap',
  },
  celigoLogoWrapper: {
    width: 150,
    marginBottom: theme.spacing(5),
    '& > svg': {
      fill: theme.palette.primary.dark,
    },
  },
  message: {
    border: `1px solid ${theme.palette.error.main}`,
    borderLeftWidth: '6px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniCard: {
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.secondary.lightest}`,
    width: '100%',
    padding: theme.spacing(0, 2),
    borderRadius: '4px',
    marginTop: theme.spacing(2),
    '& h5': {
      fontSize: theme.spacing(1.75),
      margin: '16px 0',
      fontFamily: 'inherit',
      lineHeight: 1.1,
    },
  },
  minicard1: {
    background: theme.palette.background.paper,
    width: '100%',
    padding: theme.spacing(0, 2),
    borderRadius: '4px',
    border: `1px solid ${theme.palette.error.main}`,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderLeftWidth: '6px',
  },
  divider: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    width: theme.spacing(50),
  },

  errorNotification: {
    border: `1px solid ${theme.palette.secondary.lightest}`,
    width: '100%',
    borderRadius: '4px',
    minWidth: '-webkit-fill-available',
    borderLeftWidth: 6,
    boxShadow: 'none',
    '& svg': {
      fill: theme.palette.error.main,
      width: 36,
      height: 24,
      alignSelf: 'center',
    },
    '&:before': {
      content: 'none',
    },
  },
  font: {
    fontSize: theme.spacing(1.75),
    lineHeight: 1.1,
    margin: '8px 0',
    fontFamily: 'inherit',
  },
  buttonRef: {
    padding: 0,
  },
}));

export default function VerifyApp() {
  const classes = useStyles();
  const history = useHistory();
  const query = useQuery();

  const paramObj = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const value of query.keys()) {
    paramObj[value] = query.get(value);
  }

  return (
    <div className={classes.root}>
      <ShopifyLandingPageHeader />
      <div className={classes.shopifyBody}>
        <div className={classes.shopifyContentWrapper}>
          <div className={classes.card}>
            <div className={classes.celigoLogoWrapper}>
              <CeligoLogo />
            </div>
            <NotificationToaster
              variant="error"
              className={classes.errorNotification}
            >
              <Typography
                component="div"
                variant="h5"
                className={classes.font}
              >
                Failed to add app.
                <br />
                Error: {paramObj.errorMessage}
              </Typography>
            </NotificationToaster>
            <div className={classes.miniCard}>
              <Typography
                component="h5"
                variant="h5"
              >
                <span>
                  <Button
                    variant="text"
                    color="primary"
                    disableElevation
                    onClick={() => history.goBack()}
                    className={classes.buttonRef}
                  >
                    Return to Shopify
                  </Button> and try again.
                </span>
              </Typography>
              <div className={classes.divider} />
              <Typography
                component="h5"
                variant="h5"
              >
                If the error persists, <a className={classes.link} href="https://docs.celigo.com/hc/en-us/requests/new" rel="noreferrer" target="_blank">submit a ticket </a>to our support team.
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
