import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import CeligoLogo from '../CeligoLogo';
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
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '100%',
    },
  },
  logo: {
    width: 150,
    marginBottom: theme.spacing(5),
    '& > svg': {
      fill: theme.palette.primary.dark,
    },
  },
  userSignInLeftFooter: {
    position: 'absolute',
    bottom: theme.spacing(8),
  },
  userSignInLeftContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'relative',
    background: theme.palette.background.paper,

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
    fontSize: '30px',
    lineHeight: `${theme.spacing(5)}px`,
    marginBottom: theme.spacing(2),
  },
  subHeading: {
    marginBottom: theme.spacing(2),
  },
}));
export default function UserSignInPage(props) {
  const {
    pageTitle = '',
    pageSubHeading = '',
    footerLinkLabel = '',
    footerLinkText = '',
    footerLink = '',
    children} = props;
  const classes = useStyles();
  // eslint-disable-next-line no-undef
  const contentUrl = (getDomain() === 'eu.integrator.io' ? IO_LOGIN_PROMOTION_URL_EU : IO_LOGIN_PROMOTION_URL);

  return (
    <div className={classes.userSignInPageContainer}>
      <div className={classes.userSignInLeftContainer}>
        <div className={classes.userSignInLeftHeader}>
          <div className={classes.logo}>
            <CeligoLogo />
          </div>
          <Typography variant="h3" className={classes.title}>
            {pageTitle}
          </Typography>
          {pageSubHeading && (
          <Typography variant="body2" className={classes.subHeading}>
            {pageSubHeading}
          </Typography>
          )}
        </div>

        <div className={classes.userSignInLeftBody}>
          {children}
        </div>

        <div className={classes.userSignInLeftFooter}>
          <UserSignInPageFooter linkLabel={footerLinkLabel} linkText={footerLinkText} link={footerLink} />
        </div>
      </div>

      <div className={classes.userSignInRightContainer}>
        <MarketingContentWithIframe contentUrl={contentUrl} />
      </div>
    </div>
  );
}
