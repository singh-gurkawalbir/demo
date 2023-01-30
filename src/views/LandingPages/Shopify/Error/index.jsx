import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import CeligoLogo from '../../../../components/CeligoLogo';
import getImageUrl from '../../../../utils/image';
import ErrorIcon from '../../../../components/icons/ErrorIcon';
import useQuery from '../../../../hooks/useQuery';

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
  alertMsg: {
    fontSize: 12,
    textAlign: 'left',
    '& > svg': {
      fill: theme.palette.error.main,
      fontSize: theme.spacing(2),
      marginRight: 5,
    },
  },
  errorIcon: {
    fill: theme.palette.error.main,
    // fontSize: theme.spacing(2),
    marginRight: 5,
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
      <div className={classes.headerBorder}>
        <div className="externalLink" onClick={() => { history.goBack(); }}>
          <img src={getImageUrl('/images/backToShopify.png')} alt="backToShopify" />
        </div>
      </div>
      <div className={classes.shopifyBody}>
        <div className={classes.shopifyContentWrapper}>
          <div className={classes.card}>
            <div className={classes.celigoLogoWrapper}>
              <CeligoLogo />
            </div>
            <div className={clsx(classes.miniCard, classes.message)}>
              <Typography
                data-private
                component="div"
                variant="h5"
                className={classes.alertMsg}>
                <ErrorIcon /> Error: iClientDoc does not exist for the iClientId provided in the request
              </Typography>
            </div>
            {/* <div className={classes.minicard1}>

              <ErrorIcon className={classes.errorIcon} />
              <h5><span>Failed to add app.</span><br />
                <span>Error: iClientDoc does not exist for the iClientId provided in the request</span>
              </h5>

            </div> */}
            <div className={classes.miniCard}>
              <h5>
                <Button
                  variant="text" color="secondary" disableElevation className={classes.externalLink}
                  onClick={() => history.goBack()}>Return to Shopify
                </Button> and try again.
              </h5>
              <div className={classes.divider} />
              <h5>If the error persists, <a className={classes.link} href="https://docs.celigo.com/hc/en-us/requests/new" rel="noreferrer" target="_blank">submit a ticket </a>to our support team.</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
