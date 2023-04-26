import React from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { CeligoLogo } from '@celigo/fuse-ui';
import MarketingContentWithIframe from '../LoginScreen/MarketingContentWithIframe';
import UserSignInPageFooter from './UserSignInPageFooter';
import { getDomain } from '../../utils/resource';

const useStyles = makeStyles(theme => ({
  userSignInPageContainer: {
    flexGrow: 1,
    display: 'grid',
    gridTemplateColumns: '30% 70%',
    background: theme.palette.background.paper,
    height: '100vh',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '100%',
    },
  },
  logo: {
    width: 150,
    marginBottom: theme.spacing(5),
    paddingTop: theme.spacing(5),
    '& > svg': {
      fill: theme.palette.primary.dark,
    },
  },
  userSignInLeftFooter: {
    position: 'absolute',
    bottom: theme.spacing(8),
    width: 300,
    display: 'flex',
    justifyContent: 'center',
  },
  userSignInLeftContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'relative',
    background: theme.palette.background.paper,
  },
  userSignInLeftContainerForm: {
    width: '300px',
  },
  userSignInLeftHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  userSignInLeftBody: {
    marginBottom: 112,
  },
  title: {
    fontSize: '29px',
    lineHeight: theme.spacing(5),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  subHeading: {
    marginBottom: theme.spacing(2),
  },
  successMsg: {
    color: theme.palette.success.main,
  },
  alertMsg: {
    color: theme.palette.error.dark,
  },
  userSignInRightContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));
export default function UserSignInPage(props) {
  const {
    pageTitle = '',
    pageSubHeading = '',
    successMessage = '',
    alertMessage = '',
    footerLinkLabel = '',
    footerLinkText = '',
    footerLink = '',
    children,
  } = props;
  const classes = useStyles();

  let contentUrl;

  if (pageTitle === 'Sign up') {
    // eslint-disable-next-line no-undef
    contentUrl = (getDomain() === 'eu.integrator.io' ? IO_SIGNUP_PROMOTION_URL_EU : IO_SIGNUP_PROMOTION_URL);
  } else {
  // eslint-disable-next-line no-undef
    contentUrl = (getDomain() === 'eu.integrator.io' ? IO_LOGIN_PROMOTION_URL_EU : IO_LOGIN_PROMOTION_URL);
  }

  return (
    <div className={classes.userSignInPageContainer}>
      <div className={classes.userSignInLeftContainer}>
        <div className={classes.userSignInLeftContainerForm}>
          <div className={classes.userSignInLeftHeader}>
            <div className={classes.logo}>
              <CeligoLogo />
            </div>
            {pageTitle && (
              <Typography variant="h3" className={classes.title}>
                {pageTitle}
              </Typography>
            )}
            {(successMessage || alertMessage) && (
              <Typography
                variant="body2"
                className={clsx(
                  classes.subHeading,
                  { [classes.successMsg]: successMessage },
                  { [classes.alertMsg]: alertMessage }
                )}
              >
                {successMessage || alertMessage}
              </Typography>
            )}
            {pageSubHeading && (
              <Typography variant="body2" className={classes.subHeading}>
                {pageSubHeading}
              </Typography>
            )}
          </div>

          <div className={classes.userSignInLeftBody}>{children}</div>

          <div className={classes.userSignInLeftFooter}>
            <UserSignInPageFooter
              linkLabel={footerLinkLabel}
              linkText={footerLinkText}
              link={footerLink}
            />
          </div>
        </div>
      </div>

      <div className={classes.userSignInRightContainer}>
        <MarketingContentWithIframe contentUrl={contentUrl} />
      </div>
    </div>
  );
}
